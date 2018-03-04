import React, { Component } from 'react';

import autobind from 'utilities/autobind';
import { average, formatTime } from 'utilities/helpers';
import StarField from 'components/StarField';
import Cubes from 'components/Cubes';
import Menu from 'components/Menu';

import timeSrc from 'images/time.png';
import trackSrc from 'images/track.png';
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
    this.analyzeAudio();
  }

  analyzeAudio() {
    const audio = new Audio();
    audio.crossOrigin = 'Anonymous';
    audio.src = songSrc;
    audio.play();
    audio.currentTime = 60;

    const AudioContext =
      window.AudioContext || window.webkitAudioContext || false;
    // TODO: Handle false!
    const context = new AudioContext();
    const src = context.createMediaElementSource(audio);
    const analyserLeft = context.createAnalyser();
    const analyserRight = context.createAnalyser();

    analyserLeft.fftSize = 32;
    analyserLeft.smoothingTimeConstant = 0.3;
    analyserRight.fftSize = 32;
    analyserRight.smoothingTimeConstant = 0.3;

    const splitter = context.createChannelSplitter(2);

    src.connect(splitter);

    splitter.connect(analyserRight, 1, 0);
    splitter.connect(analyserLeft, 0, 0);

    analyserLeft.connect(context.destination);
    analyserRight.connect(context.destination);

    const bufferLengthLeft = analyserLeft.frequencyBinCount;
    const dataArrayLeft = new Uint8Array(bufferLengthLeft);
    const bufferLengthRight = analyserRight.frequencyBinCount;
    const dataArrayRight = new Uint8Array(bufferLengthRight);

    const renderFrame = () => {
      requestAnimationFrame(renderFrame);
      analyserLeft.getByteFrequencyData(dataArrayLeft);
      analyserRight.getByteFrequencyData(dataArrayRight);
      this.setState({
        currentTime: formatTime(audio.currentTime),
        volumeLeft: average(dataArrayLeft),
        volumeRight: average(dataArrayRight),
      });
    };

    renderFrame();

    this.setState({
      audio,
      audioContext: context,
    });
  }

  render() {
    const { currentTime } = this.state;

    return (
      <div>
        <header>
          <div className="info">
            <div className="track">
              <img src={trackSrc} />
            </div>
            <div className="time">
              <img src={timeSrc} />
            </div>
            <div className="timer">{currentTime}</div>
          </div>
          <div className="knight-rider" />
        </header>
        <Menu audio={this.state.audio} audioContext={this.state.audioContext} />
        <div className="dashboard" />
        <Cubes
          volumeLeft={this.state.volumeLeft}
          volumeRight={this.state.volumeRight}
        />

        <StarField />
      </div>
    );
  }
}

export default App;
