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
  constructor(options) {
    const defaultOptions = {
      analyser: {
        fftSize: FFT_SIZE,
        smoothingTimeConstant: SMOOTHING,
      },
    };
    this.options = { ...defaultOptions, options };
    this.setupRack();
    autobind(this);
  }

  setupRack() {
    const AudioContext =
      window.AudioContext || window.webkitAudioContext || false;
    // TODO: Handle false!

    this.audioContext = new AudioContext();

    const splitter = this.audioContext.createChannelSplitter(2);
    const analyserLeft = new AnalyserNode(
      this.audioContext,
      this.options.analyser
    );
    const analyserRight = new AnalyserNode(
      this.audioContext,
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
  }

  startAnalysis(audio) {
    // Initialize all the components in the rack
    const mediaElement = this.audioContext.createMediaElementSource(audio);
    mediaElement.connect(this.splitter);

    const { analyserLeft, analyserRight, dataArrayLeft, dataArrayRight } = this;

    const renderFrame = () => {
      requestAnimationFrame(renderFrame);
      analyserLeft.getByteFrequencyData(dataArrayLeft);
      analyserRight.getByteFrequencyData(dataArrayRight);
      this.currentTime = formatTime(audio.currentTime);
      this.volumeLeft = average(dataArrayLeft);
      this.volumeRight = average(dataArrayRight);
    };

    renderFrame();
  }

  getContext() {
    return this.audioContext;
  }

  getAudioInfo() {
    return {
      currentTime: this.currentTime,
      volumeLeft: this.volumeLeft,
      volumeRight: this.volumeRight,
    };
  }
}
