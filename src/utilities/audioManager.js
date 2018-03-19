import autobind from 'utilities/autobind';
import StereoAnalyser from 'utilities/stereoAnalyser';
import songSrc from 'songs/sample.mp3';

// https://developer.mozilla.org/en-US/docs/Web/HTML/Element/audio
export default class AudioManager {
  constructor(push) {
    this.currentSong = new Audio();
    this.analyser = new StereoAnalyser(this.currentSong);
    this.currentSong.crossOrigin = 'Anonymous';
    this.currentSong.src = songSrc;
    this.repeat = 'off';

    this.setupEventListeners();
    autobind(this);
  }

  setupEventListeners() {
    // https://developer.mozilla.org/en-US/docs/Web/Guide/Events/Media_events
    this.currentSong.addEventListener('loadstart', () =>
      // TODO: Redux: { loading: true }
      console.log('loadstart')
    );

    this.currentSong.addEventListener('canplaythrough', () =>
      // TODO: Redux: { loading: false }
      this.currentSong.play()
    );

    this.currentSong.addEventListener('play', () =>
      // TODO: Redux: { playing: true, paused: false }
      this.analyser.start()
    );
    this.currentSong.addEventListener('pause', () =>
      // TODO: Redux: { paused: true, playing: false  }
      this.analyser.stop()
    );

    // this.currentSong.addEventListener('ended', () =>
    //   // this.loadNext(); ???
    // );
  }

  // Controls
  togglePlay() {
    const { currentSong } = this;
    if (currentSong.paused || currentSong.ended) {
      // iOS will auto-suspend AudioContext
      // TODO: make this resume more intelligent
      // audioContext.resume();
      currentSong.play();
    } else {
      currentSong.pause();
    }
  }

  nextTrack() {
    this.loadNext();
  }

  previousTrack() {
    console.log('yo yo');
    if (this.currentSong.currentTime >= 2) {
      this.currentSong.currentTime = 0;
    } else {
      this.loadPrevious();
    }
  }

  pause() {
    console.log('pause!');
    this.currentSong.pause();
  }

  stop() {
    this.currentSong.pause();
    this.currentSong.currentTime = 0;
  }

  loadPrevious() {
    console.log('i will do something in the future');
  }
  loadNext() {
    console.log('i will do something in the future');
  }

  toggleRepeat() {
    switch (this.repeat) {
      case 'off':
        this.repeat = 'track';
        break;
      case 'track':
        this.repeat = 'context';
        break;
      default:
        this.repeat = 'off';
        break;
    }
  }
}
