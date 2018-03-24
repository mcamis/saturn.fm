import { store } from 'index';

export const loadingStart = () =>
  store.dispatch({
    type: 'LOADING_STARTED',
    data: { loading: true },
  });

export const loadingFinish = () =>
  store.dispatch({
    type: 'LOADING_FINISHED',
    data: { loading: false },
  });

export const toggleRepeat = repeat =>
  store.dispatch({
    type: 'TOGGLE_REPEAT',
    data: { repeat },
  });

export const playing = trackNumber =>
  store.dispatch({
    type: 'PLAYING',
    data: {
      trackNumber,
    },
  });

export const paused = () =>
  store.dispatch({
    type: 'PAUSED',
  });
