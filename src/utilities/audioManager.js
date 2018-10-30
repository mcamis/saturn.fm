import autobind from 'utilities/autobind';
import StereoAnalyser from 'utilities/stereoAnalyser';
import * as audioActions from 'actions/audio';

import Rhyme from '../songs/Rhyme.mp3';
import NoRefuge from '../songs/No-Refuge.mp3';

// https://developer.mozilla.org/en-US/docs/Web/HTML/Element/audio
export default class AudioManager {
  constructor() {
    this.audioElement = new Audio();
    this.audioElement.crossOrigin = 'anonymous';
    // Lowered volume so sound effects are more audible
    this.audioElement.volume = 0.75;
    this.repeat = 'off';

    // TODO: Preloading & total track time
    // TODO: External playlist management
    this.playlist = [Rhyme, NoRefuge];

    this.audioElement.src = this.playlist[0]; // eslint-disable-line prefer-destructuring
    this.analyser = new StereoAnalyser(this.audioElement);

    this.setupEventListeners();
    autobind(this);
  }

  setPlaylist(playlist) {
    console.log('yo whatup', playlist);
    this.playlist = playlist;
    this.audioElement.src = this.playlist[0];
    this.audioElement.currentTime = 0;
  }

  playAndReport() {
    // TODO: Use mp3 meta tags for info
    audioActions.playing(this.getTrackNumber());
    this.audioElement.play();
  }

  setupEventListeners() {
    // https://developer.mozilla.org/en-US/docs/Web/Guide/Events/Mediaevents
    this.audioElement.addEventListener('loadstart', () =>
      audioActions.loadingStart()
    );

    // TODO: Get this working locally
    this.audioElement.addEventListener('canplaythrough', () =>
      audioActions.loadingFinish()
    );

    this.audioElement.addEventListener('play', () => {
      audioActions.playing(this.getTrackNumber());
      this.analyser.start();
    });

    this.audioElement.addEventListener('pause', () => {
      // TODO: Manually set pause state to fix stop
      // audioActions.paused();
      this.analyser.pause();
    });

    this.audioElement.addEventListener('ended', () => {
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
  }

  getTrackNumber() {
    const [host, src] = this.audioElement.src.split(window.location.href);
    console.log(src);
    const currentIndex = this.playlist.indexOf(`/${src}`);
    console.log(this.playlist, this.audioElement.src);

    // Humans do not count from zero
    return currentIndex + 1;
  }

  loadPrevious() {
    const currentIndex = this.playlist.indexOf(this.audioElement.src);
    const previousIndex = currentIndex ? currentIndex - 1 : 0;
    this.audioElement.src = this.playlist[previousIndex];
    this.audioElement.play();
  }

  loadNext(auto) {
    const nextIndex = this.playlist.indexOf(this.audioElement.src) + 1;

    // TODO: Clean up this mess
    if (nextIndex >= this.playlist.length) {
      const [firstSong] = this.playlist;
      this.audioElement.src = firstSong;
      if (!auto || this.repeat === 'context') {
        this.audioElement.play();
      }
    } else {
      this.audioElement.src = this.playlist[nextIndex];
      this.audioElement.play();
    }
  }

  // Controls
  togglePlay() {
    const { audioElement } = this;
    if (audioElement.paused || audioElement.ended) {
      // Delay so the song and SE don't overlap
      setTimeout(() => this.playAndReport(), 500);
    } else {
      audioElement.pause();
    }
  }

  nextTrack() {
    this.loadNext();
  }

  /**
   *
   */
  previousTrack() {
    // TODO: Figure out saturn offset for skip back
    if (this.audioElement.currentTime >= 3) {
      this.audioElement.currentTime = 0;
    } else {
      this.loadPrevious();
    }
  }

  pause() {
    this.audioElement.pause();
  }

  stop() {
    // TODO: Saturn behavior
    const [firstSong] = this.playlist;
    this.audioElement.pause();
    this.audioElement.src = firstSong;
    this.audioElement.currentTime = 0;
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

  get analyserFFT() {
    return this.analyser.averageFFT;
  }

  get currentTime() {
    return this.audioElement.currentTime;
  }
}
