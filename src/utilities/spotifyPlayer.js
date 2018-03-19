import autobind from 'utilities/autobind';

const spotifyUrl = 'https://api.spotify.com/v1/';
export default class SpotifyPlayer {
  constructor(push) {
    const token = localStorage.getItem('access_token');
    if (token) {
      this.player = new Spotify.Player({
        name: 'Saturn.fm',
        getOAuthToken: cb => {
          cb(token);
        },
      });
      this.initializePlayer();
    } else {
      push('spotify');
    }
    this.push = push;
    this.token = token;
    autobind(this);
  }

  initializePlayer() {
    this.setupErrorHandling();

    // Playback status updates
    this.player.addListener(
      'player_state_changed',
      ({ track_window: { current_track } }) => {
        console.log('Currently Playing', current_track);
        this.currentTrackId = current_track.id;
      }
    );

    // Ready
    this.player.addListener('ready', ({ device_id }) => {
      // TODO: Toast for ready
      this.device_id = device_id;
      console.log('Ready with Device ID', device_id);
    });

    // Connect to the player!
    this.player.connect().then(success => {
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
    // TODO 429 errors?
    const { player } = this;
    // Error handling
    player.addListener('initialization_error', ({ message }) => {
      console.error(message);
    });
    player.addListener('authentication_error', ({ message }) => {
      console.error(message);
      localStorage.removeItem('access_token');
      this.push('spotify');
    });
    player.addListener('account_error', ({ message }) => {
      console.error(message);
    });
    player.addListener('playback_error', ({ message }) => {
      console.error(message);
    });
  }

  getStats() {
    this.player.getCurrentState().then(state => {
      if (!state) {
        return;
      }
      console.log(state);
    });
  }

  togglePlay() {
    this.player.togglePlay();
  }

  skipForwards() {
    this.player.nextTrack();
  }

  skipBackwards() {
    this.player.previousTrack();
  }

  pause() {
    this.player.pause();
  }

  createHeaders(method = 'GET') {
    return {
      method,
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${this.token}`,
      },
    };
  }

  buildQuery(method, endpoint, params) {
    const queryArgs = Object.keys(params)
      .map(key => `${key}=${params[key]}`)
      .join('&');
    fetch(
      `${spotifyUrl + endpoint}?${queryArgs}`,
      this.createHeaders(method)
    ).then(response => {
      if (!response.ok) {
        return Promise.reject(Error([{ message: response }]));
      }
      console.log(response);
      return response;
    });
  }

  getAudioAnalysis() {
    this.buildQuery('GET', 'audio-analysis/06AKEBrKUckW0KREUWRnvT');
  }

  // TODO: Toggle enum
  toggleRepeat(state = 'context') {
    // state: value
    // enum of [track, context, off]
    // track will repeat the current track.
    // context will repeat the current context.
    // off will turn repeat off.
    this.buildQuery('PUT', 'me/player/repeat', {
      state,
      device_id: this.device_id,
    });
  }
}
