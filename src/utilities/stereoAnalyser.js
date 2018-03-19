import autobind from 'utilities/autobind';
import { formatTime, average } from 'utilities/helpers';

const FFT_SIZE = 32;
const SMOOTHING = 0.3;

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
    this.currentTimeRaw = this.audio.currentTime;
    this.volumeLeft = average(dataArrayLeft);
    this.volumeRight = average(dataArrayRight);

    // TODO: Send values to redux

    this.frameId = requestAnimationFrame(this.startAnalysis);
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
