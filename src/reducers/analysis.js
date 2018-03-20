// import {
//   FOO
// } from 'utilities/constants';

export const defaultAnalysisState = {
  currentTime: 0,
  leftChannel: 1,
  rightChannel: 1
};

export default (state = defaultAnalysisState, action) => {
  switch (action.type) {
    case 'SONG_ANALYSIS':
      return {
        currentTime: action.data.currentTime,
        leftChannel: action.data.leftChannel,
        rightChannel: action.data.rightChannel
      };
    default:
      return state;
  }
};
