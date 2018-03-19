import React, { Component } from 'react';
import PropTypes from 'prop-types';

import StarField from 'components/StarField';
import Cubes from 'components/Cubes';
import Menu from 'components/Menu';
import StereoAnalyser from 'utilities/stereoAnalyser';

import timeSrc from 'images/time.png';
import trackSrc from 'images/track.png';
import autobind from 'utilities/autobind';
import songSrc from 'songs/sample.mp3';

class WebAudio extends Component {
  constructor(props) {
    super(props);
    this.analyser = new StereoAnalyser();
    this.state = {
      audio: null,
      audioContext: this.analyser.getContext(),
      volumeLeft: 1,
      volumeRight: 1,
      currentTime: 0,
    };
    autobind(this);
  }

  componentWillMount() {
    this.loadAudio();
    this.start();
  }

  componentDidUpdate(nextProps, nextState) {
    const { audio } = nextState;

    if (audio !== this.state.audio) {
      this.analyser.startAnalysis(audio);
    }
  }

  componentWillUnmount() {
    this.stop();
  }

  loadAudio() {
    const audio = new Audio();
    audio.crossOrigin = 'Anonymous';
    audio.src = songSrc;
    this.setState({ audio });
  }

  syncAnalysis() {
    const {
      currentTime,
      currentTimeRaw,
      volumeLeft,
      volumeRight,
    } = this.analyser.getAudioInfo();

    if (currentTimeRaw) {
      // const currentSegment = segmentsReversed.find(segment => segment.start <= currentTimeRaw);
      // const loudnessNormalized = (currentSegment.loudness_max -10) * -1;
      this.setState({
        currentTime,
        volumeLeft,
        volumeRight,
      });
    }
    this.frameId = requestAnimationFrame(this.syncAnalysis);
  }

  start() {
    this.frameId = this.frameId || requestAnimationFrame(this.syncAnalysis);
  }

  stop() {
    cancelAnimationFrame(this.frameId);
  }

  render() {
    const { audioContext, currentTime, volumeLeft, volumeRight } = this.state;
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
        <Menu audio={this.props.audio} audioContext={audioContext} />
        <div className="dashboard" />
        <Cubes volumeLeft={volumeLeft} volumeRight={volumeRight} />
        <StarField />
      </div>
    );
  }
}

export default WebAudio;
