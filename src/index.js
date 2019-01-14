import React from 'react';
import ReactDOM from 'react-dom';
import App from 'containers/App';
import { Provider } from 'react-redux';
import configureStore from 'store/configure';
import 'styles/index.scss';

// Export the store so it can be used outside of react-redux
export const store = configureStore(); // eslint-disable-line import/prefer-default-export

ReactDOM.render(
  <Provider store={store}>
    <App />
  </Provider>,
  document.getElementById('root')
);
