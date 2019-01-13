import { formatTime } from 'utilities/helpers';

import Rhyme from '../songs/Rhyme.mp3';
import NoRefuge from '../songs/No-Refuge.mp3';
import Higher from '../songs/Higher.mp3';

export const defaultState = {
  currentTrack: {},
  loading: false,
  repeat: 'off',
  currentTime: formatTime(0),
  playing: false,
  paused: false,
  playlist: {
    0: {
      fileType: "URI",
      src: Rhyme,
      file: null,
      trackNumber: 1,
    },
    1: {
      fileType: "URI",
      src: NoRefuge,
      file: null,
      trackNumber: 2,
    },
    2: {
      fileType: "URI",
      src: Higher,
      file: null,
      trackNumber: 3,
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
        currentTrack: state.playlist[action.data.trackIndex],
      };

      case 'ADD_TO_PLAYLIST':
      return {
        ...state,
        playlist: {
          ...state.playlist,
          ...action.data.tracks
        }
      };
    default:
      return state;
  }
};
