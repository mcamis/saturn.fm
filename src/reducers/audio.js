import { formatTime } from 'utilities/helpers';
import Chaos from '../songs/01_Chaos.mp3';
import Akihabara from '../songs/02_Akihabara.mp3';
import NothingStopsDetroit from '../songs/03_Nothing_Stops_Detroit.mp3';
import GnosisHardware from '../songs/04_Gnosis_Hardware.mp3';
import NoRefuge from '../songs/05_No_Refuge.mp3';
import OutHere from '../songs/06_Out_Here_At_The_Outersphere.mp3';
import Chicago from '../songs/07_Chicago.mp3';
import Passports from '../songs/08_Passports.mp3';
import ComeTrue from '../songs/09_Come_True.mp3';
import Shuffle from '../songs/shuffle.mp3';

export const defaultState = {
  currentTrack: null,
  loading: false,
  repeat: 'off',
  currentTime: formatTime(0),
  playing: false,
  paused: false,
  playlist: [
    'Shuffle',
  ],
  tracks: {
    ['Shuffle']: {
      file: Shuffle,
      track: 1,
      album: 'Diamond Inside of You',
      artist: 'Rodney Franklin',
      title: 'Malibu Shuffle',
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
          ...Object.keys(action.data.tracks).sort((a, b) => {
            const A = action.data.tracks[a];
            const B = action.data.tracks[b];
            if (A.album > B.album) return 1;
            if (A.album < B.album) return -1;
            if (A.track > B.track) return 1;
            if (A.track < B.track) return -1;
          }),
        ],
      };

    case 'ARRANGE_TRACKS':
      return {
        ...state,
        playlist: action.data.playlist,
      };

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
