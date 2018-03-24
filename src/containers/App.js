import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { Route, withRouter } from 'react-router-dom';
import { connect } from 'react-redux';

import autobind from 'utilities/autobind';
import AudioManager from 'utilities/audioManager';
import { formatTime } from 'utilities/helpers';

import Cubes from 'components/Cubes';
import Menu from 'components/Menu';
import FileReader from 'components/FileReader';
import StarField from 'components/StarField';

import timeSrc from 'images/time.png';
import trackSrc from 'images/track.png';

class App extends Component {
  constructor(props) {
    super(props);
    autobind(this);

    this.audioManager = new AudioManager();
    const currentTimeInterval = setInterval(this.syncCurrentTime, 500);

    this.state = {
      hidden: false,
      currentTime: 0,
      currentTimeInterval,
    };
  }

  componentWillUnmount() {
    clearInterval(this.state.currentTimeInterval);
  }

  syncCurrentTime() {
    this.setState({
      currentTime: formatTime(this.audioManager.currentTime),
    });
  }

  hideDash() {
    this.setState(prevState => ({ hidden: !prevState.hidden }));
  }

  showIfHidden() {
    if (this.state.hidden) {
      this.setState({ hidden: false });
    }
  }

  render() {
    const { audio: { playing, paused, repeat } } = this.props;
    const hiddenClass = this.state.hidden ? 'hidden' : '';
    return (
      <div className={hiddenClass} onClick={() => this.showIfHidden()}>
        {/* TODO: Move header into component */}
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
          hideDash={this.hideDash}
          repeat={repeat}
          paused={paused}
          playing={playing}
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
