import { combineReducers } from 'redux';
import { routerReducer } from 'react-router-redux';
import analysisReducer from 'reducers/analysis';

export default combineReducers({
  analysis: analysisReducer,
  router: routerReducer,
});

export const routerSelector = state => state.router;
