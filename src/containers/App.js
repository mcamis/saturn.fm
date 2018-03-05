import React, { Component } from 'react';
import { Route } from 'react-router-dom';

import autobind from 'utilities/autobind';

import MusicPicker from 'components/MusicPicker';
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
    audio.src = 'http://pulseedm.cdnstream1.com:8124/1373_128';
    this.setState({ audio });
  }

  render() {
    const { audio } = this.state;
    console.log(audio);

    return (
      <div>
        <Route path="/" render={() => <MainScreen audio={audio} />} />
        <Route path="/music" component={MusicPicker} />
      </div>
    );
  }
}

export default App;
