import { formatTime } from 'utilities/helpers';

export const defaultAnalysisState = {
  trackNumber: null,
  loading: false,
  repeat: 'off',
  currentTime: formatTime(0),
  playing: false,
  paused: false,
};

export default (state = defaultAnalysisState, action) => {
  switch (action.type) {
    case 'PLAYING':
      return {
        ...state,
        trackNumber: action.data.trackNumber,
        playing: true,
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
    default:
      return state;
  }
};
