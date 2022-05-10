
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
};

export type AudioManagerState = {
  repeat: RepeatValues;
  hasPendingSrcChange: boolean;
  currentTrackIndex: number;
  tracks: Track[];
  audioStatus: AudioStatus;
  audioElement: HTMLAudioElement;
  audioContextState: AudioContextState
};


// type MediaSessionProps = {
//   title: string;
//   artist: string;
//   album: string;
//   albumArtUrl: string;
// };