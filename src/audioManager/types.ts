export enum RepeatValues {
  Off,
  Single,
  All,
}

export enum AudioStatus {
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
  id: string;
};

export type AudioManagerState = {
  repeat: RepeatValues;
  hasPendingSrcChange: boolean;
  currentTrackIndex: number;
  tracks: Track[] | [];
  audioStatus: AudioStatus;
  audioContextState: string;
};

export type Action = {
  type: ActionTypes;
  payload: any;
};

export enum ActionTypes {
  currentTrackIndex = "currentTrackIndex",
  audioStatus = "audioStatus",
  SaveAndReload = "saveAndReload",
  setStopped = "setStopped",
  repeat = "repeat",
  addTracks = "addTracks",
  setNewTrackOrder = "setNewTrackOrder",
  audioContextState = "audioContextState",
}

// type MediaSessionProps = {
//   title: string;
//   artist: string;
//   album: string;
//   albumArtUrl: string;
// };
