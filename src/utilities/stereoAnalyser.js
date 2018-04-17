import autobind from 'utilities/autobind';
import { average } from 'utilities/helpers';

const FFT_SIZE = 128;
const SMOOTHING = 0.45;

// tl;dr; Put stereo audio in, get averaged FFT data out
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
    this.leftChannel = [];
    this.rightChannel = [];
    this.setupAudioNodes();
    autobind(this);
  }

  /**
   * Initializes and connects all the necessary AudioContext nodes for analysis
   * @private
   */
  setupAudioNodes() {
    // Safari is still prefixed
    const AudioContext = window.AudioContext || window.webkitAudioContext;
    this.audioContext = new AudioContext();

    // Initialize analyser nodes
    const analyserLeft = this.createAnalyserNode();
    const analyserRight = this.createAnalyserNode();
    // TODO: Test # of channels before splitting
    const splitter = this.audioContext.createChannelSplitter(2);

    const mediaElement = this.audioContext.createMediaElementSource(this.audio);

    // Plug source into the splitter
    mediaElement.connect(splitter);

    // Plug split channels into separate nodes
    splitter.connect(analyserLeft, 0);
    splitter.connect(analyserRight, 1);

    this.dataArrayLeft = new Uint8Array(analyserLeft.frequencyBinCount);
    this.dataArrayRight = new Uint8Array(analyserRight.frequencyBinCount);
    this.analyserLeft = analyserLeft;
    this.analyserRight = analyserRight;
  }

  /**
   * Creates an analyser nodes and automatically connects
   * it to context destination
   * @private
   */
  createAnalyserNode() {
    const analysisNode = this.audioContext.createAnalyser();

    analysisNode.smoothingTimeConstant = SMOOTHING;
    analysisNode.fftSize = FFT_SIZE;

    // Ensure channel is still audible
    analysisNode.connect(this.audioContext.destination);

    return analysisNode;
  }

  /**
   * Syncs analysis data to `leftChannel` & `rightChannel` on display refresh rate
   * @private
   */
  startAnalysis() {
    const { analyserLeft, analyserRight, dataArrayLeft, dataArrayRight } = this;
    // getByteFrequencyData mutates the arrays
    analyserLeft.getByteFrequencyData(dataArrayLeft);
    analyserRight.getByteFrequencyData(dataArrayRight);
    this.leftChannel = dataArrayLeft;
    this.rightChannel = dataArrayRight;

    // Set to frameId so we can cancel later
    this.frameId = requestAnimationFrame(this.startAnalysis);
  }

  /**
   * @private
   */
  startAnalyser() {
    this.frameId = this.frameId || requestAnimationFrame(this.startAnalysis);
  }

  /**
   * @private
   */
  pauseAnalyser() {
    cancelAnimationFrame(this.frameId);
    this.frameId = undefined;
  }

  // Public methods ahoy
  start() {
    if (this.audioContext.state === 'suspended') {
      this.audioContext.resume();
    }
    this.startAnalyser();
  }

  pause() {
    this.pauseAnalyser();
    this.audioContext.suspend();
  }

  stop() {
    this.pauseAnalyser();
    this.audioContext.close();
  }

  get averageFFT() {
    return {
      leftChannel: average(this.leftChannel),
      rightChannel: average(this.rightChannel),
    };
  }
}
