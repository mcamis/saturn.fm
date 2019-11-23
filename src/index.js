import React from 'react';
import ReactDOM from 'react-dom';
import App from 'containers/App';
import { Provider } from 'react-redux';
import configureStore from 'store/configure';
import 'styles/index.scss';

import * as Sentry from '@sentry/browser';

if(process.env.NODE_ENV === 'production') {
  Sentry.init({ dsn: 'https://992c24dba9924e9a9431f74d2b9515a6@sentry.io/1830195' });
}


// Export the store so it can be used outside of react-redux
export const store = configureStore(); // eslint-disable-line import/prefer-default-export

function setManualViewportHeight() {
  let vh = window.innerHeight * 0.01;
  document.documentElement.style.setProperty('--vh', `${vh}px`);
}

window.addEventListener('resize', () => {
  setManualViewportHeight();
});

window.addEventListener('orientationchange', () => {
  setManualViewportHeight();
});

// Mobile Safari doesn't provide a correct `window.innerHeight` on initial render
setTimeout(() => {
  setManualViewportHeight();

  ReactDOM.render(
    <Provider store={store}>
      <App />
    </Provider>,
    document.getElementById('root')
  );
  
}, 100)

