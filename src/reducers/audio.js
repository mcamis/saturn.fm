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
      track: 3,
      album: 'Velocity',
      artist: 'GRRL',
      title: 'Higher',
    },
    [Rhyme]: {
      file: Rhyme,
      track: 1,
      album: 'N/A',
      artist: 'Professor Kliq',
      title: 'Rhyme',
    },
    [NoRefuge]: {
      file: NoRefuge,
      track: 2,
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

    case 'ADD_TRACKS':
      return {
        ...state,
        tracks: {
          ...state.tracks,
          ...action.data.tracks,
        },
        playlist: [
          ...state.playlist,
          // sort new tracks before adding them
          ...Object.keys(action.data.tracks).sort(
            (a, b) => action.data.tracks[a].track - action.data.tracks[b].track
          ),
        ],
      };

    case 'ARRANGE_TRACKS':
      return {
        ...state,
        playlist: action.data.playlist,
      };

    //       // a little function to help us with reordering the result
    // export const reorder = (list, startIndex, endIndex) => {
    //   const result = Array.from(list);
    //   const [removed] = result.splice(startIndex, 1);
    //   result.splice(endIndex, 0, removed);

    //   return result;
    case 'REMOVE_TRACK':
      const trackKey = state.playlist[action.datatrackIndex];
      const { [trackKey]: removedTrack, ...cleanTracks } = state.tracks;
      return {
        ...state,
        playlist: [
          ...state.playlist.slice(0, action.data.trackIndex),
          ...state.playlist.slice(action.data.trackIndex + 1),
        ],
        tracks: {
          ...cleanTracks,
        },
      };
    default:
      return state;
  }
};
