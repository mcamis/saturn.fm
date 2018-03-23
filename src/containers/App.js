import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { Route, withRouter } from 'react-router-dom';
import { connect } from 'react-redux';

import autobind from 'utilities/autobind';
import { formatTime } from 'utilities/helpers';

import StarField from 'components/StarField';
import Cubes from 'components/Cubes';
import FileReader from 'components/FileReader';
import Menu from 'components/Menu';
import AudioManager from 'utilities/audioManager';

import timeSrc from 'images/time.png';
import trackSrc from 'images/track.png';

class App extends Component {
  constructor(props) {
    super(props);
    autobind(this);

    this.audioManager = new AudioManager();
    const currentTimeInterval = setInterval(this.syncCurrentTime, 500);

    this.state = {
      currentTime: formatTime(0),
      currentTimeInterval,
    };
  }

  componentWillUnmount() {
    clearInterval(this.state.currentTimeInterval);
  }

  syncCurrentTime() {
    this.setState({
      currentTime: formatTime(this.audioManager.getCurrentTime()),
    });
  }

  render() {
    return (
      <div>
        <header>
          <div className="info">
            <div className="track">
              <img src={trackSrc} alt="TODO" />
              <div className="track-number">{this.props.audio.trackNumber}</div>
            </div>
            <div className="time">
              <img src={timeSrc} alt="TODO" />
            </div>
            <div className="timer">{this.state.currentTime}</div>
          </div>
          <div className="knight-rider" />
        </header>
        <Menu
          audioManager={this.audioManager}
          repeat={this.props.audio.repeat}
        />
        <div className="dashboard" />
        <Cubes audioManager={this.audioManager} />
        <StarField />

        <div className="overlay">
          <Route path="/upload" component={FileReader} />
        </div>
      </div>
    );
  }
}

App.propTypes = {
  audio: PropTypes.shape({
    trackNumber: PropTypes.number.isRequired,
    repeat: PropTypes.oneOf(['off', 'context', 'track']).isRequired,
  }).isRequired,
};

function mapStateToProps(state) {
  return {
    audio: state.audio,
  };
}

export const AppContainer = App;
export default withRouter(connect(mapStateToProps)(App));
