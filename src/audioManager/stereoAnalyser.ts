function average(arr: Array<number> | Uint8Array) {
  // Prevent returning NaN
  if (!arr.length) {
    return 0;
  }

  let fullValue = 0;
  for (let i = 0; i < arr.length; i += 1) {
    fullValue += arr[i];
  }

  return fullValue / arr.length;
}

const FFT_SIZE = 128;
const SMOOTHING = 0.1;

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
  private audio: HTMLAudioElement;
  private audioContext: AudioContext;
=

  private dataArrayLeft: Uint8Array;
  private dataArrayRight: Uint8Array;
  private analyserLeft: AnalyserNode;
  private analyserRight: AnalyserNode;
  private frameId: number;

  constructor(audio: HTMLAudioElement, audioContext: AudioContext) {
    this.audio = audio;
    this.audioContext = audioContext;
    this.setupAudioNodes();
  }

  /**
   * Construct and connect all the necessary AudioContext nodes
   * @private
   */
  setupAudioNodes() {
    const analyserLeft = this.createAnalyserNode();
    const analyserRight = this.createAnalyserNode();
    const splitter = this.audioContext.createChannelSplitter(2);

    const mediaElement = this.audioContext.createMediaElementSource(this.audio);

    // Plug analysers nodes into separate channels
    splitter.connect(analyserLeft, 0);
    splitter.connect(analyserRight, 1);

    // Plug source into the splitter
    mediaElement.connect(splitter);
    mediaElement.connect(this.audioContext.destination);

    this.dataArrayLeft = new Uint8Array(analyserLeft.frequencyBinCount);
    this.dataArrayRight = new Uint8Array(analyserRight.frequencyBinCount);
    this.analyserLeft = analyserLeft;
    this.analyserRight = analyserRight;
  }

  /**
   * Creates an analyser node and connects context destination
   * @private
   */
  createAnalyserNode() {
    const analysisNode = this.audioContext.createAnalyser();

    analysisNode.smoothingTimeConstant = SMOOTHING;
    analysisNode.fftSize = FFT_SIZE;

    return analysisNode;
  }

  /**
   * Syncs analysis data to `leftChannel` & `rightChannel` on display refresh rate
   * @private
   */
  runAnalysis() {
    const { analyserLeft, analyserRight, dataArrayLeft, dataArrayRight } = this;
    // getByteFrequencyData mutates its arguments
    analyserLeft.getByteFrequencyData(dataArrayLeft);
    analyserRight.getByteFrequencyData(dataArrayRight);

    // Set to frameId so we can cancel later
    this.frameId = window.requestAnimationFrame(this.runAnalysis);
  }

  /**
   * @private
   */
  startAnalyser() {
    this.frameId = this.frameId || requestAnimationFrame(this.runAnalysis);
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
    if (this.audioContext.state !== "suspended") {
      this.startAnalyser();
    }
  }

  pause() {
    this.pauseAnalyser();
  }

  stop() {
    this.pauseAnalyser();
    this.audioContext.close();
  }

  get averageFFT() {
    return [average(this.dataArrayLeft), average(this.dataArrayRight)];
  }

  get rawFFT() {
    return [this.dataArrayLeft, this.dataArrayRight];
  }
}
