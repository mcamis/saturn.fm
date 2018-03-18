import { push } from 'react-router-redux';
import autobind from 'utilities/autobind';

export default class SpotifyPlayer {
  constructor(store) {
    this.store = store;
    const token = localStorage.getItem('access_token');
    if(token) {
      this.initializePlayer(token);
    } else {
      store.dispatch(push('spotify-auth'));
    }
    autobind(this);
  }

  initializePlayer(token) {
    const player = new Spotify.Player({
      name: 'Saturn.fm',
      getOAuthToken: cb => {
        cb(token);
      },
    });

    this.player = player;
    this.setupErrorHandling();


    // Playback status updates
    player.addListener('player_state_changed', state => {
      console.log(state);
    });

    // Ready
    player.addListener('ready', ({ device_id }) => {
      console.log('Ready with Device ID', device_id);
    });

    // Connect to the player!
    player.connect();
  }

  setupErrorHandling() {
    const { player } = this;
      // Error handling
    player.addListener('initialization_error', ({ message }) => {
      console.error(message);
    });
    player.addListener('authentication_error', ({ message }) => {
      console.error(message);
      localStorage.removeItem('access_token');
      this.store.dispatch(push('spotify-auth'));
    });
    player.addListener('account_error', ({ message }) => {
      console.error(message);
    });
    player.addListener('playback_error', ({ message }) => {
      console.error(message);
    });
  }
}
