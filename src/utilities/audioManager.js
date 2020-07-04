import autobind from "utilities/autobind";
import { store } from "index";
import StereoAnalyser from "utilities/stereoAnalyser";
import { defaultState } from "reducers/audio";
import * as audioActions from "actions/audio";
import art from "images/chopin_third.jpeg";

// https://developer.mozilla.org/en-US/docs/Web/HTML/Element/audio
export default class AudioManager {
  constructor() {
    this.audioElement = new Audio();
    this.audioElement.crossOrigin = "anonymous";

    this.repeat = "off";
    this.reduxState = defaultState;
    this.changeSrc = true;

    // TODO: Preloading & total track time?
    this.analyser = new StereoAnalyser(this.audioElement);

    this.setupEventListeners();
    this.syncManagerWithStore();
    autobind(this);
  }

  syncManagerWithStore() {
    store.subscribe(() => {
      this.reduxState = store.getState().audio;
      if (this.reduxState.currentTrack !== this.currentTrack) {
        this.currentTrack = this.reduxState.currentTrack;
        this.changeTrack = true;
      } else {
        this.changeTrack = false;
      }
    });
  }

  // Controls
  togglePlay() {
    const { audioElement } = this;

    // We haven't started playing yet, so set src to first track in playlist
    if (!audioElement.src) {
      audioActions.setCurrentTrack(0);
    }
    if (audioElement.paused || audioElement.ended) {
      this.playAndReport();
    } else {
      audioElement.pause();
    }
  }

  // eslint-disable-next-line class-methods-use-this
  updateMediaSession({ title, artist, album, albumArtUrl, ...rest }) {
    console.log(albumArtUrl);
    if (!("mediaSession" in navigator)) return;

    navigator.mediaSession.metadata = new MediaMetadata({
      title,
      artist,
      album,
      artwork: [
        {
          src: albumArtUrl ? albumArtUrl : art,
          sizes: "512x512",
          // type: "image/png",
        },
      ],
    });
  }

  playAndReport() {
    const { tracks, playlist, currentTrack = 0 } = this.reduxState;
    const trackKey = playlist[currentTrack];
    const nextSong = tracks[trackKey].file;

    if (nextSong instanceof File) {
      const objectUrl = URL.createObjectURL(nextSong);
      if (this.audioElement.src !== objectUrl) {
        this.audioElement.src = objectUrl;
      }
      this.audioElement.play();
      this.audioElement.play().then(() => {
        this.updateMediaSession(tracks[trackKey]);
      });
    } else {
      // TODO: This was a dumb kludge that causes lots of files to restart after pausing
      // TODO: Workaround for preloaded files, move this to redux?
      const splitSrc = nextSong.split("./songs");
      const isFromDefaultPlaylist = splitSrc.length > 0;
      const derivedSrc = isFromDefaultPlaylist ? splitSrc[0] : nextSong;
      if (
        !this.audioElement.src ||
        !this.audioElement.src.includes(derivedSrc)
      ) {
        this.audioElement.src = nextSong;
      }
      this.audioElement.play().then(() => {
        this.updateMediaSession(tracks[trackKey]);
      });
    }
  }

  // Prevent memory leaks and revoke ObjectURL if one exists
  revokeSongUrl() {
    const { tracks, playlist, currentTrack = 0 } = this.reduxState;
    if (playlist.length === 1) return;
    const trackKey = playlist[currentTrack];
    const currentSong = tracks[trackKey].file;
    if (currentSong instanceof File) {
      URL.revokeObjectURL(currentSong);
    }
  }

  loadNext(auto) {
    this.revokeSongUrl();
    const nextIndex = this.reduxState.currentTrack + 1;

    // If we're trying to skip past tracks length, go to first song
    if (nextIndex >= this.reduxState.playlist.length) {
      audioActions.setCurrentTrack(0);
      // Only auto-play track if repeat is on or user has explicitly skipped?
      if (!auto || this.reduxState.repeat === "context") {
        this.playAndReport();
      }
    } else {
      audioActions.setCurrentTrack(nextIndex);

      this.playAndReport();
    }
  }

  loadPrevious() {
    this.revokeSongUrl();

    const currentIndex = this.reduxState.currentTrack;
    const nextIndex = currentIndex ? currentIndex - 1 : 0;
    audioActions.setCurrentTrack(nextIndex);
    this.playAndReport();
  }

  setupEventListeners() {
    // https://developer.mozilla.org/en-US/docs/Web/Guide/Events/Mediaevents
    this.audioElement.addEventListener("loadstart", () =>
      audioActions.loadingStart()
    );

    // TODO: Get this working locally
    this.audioElement.addEventListener("canplaythrough", () =>
      audioActions.loadingFinish()
    );

    this.audioElement.addEventListener("play", () => {
      audioActions.playing();
      this.analyser.start();
    });

    this.audioElement.addEventListener("pause", () => {
      // TODO: Manually set pause state to fix stop
      audioActions.paused();
      this.analyser.pause();
    });

    this.audioElement.addEventListener("ended", () => {
      if (this.reduxState.repeat === "track") {
        this.togglePlay();
      } else {
        this.loadNext(true);
      }
    });

    if (!("mediaSession" in navigator)) return;

    navigator.mediaSession.setActionHandler("play", () => this.togglePlay());
    navigator.mediaSession.setActionHandler("pause", () => this.togglePlay());
    navigator.mediaSession.setActionHandler("previoustrack", () =>
      this.previousTrack()
    );
    navigator.mediaSession.setActionHandler("nexttrack", () =>
      this.nextTrack()
    );
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

  nextTrack() {
    this.loadNext();
  }

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
    // const [firstSong] = this.tracks;
    this.audioElement.pause();
    // this.audioElement.src = firstSong;
    this.audioElement.currentTime = 0;
  }

  toggleRepeat() {
    let newState;
    switch (this.reduxState.repeat) {
      case "off":
        newState = "track";
        break;
      case "track":
        newState = "context";
        break;
      default:
        newState = "off";
        break;
    }
    audioActions.toggleRepeat(newState);
  }

  get analyserFFT() {
    return this.analyser.averageFFT;
  }

  get rawFFT() {
    return this.analyser.rawFFT;
  }

  get currentTime() {
    return this.audioElement.currentTime;
  }
}
