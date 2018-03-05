import React, { Component } from 'react';
import PropTypes from 'prop-types';

import StarField from 'components/StarField';
import Cubes from 'components/Cubes';
import Menu from 'components/Menu';
import StereoAnalyser from 'utilities/stereoAnalyser';

import timeSrc from 'images/time.png';
import trackSrc from 'images/track.png';
import autobind from 'utilities/autobind';

class MainScreen extends Component {
  constructor(props) {
    super(props);
    this.analyser = new StereoAnalyser();
    this.state = {
      audioContext: this.analyser.getContext(),
      volumeLeft: 1,
      volumeRight: 1,
      currentTime: 0,
    };

    autobind(this);
  }

  componentDidMount() {
    const syncStateToAnalysis = () => {
      requestAnimationFrame(syncStateToAnalysis);
      const {
        currentTime,
        volumeLeft,
        volumeRight,
      } = this.analyser.getAudioInfo();

      this.setState({
        currentTime,
        volumeLeft,
        volumeRight,
      });
    };
    syncStateToAnalysis();
  }

  componentWillReceiveProps(nextProps) {
    const { audio } = nextProps;

    if (audio !== this.props.audio) {
      this.analyser.startAnalysis(audio);
    }
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

export default MainScreen;
