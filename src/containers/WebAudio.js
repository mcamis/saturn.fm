import React, { Component } from 'react';
import PropTypes from 'prop-types';

import StarField from 'components/StarField';
import Cubes from 'components/Cubes';
import Menu from 'components/Menu';
import AudioManager from 'utilities/audioManager';

import timeSrc from 'images/time.png';
import trackSrc from 'images/track.png';
import autobind from 'utilities/autobind';

class WebAudio extends Component {
  constructor(props) {
    super(props);
    this.audioManager = new AudioManager();
    this.state = {
      volumeLeft: 1,
      volumeRight: 1,
      currentTime: 0,
    };
    autobind(this);
  }

  render() {
    const { currentTime, volumeLeft, volumeRight } = this.state;
    return (
      <div>
        <header>
          <div className="info">
            <div className="track">
              <img src={trackSrc} alt="TODO" />
            </div>
            <div className="time">
              <img src={timeSrc} alt="TODO" />
            </div>
            <div className="timer">{currentTime}</div>
          </div>
          <div className="knight-rider" />
        </header>
        <Menu audioManager={this.audioManager} />
        <div className="dashboard" />
        <Cubes volumeLeft={volumeLeft} volumeRight={volumeRight} />
        <StarField />
      </div>
    );
  }
}

export default WebAudio;
