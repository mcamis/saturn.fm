import autobind from 'utilities/autobind';
import StereoAnalyser from 'utilities/stereoAnalyser';
import * as audioActions from 'actions/audio';

// https://developer.mozilla.org/en-US/docs/Web/HTML/Element/audio
export default class AudioManager {
  constructor() {
    this.currentSong = new Audio();
    this.currentSong.controls = true;
    this.currentSong.crossOrigin = 'anonymous';
    this.currentSong.volume = 1;
    this.repeat = 'off';
    // TODO: Preloading & total track time
    this.playlist = [
      'http://localhost:3000/src/songs/Rhyme.mp3',
      'http://localhost:3000/src/songs/2.mp3',
      'http://localhost:3000/src/songs/3.mp3',
      'http://localhost:3000/src/songs/4.mp3',
      'http://localhost:3000/src/songs/5.mp3',
      'http://localhost:3000/src/songs/6.mp3',
      'http://localhost:3000/src/songs/7.mp3',
      'http://localhost:3000/src/songs/8.mp3',
      'http://localhost:3000/src/songs/9.mp3',
    ];
    this.analyser = new StereoAnalyser(this.currentSong);
    const [firstSong] = this.playlist;
    this.currentSong.src = firstSong;
    this.setupEventListeners();
    autobind(this);
  }

  playAndReport() {
    // TODO: Use mp3 meta tags for info
    audioActions.playing(this.getTrackNumber());
    this.currentSong.play();
  }

  setupEventListeners() {
    // https://developer.mozilla.org/en-US/docs/Web/Guide/Events/Media_events
    this.currentSong.addEventListener('loadstart', () =>
      audioActions.loadingStart()
    );

    // TODO: Get this working locally
    this.currentSong.addEventListener('canplaythrough', () =>
      audioActions.loadingFinish()
    );

    this.currentSong.addEventListener('play', () => {
      audioActions.playing(this.getTrackNumber());
      this.analyser.start();
    });

    this.currentSong.addEventListener('pause', () => {
      audioActions.paused();
      this.analyser.stop();
    });

    this.currentSong.addEventListener('ended', () => {
      if (this.repeat === 'track') {
        this.togglePlay();
      } else {
        this.loadNext(true);
      }
    });

    // TODO: Error handling
    /*
      suspend
      Media data is no longer being fetched even though the file has not been entirely downloaded.
      abort
      Media data download has been aborted but not due to an error.
      error
      An error is encountered while media data is being download.
      emptied
      The media buffer has been emptied, possibly due to an error or because the load() method was invoked to reload it.
      stalled
      Media data is unexpectedly no longer available.
    */

    window.onkeyup = e => {
      if (e.keyCode === 32) {
        this.togglePlay();
      }
    };
  }

  getTrackNumber() {
    const currentIndex = this.playlist.indexOf(this.currentSong.src);
    return currentIndex + 1;
  }
  loadPrevious() {
    const currentIndex = this.playlist.indexOf(this.currentSong.src);
    const previousIndex = currentIndex ? currentIndex - 1 : 0;
    this.currentSong.src = this.playlist[previousIndex];
    this.currentSong.play();
  }
  loadNext(auto) {
    const nextIndex = this.playlist.indexOf(this.currentSong.src) + 1;
    if (nextIndex >= this.playlist.length) {
      const [firstSong] = this.playlist;
      this.currentSong.src = firstSong;
      if (!auto || this.repeat === 'context') {
        this.currentSong.play();
      }
    } else {
      this.currentSong.src = this.playlist[nextIndex];
      this.currentSong.play();
    }
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
    // TODO: Figure out saturn offset for skip back
    if (this.currentSong.currentTime >= 3) {
      this.currentSong.currentTime = 0;
    } else {
      this.loadPrevious();
    }
  }

  pause() {
    this.currentSong.pause();
  }

  stop() {
    // TODO: Saturn behavior
    const [firstSong] = this.playlist;
    this.currentSong.pause();
    this.currentSong.src = firstSong;
    this.currentSong.currentTime = 0;
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
    audioActions.toggleRepeat(this.repeat);
  }

  get averageFFT() {
    return this.analyser.averageFFT;
  }

  get currentTime() {
    return this.currentSong.currentTime;
  }
}
