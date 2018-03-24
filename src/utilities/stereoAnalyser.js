import autobind from 'utilities/autobind';
import { average } from 'utilities/helpers';

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
    this.audio = audio;
    this.leftChannel = [1];
    this.rightChannel = [1];
    this.currentTime = 0;
    this.setupRack();
    autobind(this);
  }

  setupRack() {
    const AudioContext =
      window.AudioContext || window.webkitAudioContext || false;
    // TODO: Handle false!

    this.audioContext = new AudioContext();
    const splitter = this.audioContext.createChannelSplitter(2);
    const analyserLeft = this.audioContext.createAnalyser();

    const analyserRight = this.audioContext.createAnalyser();

    analyserLeft.smoothingTimeConstant = SMOOTHING;
    analyserRight.smoothingTimeConstant = SMOOTHING;
    analyserLeft.fftSize = FFT_SIZE;
    analyserRight.fftSize = FFT_SIZE;

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
    this.leftChannel = dataArrayLeft;
    this.rightChannel = dataArrayRight;
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

  get averageFFT() {
    return {
      leftChannel: average(this.leftChannel),
      rightChannel: average(this.rightChannel),
    };
  }
}
