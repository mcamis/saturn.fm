import { push } from 'react-router-redux';
import autobind from 'utilities/autobind';

const spotifyUrl = 'https://api.spotify.com/v1/';
export default class SpotifyPlayer {
  constructor(store) {
    this.store = store;
    const token = localStorage.getItem('access_token');
    this.token = token;
    if (token) {
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
    player.addListener(
      'player_state_changed',
      ({ position, duration, track_window: { current_track } }) => {
        console.log('Currently Playing', current_track);
        console.log('Position in Song', position);
        console.log('Duration of Song', duration);
      }
    );

    // Ready
    player.addListener('ready', ({ device_id }) => {
      // TODO: Toast for ready
      console.log('Ready with Device ID', device_id);
    });

    // Connect to the player!
    player.connect().then(success => {
      if (success) {
        this.syncInstanceToPlayer();
      }
    });
  }

  syncInstanceToPlayer() {
    const renderFrame = () => {
      requestAnimationFrame(renderFrame);
      this.player.getCurrentState().then(state => {
        if (!state) {
          return;
        }
        const { position, paused } = state;

        this.position = position;
        this.paused = paused;
      });
    };

    renderFrame();
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

  getCurrentState() {
    this.player.getCurrentState().then(state => {
      if (!state) {
        return;
      }
      const {
        track_window: { current_track, next_tracks: [next_track] },
      } = state;

      console.log('Currently Playing', current_track);
      console.log('Playing Next', next_track);
    });
  }

  createHeaders() {
    return {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${this.token}`,
      },
    };
  }

  buildQuery(endpoint) {
    fetch(spotifyUrl + endpoint, this.createHeaders())
      .then(response => {
        if (!response.ok) {
          return Promise.reject(Error([{ message: response }]));
        }
        return response.json();
      })
      .then(body => {
        console.log(body);
        return body;
      });
  }

  getAudioAnalysis() {
    this.buildQuery('audio-analysis/06AKEBrKUckW0KREUWRnvT');
  }
}
