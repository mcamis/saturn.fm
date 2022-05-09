import React, { Component, Suspense } from "react";
import autobind from "./autobind";
import StereoAnalyser from "./stereoAnalyser";
import { formatTime, defaultTracks } from "./helpers";

import backupCover from "../images/chopin_third.jpeg";

export enum RepeatValues {
  Off,
  Single,
  All,
}

export enum PlayerState {
  Idle,
  Playing,
  Stopped,
  Paused,
}

type Track = {
  track: number;
  album: string;
  artist: string;
  title: string;
  href: string;
  albumArtUrl: string;
  isDefault: boolean;
  srcPath?: string;
  file?: File;
};

export type AudioManagerState = {
  repeat: RepeatValues;
  hasPendingSrcChange: boolean;
  currentTrackIndex: number;
  tracks: Track[];
  playerState: PlayerState;
};
// type MediaSessionProps = {
//   title: string;
//   artist: string;
//   album: string;
//   albumArtUrl: string;
// };

export const defaultState = {
  repeat: RepeatValues.Off,
  hasPendingSrcChange: false,
  currentTrackIndex: 0,
  tracks: defaultTracks,
  playerState: PlayerState.Idle,
};

export class AudioManager {
  public state: AudioManagerState;
  private audioElement: HTMLAudioElement;
  private analyser: any;
  private stateUpdateListener: any;

  constructor() {
    this.state = defaultState;
    this.audioElement = new Audio();

    // TODO: Preloading & total track time?
    this.analyser = new StereoAnalyser(this.audioElement);

    this.setupEventListeners();
    // this.syncManagerWithStore();
    autobind(this);
    this.loadFirstTrack();
  }

  createAudioContext(cb: any) {
    this.analyser.audioContext.resume().then(() => cb && cb());
  }

  loadFirstTrack() {
    this.loadTrack(0);
  }

  togglePlayPause() {
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
    this.updateState({ type: "currentTrackIndex", payload: trackIndex });
    this.revokeSongUrl(currentSrc);
  }

  loadNextTrack() {
    this.loadTrack(this.getNextTrackIndex());
  }

  loadPreviousTrack() {
    this.loadTrack(this.getPreviousTrackIndex());
  }

  playAndReport() {
    this.audioElement.play();
    this.updateState({ type: "playerStatus", payload: PlayerState.Playing });
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

    // TODO: Get this working locally
    this.audioElement.addEventListener("canplaythrough", () => {
      this.updateState({ type: "playerStatus", payload: PlayerState.Playing });
      this.togglePlayPause();
    });

    this.audioElement.addEventListener("play", () => {
      this.updateMediaSession();
      this.analyser.start();
    });

    this.audioElement.addEventListener("pause", () => {
      // TODO: Manually set pause state to fix stop
      this.analyser.pause();
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

  previousTrack() {
    // TODO: Figure out saturn offset for skip back
    if (this.audioElement.currentTime >= 3) {
      this.audioElement.currentTime = 0;
    } else {
      this.loadPreviousTrack();
    }
  }

  pause() {
    this.audioElement.pause();
    this.updateState({ type: "playerStatus", payload: PlayerState.Paused });
  }

  stop() {
    // TODO: Saturn behavior
    // const [firstSong] = this.tracks;
    this.audioElement.pause();
    // this.audioElement.src = firstSong;
    this.audioElement.currentTime = 0;
    // this.state.currentTrackIndex = 0;
    // this.state.playerState = PlayerState.Stopped;
    this.updateState({ type: "setStopped" });
  }

  toggleRepeat() {
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

    this.updateState({ type: "repeat", payload });
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

  addTracks(newTracks: Track[]) {
    console.log({ newTracks });

    this.updateState({ type: "addTracks", payload: newTracks });
    // const currentTracks = this.state.tracks;
    // this.state.tracks = [
    //   ...currentTracks,
    //   // sort new tracks before adding them
    //   ...newTracks.sort((a, b) => {
    //     if (a.album > b.album) return 1;
    //     if (a.album < b.album) return -1;
    //     if (a.track > b.track) return 1;
    //     if (a.track < b.track) return -1;
    //   }),
    // ];
  }

  setCurrentTrack(newIndex: number) {
    // this.state.currentTrackIndex = newIndex;
    this.updateState({ type: "currentTrackIndex", payload: newIndex });
  }

  setNewTrackOrder(tracks: Track[]) {
    // this.state.tracks = tracks;
    this.updateState({ type: "setNewTrackOrder", payload: tracks });
  }

  updateState(actionx) {
    const newState = reducer(this.state, action);
    this.state = newState;
    this.stateUpdateListener(newState);
  }
  registerStateListeners(cb: () => void) {
    this.stateUpdateListener = cb;
  }
}

export enum ActionTypes {
  currentTrackIndex = "currentTrackIndex",
  playerStatus = "playerStatus",
  SaveAndReload = "saveAndReload",
  setStopped = "setStopped",
  repeat = "repeat",
  addTracks = "addTracks",
  setNewTrackOrder = "setNewTrackOrder",
}

const reducer = (state, action) => {
  switch (action.type) {
    case "currentTrackIndex":
      return { ...state, currentTrackIndex: action.payload };
    default:
      return state;
  }
};

export const audioManagerSingleton = new AudioManager();