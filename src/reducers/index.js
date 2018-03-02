import { combineReducers } from 'redux';
import { routerReducer } from 'react-router-redux';

export default combineReducers({
  router: routerReducer,
});

export const routerSelector = state => state.router;
