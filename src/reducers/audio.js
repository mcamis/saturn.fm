import { formatTime } from 'utilities/helpers';

import Rhyme from '../songs/Rhyme.mp3';
import NoRefuge from '../songs/No-Refuge.mp3';
import Higher from '../songs/Higher.mp3';

export const defaultState = {
  currentTrack: null,
  loading: false,
  repeat: 'off',
  currentTime: formatTime(0),
  playing: false,
  paused: false,
  playlist: [Higher, Rhyme, NoRefuge],
  tracks: {
    [Higher]: {
      name: Higher,
      file: Higher,
      trackNumber: 3,
      album: 'Velocity',
      artist: 'GRRL',
      title: 'Higher',
    },
    [Rhyme]: {
      file: Rhyme,
      trackNumber: 1,
      album: 'N/A',
      artist: 'Professor Kliq',
      title: 'Rhyme',
    },
    [NoRefuge]: {
      file: NoRefuge,
      trackNumber: 2,
      album: 'OP-1 Outtakes',
      artist: 'Professor Kliq',
      title: 'NoRefuge',
    },
  },
};

export default (state = defaultState, action) => {
  switch (action.type) {
    case 'PLAYING':
      return {
        ...state,
        playing: true,
        paused: false,
      };
    case 'PAUSED':
      return {
        ...state,
        playing: false,
        paused: true,
      };
    case 'TOGGLE_REPEAT':
      return {
        ...state,
        repeat: action.data.repeat,
      };

    case 'SET_CURRENT_TRACK':
      return {
        ...state,
        currentTrack: action.data.trackIndex,
      };

    case 'ADD_TO_PLAYLIST':
      return {
        ...state,
        tracks: {
          ...state.tracks,
          ...action.data.tracks,
        },
        playlist: [...state.playlist, ...Object.keys(action.data.tracks)],
      };
    default:
      return state;
  }
};
