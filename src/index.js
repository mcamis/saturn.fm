import React from 'react';
import ReactDOM from 'react-dom';
import App from 'containers/App';
import { ConnectedRouter } from 'react-router-redux';
import { Provider } from 'react-redux';
import configureStore, { history } from 'store/configure';

import 'styles/index.scss';

const store = configureStore();

const hash = window.location.hash.substring(1);
const params = {};
hash.split('&').map(hashKey => {
  const hashKeyVal = hashKey.split('=');
  params[hashKeyVal[0]] = hashKeyVal[1];
});
if (!localStorage.getItem('access_token') && params.access_token) {
  localStorage.setItem('access_token', params.access_token);
}
ReactDOM.render(
  <Provider store={store}>
    <ConnectedRouter history={history}>
      <App store={store} />
    </ConnectedRouter>
  </Provider>,
  document.getElementById('root')
);
