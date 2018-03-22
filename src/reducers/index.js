import { combineReducers } from 'redux';
import { routerReducer } from 'react-router-redux';
import audioReducer from 'reducers/audio';

export default combineReducers({
  audio: audioReducer,
  router: routerReducer,
});

export const routerSelector = state => state.router;
