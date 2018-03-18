import React, { Component } from 'react';
import PropTypes from 'prop-types';

import autobind from 'utilities/autobind';

// var scopes = 'user-read-private user-read-email';
// res.redirect('https://accounts.spotify.com/authorize' +
//   '?response_type=code' +
//   '&client_id=' + my_client_id +
//   (scopes ? '&scope=' + encodeURIComponent(scopes) : '') +
//   '&redirect_uri=' + encodeURIComponent(redirect_uri));
// });

class MusicPicker extends Component {
  constructor(props) {
    super(props);
    autobind(this);
  }

  render() {
    const clientId = 'f36c9747244748e3a4cb450a718e403c';
    const redirect = 'http%3A%2F%2Flocalhost%3A3000';
    const scopes = [
      'streaming',
      'user-read-birthdate',
      'user-read-email',
      'user-read-private',
    ];
    return (
      <section className="music-picker">
        <p>Hello!</p>
        <a
          href={`https://accounts.spotify.com/authorize?client_id=${clientId}&redirect_uri=${redirect}&scope=${encodeURIComponent(
            scopes.join(' ')
          )}&response_type=token`}
        >
          Login to Spotify
        </a>
      </section>
    );
  }
}

export default MusicPicker;
// http://localhost:3000/spotify-auth#access_token=&token_type=Bearer&expires_in=3600
