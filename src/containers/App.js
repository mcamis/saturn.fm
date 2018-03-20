import React, { Component } from 'react';
import { Route, withRouter } from 'react-router-dom';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import autobind from 'utilities/autobind';

import MusicPicker from 'components/MusicPicker';
import SourcePicker from 'components/SourcePicker';

import StarField from 'components/StarField';
import Cubes from 'components/Cubes';
import Menu from 'components/Menu';
import AudioManager from 'utilities/audioManager';

import timeSrc from 'images/time.png';
import trackSrc from 'images/track.png';

import Spotify from 'containers/Spotify';

class App extends Component {
  constructor(props) {
    super(props);
    const source = localStorage.getItem('source') || 'web';
    this.audioManager = new AudioManager();

    this.state = {
      source,
      playerReady: false,
      leftChannel: 1,
      rightChannel: 1,
      currentTime: 0,
    };
    window.onSpotifyWebPlaybackSDKReady = () =>
      this.setState({ playerReady: true });
    autobind(this);
  }

  setSource(source) {
    this.setState({ source }, () => {
      localStorage.setItem('source', this.state.source);
    });
  }

  componentDidMount() {
    this.start();
  }

  start() {
    this.frameId = this.frameId || requestAnimationFrame(this.animate);
  }

  stop() {
    cancelAnimationFrame(this.frameId);
  }

  animate() {
   const newState = this.audioManager.getAnalysis();
   this.setState( {...newState});
    this.frameId = requestAnimationFrame(this.animate);
  }




  render() {
    const { currentTime, leftChannel, rightChannel } = this.state;
    // console.log(this.props);
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
            <div className="timer">{0}</div>
          </div>
          <div className="knight-rider" />
        </header>
        <Menu audioManager={this.audioManager} />
        <div className="dashboard" />
        <Cubes leftChannel={leftChannel} rightChannel={rightChannel} />
        <StarField />

        <div className="overlay">
          <Route path="/music" component={MusicPicker} />
          <Route path="/spotify" component={MusicPicker} />
          <Route
            path="/source"
            render={props => (
              <SourcePicker setSource={this.setSource} {...props} />
            )}
          />
        </div>
      </div>
    );
  }
}


/* istanbul ignore next */
function mapStateToProps(state) {
  return {
    analysis: {},
  };
}

export const AppContainer = App;
export default withRouter(connect(mapStateToProps)(App));



