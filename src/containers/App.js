import React, { Component } from 'react';
import { Route, withRouter } from 'react-router-dom';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import autobind from 'utilities/autobind';
import { formatTime } from 'utilities/helpers';

import MusicPicker from 'components/MusicPicker';

import StarField from 'components/StarField';
import Cubes from 'components/Cubes';
import FileReader from 'components/FileReader';
import Menu from 'components/Menu';
import AudioManager from 'utilities/audioManager';

import timeSrc from 'images/time.png';
import trackSrc from 'images/track.png';

import { updateTime } from 'actions/audio';

import Spotify from 'containers/Spotify';

class App extends Component {
  constructor(props) {
    super(props);
    this.audioManager = new AudioManager();

    this.state = {
      playerReady: false,
      leftChannel: 1,
      rightChannel: 1,
      currentTime: formatTime(0),
    };
    window.onSpotifyWebPlaybackSDKReady = () =>
      this.setState({ playerReady: true });
    autobind(this);
  }
  componentDidMount() {
    // setInterval because requestAnimationFrame is overkill for this
    const currentTimeInterval = setInterval(this.syncCurrentTime, 500);
    this.setState({ currentTimeInterval });
  }

  componentWillUnmount() {
    clearInterval(this.state.currentTimeInterval);
  }

  syncCurrentTime() {
    // updateTime(this.audioManager.getCurrentTime());
    this.setState({
      currentTime: formatTime(this.audioManager.getCurrentTime()),
    });
    // this.frameId = requestAnimationFrame(this.syncCurrentTime);
  }

  render() {
    const { currentTime, leftChannel, rightChannel } = this.state;
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
          <Route path="/music" component={MusicPicker} />
          <Route path="/spotify" component={MusicPicker} />
        </div>
      </div>
    );
  }
}

/* istanbul ignore next */
function mapStateToProps(state) {
  return {
    audio: state.audio,
  };
}

export const AppContainer = App;
export default withRouter(connect(mapStateToProps)(App));
