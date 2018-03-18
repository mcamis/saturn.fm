import React, { Component } from 'react';
import { Route } from 'react-router-dom';

import autobind from 'utilities/autobind';

import SpotifyAuth from 'components/SpotifyAuth';
import MainScreen from 'components/MainScreen';

import songSrc from 'songs/sample.mp3';

class App extends Component {
  constructor(props) {
    super(props);
    this.state = {
      audio: undefined,
      audioContext: undefined,
      currentTime: 0,
    };
    autobind(this);
  }

  componentDidMount() {
    this.loadAudio();
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
        <Route path="/" render={() => <MainScreen audio={audio} />} />
        <Route path="/music" component={SpotifyAuth} />
      </div>
    );
  }
}

export default App;
