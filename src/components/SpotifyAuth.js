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
    return (
      <section className="music-picker">
        <p>Hello!</p>
        <a href="https://accounts.spotify.com/authorize?client_id=f36c9747244748e3a4cb450a718e403c&redirect_uri=http%3A%2F%2Flocalhost%3A3000%2Fspotify-auth&scope=user-read-private%20user-read-email&response_type=token&state=123">
          Login to Spotify
        </a>
      </section>
    );
  }
}

export default MusicPicker;
