import autobind from 'utilities/autobind';
import { store } from 'index';
import StereoAnalyser from 'utilities/stereoAnalyser';
import { defaultState } from 'reducers/audio'
import * as audioActions from 'actions/audio';
import audio from '../reducers/audio';

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
    
    // this.audioElement.src = this.playlist[0]; // eslint-disable-line prefer-destructuring
    this.analyser = new StereoAnalyser(this.audioElement);

    this.setupEventListeners();
    this.syncManagerWithStore();
    autobind(this);
  }

  syncManagerWithStore() {
    store.subscribe(() =>  {
      this.reduxState =  store.getState().audio;
      this.playlist = this.reduxState.playlist;
    });
  }


  // Controls
  togglePlay() {
    const { audioElement } = this;

    // We haven't started playing yet, so set src to first track in playlist
    if(!audioElement.src) {
      audioActions.setCurrentTrack(0)
    }
    if (audioElement.paused || audioElement.ended) {
      // Delay so the song and sound effect don't overlap
      setTimeout(() => this.playAndReport(), 500);
    } else {
      audioElement.pause();
    }
  }
  
    playAndReport() {
      // TODO: Use mp3 meta tags for info
      // audioActions.playing(this.getTrackNumber());
      console.log('play&report');
      if(!this.audioElement.src || !this.audioElement.src.includes(this.reduxState.currentTrack.src)) {
        console.log('change src');
        console.log(this.audioElement.src);
        console.log(this.reduxState.currentTrack.src);
        this.audioElement.src = this.reduxState.currentTrack.src;
      }
      this.audioElement.play();
   }


  loadNext(auto) {

    // Relying on trackNumber = index + 1 for now
    const nextIndex = this.reduxState.currentTrack.trackNumber;

    // If we're trying to skip past playlist length, go to first song
    if (nextIndex >= Object.keys(this.playlist).length) {
      audioActions.setCurrentTrack(0)
      // Only auto-play track if repeat is on or user has explicitly skipped?
      if (!auto || this.repeat === 'context') {
        this.playAndReport();
      }
    } else {
      // const nextSong = this.playlist[nextIndex];
      audioActions.setCurrentTrack(nextIndex);

      // if (nextSong instanceof File) {
      //   console.log('its a file!');
      //   const reader = new FileReader();
      //   reader.onload = e => {
      //     this.audioElement.src = e.target.result;
      //     this.playAndReport();
      //   };
      //   reader.readAsDataURL(nextSong);
      // } else {
        this.playAndReport();
      // }
      // this.audioElement.play();
    }
  }

  loadPrevious() {
    const currentIndex = this.reduxState.currentTrack.trackNumber - 1;
    const nextIndex = currentIndex ? currentIndex - 1 : 0;
    audioActions.setCurrentTrack(nextIndex)
    this.playAndReport;
  }

  addToPlaylist(files) {
    // TODO: Handle errors?
    const filesToAdd = {};
    for (let i = 0; i < files.length; i++) {
      const key = files[i].name;
      filesToAdd[key] = {
        fileType: "File",
        src: null,
        file: files[i],
        trackNumber: 3 + i + 1,
      };
    }

    if(Object.keys(filesToAdd).length) {
      audioActions.addToPlaylist(filesToAdd)
    }
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
      // audioActions.playing(this.getTrackNumber());
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
    if (this.audioElement.src.indexOf(window.location.href) !== -1) {
      const [host, src] = this.audioElement.src.split(window.location.href);
      return this.playlist.indexOf(`/${src}`) + 1;
    }

    // Humans do not count from zero
    return this.playlist.indexOf(this.audioElement.src) + 1;
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
    console.log('stop');
    // const [firstSong] = this.playlist;
    this.audioElement.pause();
    // this.audioElement.src = firstSong;
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
