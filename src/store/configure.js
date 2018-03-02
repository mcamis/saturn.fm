import createHistory from 'history/createBrowserHistory';
import { routerMiddleware } from 'react-router-redux';
import { createStore, applyMiddleware } from 'redux';
import { composeWithDevTools } from 'redux-devtools-extension';
import promiseMiddleware from 'redux-promise-middleware';

import rootReducer from 'reducers/index';

export const history = createHistory();

function getMiddleware() {
  const middleware = [promiseMiddleware(), routerMiddleware(history)];

  if (process.env.NODE_ENV !== 'production') {
    const { createLogger } = require('redux-logger'); // eslint-disable-line global-require
    const logger = createLogger({
      collapsed: true,
    });
    middleware.push(logger);
  }

  return middleware;
}

export default function configureStore() {
  return createStore(
    rootReducer,
    composeWithDevTools(applyMiddleware(...getMiddleware()))
  );
}
