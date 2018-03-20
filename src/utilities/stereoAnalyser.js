import autobind from 'utilities/autobind';
import { formatTime, average } from 'utilities/helpers';
import { store } from 'index';

const FFT_SIZE = 32;
const SMOOTHING = 0.1;

// tl;dr; Put some audio in, get averaged FFT data out
//
//      +-----------+
//      |   AUDIO   |
//      +-----+-----+
//            |
//            |
//       +-------------------------------------------+
//       |    |          AudioContext                |
//       |-------------------------------------------|
//       |    |     +---------------------+          |
//       |    +---->| MediaElementSource  |-----+    |
//       |          +---------------------+     |    |
//       |                                      |    |
//       |          +---------------------+     |    |
//       |    +-----| ChannelSplitterNode |<----+    |
//       |    |     +---------------------+          |
//       |    |                                      |
//       |    |     +---------------------+          |         +-------------------+
//       |    +---->|    AnalyserNode     |-----+----|-------> | Averaged FFT Data |
//       |          +---------------------+     |    |         +-------------------+
//       |                                      |    |
//       |        +--------------------------+  |    |
//       |    +---| AudioContext.Destination |<-+    |
//       |    |   +--------------------------+       |
//       |    |                                      |
//       +-------------------------------------------+
//            |
//            |
//      +----------+
//      | Speakers |
//      +----+-----+
//

const updateAnalysis = ({ currentTime, leftChannel, rightChannel}) => ({
  type: 'SONG_ANALYSIS',
  data: { currentTime, leftChannel, rightChannel }
});

export default class StereoAnalyser {
  constructor(audio) {
    const defaultOptions = {
      analyser: {
        fftSize: FFT_SIZE,
        smoothingTimeConstant: SMOOTHING,
      },
    };
    this.options = { ...defaultOptions };
    this.audio = audio;
    this.setupRack();
    autobind(this);
  }

  setupRack() {
    const AudioContext =
      window.AudioContext || window.webkitAudioContext || false;
    // TODO: Handle false!

    this.audioContext = new AudioContext();

    const splitter = this.audioContext.createChannelSplitter(2);
    const analyserLeft = this.audioContext.createAnalyser(
      this.options.analyser
    );
    const analyserRight = this.audioContext.createAnalyser(
      this.options.analyser
    );

    // Wire it all up together
    analyserLeft.connect(this.audioContext.destination);
    analyserRight.connect(this.audioContext.destination);
    splitter.connect(analyserRight, 1, 0);
    splitter.connect(analyserLeft, 0, 0);

    this.dataArrayLeft = new Uint8Array(FFT_SIZE * 0.5);
    this.dataArrayRight = new Uint8Array(FFT_SIZE * 0.5);
    this.splitter = splitter;
    this.analyserLeft = analyserLeft;
    this.analyserRight = analyserRight;

    // Initialize all the components in the rack
    const mediaElement = this.audioContext.createMediaElementSource(this.audio);
    mediaElement.connect(this.splitter);
  }

  startAnalysis() {
    const { analyserLeft, analyserRight, dataArrayLeft, dataArrayRight } = this;
    analyserLeft.getByteFrequencyData(dataArrayLeft);
    analyserRight.getByteFrequencyData(dataArrayRight);
    const { currentTime } = this.audio;
    this.leftChannel = average(dataArrayLeft);
    this.rightChannel = average(dataArrayRight);
    this.currentTime = currentTime;
    // store.dispatch(updateAnalysis({
    //   currentTime,
    //   leftChannel,
    //   rightChannel
    // }));

    // TODO: Send values to redux
    this.frameId = requestAnimationFrame(this.startAnalysis);
  }

  getAnalysis() {
    return {
      currentTime: this.currentTime,
      leftChannel: this.leftChannel,
      rightChannel: this.rightChannel
    }
  }

  start() {
    this.frameId = this.frameId || requestAnimationFrame(this.startAnalysis);
  }

  stop() {
    cancelAnimationFrame(this.frameId);
    this.frameId = undefined;
  }

  getContext() {
    return this.audioContext;
  }

  getAudioInfo() {
    const { currentTimeRaw, volumeLeft, volumeRight } = this;
    return {
      currentTime: formatTime(currentTimeRaw),
      currentTimeRaw,
      volumeLeft,
      volumeRight,
    };
  }
}
