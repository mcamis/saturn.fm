import React, { Component } from 'react';
import { Route } from 'react-router-dom';

import autobind from 'utilities/autobind';

import MusicPicker from 'components/MusicPicker';
import SourcePicker from 'components/SourcePicker';
import WebAudio from 'containers/WebAudio';
import Spotify from 'containers/Spotify';

class App extends Component {
  constructor(props) {
    super(props);
    const source = localStorage.getItem('source') || 'web';
    this.state = {
      source,
      playerReady: false,
    };
    window.onSpotifyWebPlaybackSDKReady = () =>
      this.setState({ playerReady: true });
    autobind(this);
  }

  setSource(source) {
    this.setState({ source }, () => {
      localStorage.setItem('source', this.state.source);
    });
  }

  render() {
    const { source, playerReady } = this.state;
    return (
      <div>
        <Route
          exact
          path="/"
          render={props => {
            if (source === 'spotify') {
              if (playerReady) {
                return (
                  <Spotify
                    playerReady={playerReady}
                    push={props.history.push}
                  />
                );
              }
              return <p>Loading!</p>;
            }
            return <WebAudio {...props} />;
          }}
        />
        <Route path="/music" component={MusicPicker} />
        <Route path="/spotify" component={MusicPicker} />
        <Route
          path="/source"
          render={props => (
            <SourcePicker setSource={this.setSource} {...props} />
          )}
        />
      </div>
    );
  }
}

export default App;
