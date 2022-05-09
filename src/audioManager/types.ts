
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

export type Track = {
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
  audioElement: HTMLAudioElement;
};

export enum ActionTypes {
  currentTrackIndex = "currentTrackIndex",
  playerState = "playerState",
  SaveAndReload = "saveAndReload",
  setStopped = "setStopped",
  repeat = "repeat",
  addTracks = "addTracks",
  setNewTrackOrder = "setNewTrackOrder",
}

// type MediaSessionProps = {
//   title: string;
//   artist: string;
//   album: string;
//   albumArtUrl: string;
// };