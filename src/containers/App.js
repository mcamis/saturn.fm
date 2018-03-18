import React, { Component } from 'react';
import { Route } from 'react-router-dom';

import autobind from 'utilities/autobind';
import SpotifyPlayer from 'utilities/spotifyPlayer';
import SpotifyAuth from 'components/SpotifyAuth';
import MusicPicker from 'components/MusicPicker';
import SourcePicker from 'components/SourcePicker';
import MainScreen from 'components/MainScreen';

import songSrc from 'songs/sample.mp3';

class App extends Component {
  constructor(props) {
    super(props);
    const playerType = localStorage.getItem('source') || 'web';
    this.state = {
      audio: undefined,
      audioContext: undefined,
      currentTime: 0,
      playerType,
      playerReady: false
    };
    window.onSpotifyWebPlaybackSDKReady = () => {
      return this.setState({playerReady: true});
    }
    autobind(this);
  }

  componentDidMount() {
    if (this.state.playerType === 'web') {
      this.loadAudio();
    } else if (this.state.playerType === 'spotify' && this.state.playerReady) {
      this.spotifyPlayer = new SpotifyPlayer(this.props.store);
    }
  }

  componentWillUpdate(nextProps, nextState) {
    if (!this.spotifyPlayer && this.state.playerType === 'spotify' && nextState.playerReady) {
      this.spotifyPlayer = new SpotifyPlayer(this.props.store);
    }
  }

  loadAudio() {
    const audio = new Audio();
    audio.crossOrigin = 'Anonymous';
    audio.src = songSrc;
    this.setState({ audio });
  }

  render() {
    const { audio } = this.state;
    return (
      <div>
        <Route exact path="/" render={() => <MainScreen audio={audio} />} />
        <Route path="/music" component={MusicPicker} />
        <Route path="/spotify-auth" component={MusicPicker} />
        <Route path="/source" component={SourcePicker} />
      </div>
    );
  }
}

export default App;

//
