import StereoAnalyser from "./stereoAnalyser";
import backupCover from "../images/chopin_third.jpeg";
import { RepeatValues, ActionTypes, AudioStatus, Track, AudioManagerState } from "./types";
import { defaultState, reducer } from "./state";
const htmlAudioElement = new Audio();

export class AudioManager {
  public state: AudioManagerState;
  private audioElement: HTMLAudioElement;
  private analyser: any;
  private stateUpdateListener: any;
  private audioContext: AudioContext;

  constructor() {
    this.state = defaultState;
    this.audioElement = htmlAudioElement;

    this.setupEventListeners();
    // this.syncManagerWithStore();
    this.loadFirstTrack();
  }

  init() {
    // Safari is still prefixed
    const AudioContext = window.AudioContext || window.webkitAudioContext;
    this.audioContext = new AudioContext();

    // For Firefox & Mobile Safari AudioContext starts in a running state, even though it will block all audio play events
    const isMobileSafari = /iP(hone|od|ad)/.test(navigator.platform);
    const isFirefox = navigator.userAgent.indexOf("Firefox") > 0;
    if (isFirefox || isMobileSafari) {
      this.audioContext.suspend();
    }

    this.audioContext.resume().then((e) => {
      this.updateState({ type: ActionTypes.audioContextState, payload: this.audioContext.state });

      // TODO: Preloading & total track time?
      this.analyser = new StereoAnalyser(this.audioElement, this.audioContext);
    });
  }

  loadFirstTrack() {
    this.loadTrack(0);
  }

  togglePlayPause = () => {
    const { audioElement } = this;
    const canPlay = audioElement.paused || audioElement.ended;

    // We haven't started playing yet, so set src to first track in playlist
    if (!audioElement.src) {
      // audioActions.setCurrentTrack(0);
      // TODO: init to first track in src
    }

    if (canPlay) {
      this.playAndReport();
    } else {
      audioElement.pause();
    }
  }

  updateMediaSession() {
    const { title, artist, album, albumArtUrl } = this.state.tracks[
      this.state.currentTrackIndex
    ];
    this.audioElement.title = `「SATURN.FM」${title} - ${artist}`;
    if (!("mediaSession" in navigator)) return;

    navigator.mediaSession.metadata = new window.MediaMetadata({
      title,
      artist,
      album,
      artwork: [
        {
          src: albumArtUrl ?? backupCover,
          sizes: "512x512",
        },
      ],
    });
  }

  getNextTrackIndex(): number {
    if (this.state.repeat === RepeatValues.Single) {
      return this.state.currentTrackIndex;
    }
    const isLastTrack =
      this.state.currentTrackIndex === this.state.tracks.length - 1;

    return isLastTrack ? 0 : this.state.currentTrackIndex + 1;
  }

  getPreviousTrackIndex(): number {
    const isFirstTrack = this.state.currentTrackIndex === 0;
    if (isFirstTrack) {
      return this.state.tracks.length - 1;
    }
    return this.state.currentTrackIndex - 1;
  }
  /**
   * Attempt to load the next track in the plalist
   */
  loadTrack(trackIndex: number) {
    const { srcPath, file } = this.state.tracks[trackIndex] ?? {};
    // todo: stop
    if (!srcPath && !file) return;
    const currentSrc = this.audioElement.src;

    if (file instanceof File) {
      const objectUrl = URL.createObjectURL(file);
      // todo make sure to revoke this URL at some point
      // if (this.audioElement.src !== objectUrl) { // Why????
      this.audioElement.src = objectUrl;
      // }
    } else {
      this.audioElement.src = file ?? srcPath;
    }
    this.updateState({ type: ActionTypes.currentTrackIndex, payload: trackIndex });
    this.revokeSongUrl(currentSrc);
  }

  loadNextTrack = () => {
    this.loadTrack(this.getNextTrackIndex());
  }

  loadPreviousTrack = () => {
    this.loadTrack(this.getPreviousTrackIndex());
  }

  playAndReport() {
    this.audioElement.play();
  }

  // Prevent memory leaks and revoke ObjectURL if one exists
  revokeSongUrl(objectUrl: string) {
    try {
      URL.revokeObjectURL(objectUrl);
    } catch (e) {
      console.log("what happens if this wasnt originall a file url?", e);
    }
  }

  setupEventListeners() {
    // https://developer.mozilla.org/en-US/docs/Web/Guide/Events/Mediaevents
    // this.audioElement.addEventListener("loadstart", () =>
    //   audioActions.loadingStart()
    // );

    this.audioElement.addEventListener("canplaythrough", () => {
      if (this.state.audioStatus === AudioStatus.Playing) {
        this.togglePlayPause();
      }
    });

    this.audioElement.addEventListener("play", () => {
      this.updateMediaSession();
      this.analyser.start();
      this.updateState({ type: ActionTypes.audioStatus, payload: AudioStatus.Playing });
    });

    this.audioElement.addEventListener("pause", () => {
      // TODO: Manually set pause state to fix stop
      this.analyser.pause();
      this.updateState({ type: ActionTypes.audioStatus, payload: AudioStatus.Paused });
    });

    this.audioElement.addEventListener("ended", () => {
      this.loadNextTrack();
    });

    if (!("mediaSession" in navigator)) return;

    navigator.mediaSession.setActionHandler("play", () =>
      this.togglePlayPause()
    );
    navigator.mediaSession.setActionHandler("pause", () =>
      this.togglePlayPause()
    );
    navigator.mediaSession.setActionHandler("previoustrack", () =>
      this.previousTrack()
    );
    navigator.mediaSession.setActionHandler("nexttrack", () =>
      this.loadNextTrack()
    );
  }

  previousTrack = () => {
    // TODO: Figure out saturn offset for skip back
    if (this.audioElement.currentTime >= 3) {
      this.audioElement.currentTime = 0;
    } else {
      this.loadPreviousTrack();
    }
  }

  pause() {
    this.audioElement.pause();
    this.updateState({ type: ActionTypes.audioStatus, payload: AudioStatus.Paused });
  }

  stop = () => {
    // TODO: Saturn behavior
    // const [firstSong] = this.tracks;
    this.audioElement.pause();
    // this.audioElement.src = firstSong;
    this.audioElement.currentTime = 0;
    // this.state.currentTrackIndex = 0;
    // this.state.audioStatus = AudioStatus.Stopped;
    this.updateState({ type: "setStopped" });
  }

  toggleRepeat = () => {
    let payload;
    switch (this.state.repeat) {
      case RepeatValues.Off:
        payload = RepeatValues.Single;
        break;
      case RepeatValues.Single:
        payload = RepeatValues.All;
        break;
      case RepeatValues.All:
        payload = RepeatValues.Off;
        break;
    }

    this.updateState({ type: ActionTypes.repeat, payload });
  }

  addTracks = (newTracks: Track[]) => {
    this.updateState({ type: ActionTypes.addTracks, payload: newTracks });
  }

  setCurrentTrack = (newIndex: number) => {
    // this.state.currentTrackIndex = newIndex;
    this.updateState({ type: ActionTypes.currentTrackIndex, payload: newIndex });
  }

  setNewTrackOrder = (tracks: Track[]) => {
    // this.state.tracks = tracks;
    this.updateState({ type: ActionTypes.setNewTrackOrder, payload: tracks });
  }

  updateState = (action: any) => {
    const newState = reducer(this.state, action);
    this.state = newState;
    this.stateUpdateListener && this.stateUpdateListener(newState);
  }
  subscribe = (cb: any) => {
    this.stateUpdateListener = cb;

    return (): void => (this.stateUpdateListener = null);
  }
  getSnapshot = () => {
    return this.state;
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


export const audioManagerSingleton = new AudioManager();
