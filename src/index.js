import React from 'react';
import ReactDOM from 'react-dom';
import App from 'containers/App';
import { ConnectedRouter } from 'react-router-redux';
import { Provider } from 'react-redux';
import configureStore, { history } from 'store/configure';
import 'styles/index.scss';

export const store = configureStore();

ReactDOM.render(
  <Provider store={store}>
    <ConnectedRouter history={history}>
      <App />
    </ConnectedRouter>
  </Provider>,
  document.getElementById('root')
);
