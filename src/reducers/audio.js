import { formatTime } from 'utilities/helpers';

export const defaultAnalysisState = {
  trackNumber: null,
  loading: false,
  repeat: 'off',
  currentTime: formatTime(0),
};

export default (state = defaultAnalysisState, action) => {
  switch (action.type) {
    case 'PLAYING':
      return {
        ...state,
        trackNumber: action.data.trackNumber,
      };
    case 'TOGGLE_REPEAT':
      return {
        ...state,
        repeat: action.data.repeat,
      };
    case 'UPDATE_TIME':
      return {
        ...state,
        currentTime: formatTime(action.data.currentTime),
      };
    default:
      return state;
  }
};
