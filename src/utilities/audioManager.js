import autobind from 'utilities/autobind';
import StereoAnalyser from 'utilities/stereoAnalyser';
import Sample from 'songs/sample.mp3';
import Rhyme from 'songs/Rhyme.mp3';
import { store } from 'index';

const loadingStart = () => ({
  type: 'LOADING_STARTED',
  data: { loading: true },
});

const loadingFinish = () => ({
  type: 'LOADING_FINISHED',
  data: { loading: false },
});

const playing = () => ({
  type: 'PLAYING',
});

const paused = () => ({
  type: 'PAUSED',
});

// https://developer.mozilla.org/en-US/docs/Web/HTML/Element/audio
export default class AudioManager {
  constructor(push) {
    this.currentSong = new Audio();
    this.currentSong.crossOrigin = 'anonymous';
    this.repeat = 'off';

    this.playlist = [
      'http://localhost:3000/src/songs/1.mp3',
      'http://localhost:3000/src/songs/2.mp3',
      'http://localhost:3000/src/songs/3.mp3',
      'http://localhost:3000/src/songs/4.mp3',
      'http://localhost:3000/src/songs/5.mp3',
      'http://localhost:3000/src/songs/6.mp3',
    ];

    this.analyser = new StereoAnalyser(this.currentSong);
    this.currentSong.src = Rhyme;
    this.setupEventListeners();
    autobind(this);
  }


  getAudio(){
    return this.currentSong;
  }

  // using named functions so we can unbind

  playAndReport() {
    store.dispatch(playing());
    this.currentSong.play();
  }

  setupEventListeners() {
    // https://developer.mozilla.org/en-US/docs/Web/Guide/Events/Media_events
    this.currentSong.addEventListener('loadstart', () =>
      store.dispatch(loadingStart())
    );

    this.currentSong.addEventListener('loadeddata', this.playAndReport());

    this.currentSong.addEventListener('play', () => {
      store.dispatch(playing());
      this.analyser.start();
    });
    this.currentSong.addEventListener('pause', () => {
      store.dispatch(paused());

      this.analyser.stop();
    });

    this.currentSong.addEventListener('ended', () => this.loadNext(true));

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
  }

  loadPrevious() {
    const nextIndex = this.playlist.indexOf(this.currentSong.src) - 1 || 0;
    this.currentSong.src = this.playlist[nextIndex];
  }
  loadNext(auto) {
    const nextIndex = this.playlist.indexOf(this.currentSong.src) + 1;
    if (nextIndex > this.playlist.length) {
      if (!auto) {
        this.currentSong.src = this.playlist[0];
      }
    }
    this.currentSong.src = this.playlist[nextIndex];
    this.currentSong.play();
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
    if (this.currentSong.currentTime >= 2) {
      this.currentSong.currentTime = 0;
    } else {
      this.loadPrevious();
    }
  }

  pause() {
    this.currentSong.pause();
  }

  stop() {
    this.currentSong.pause();
    this.currentSong.currentTime = 0;
  }

  getAnalysis() {
    return this.analyser.getAnalysis();
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
