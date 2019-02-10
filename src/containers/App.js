import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';

import autobind from 'utilities/autobind';
import * as audioActions from 'actions/audio';
import AudioManager from 'utilities/audioManager';

import Cubes from 'components/Cubes';
import Menu from 'components/Menu';
import FileReader from 'components/FileReader';
import Header from 'components/Header';
import StarField from 'components/StarField';

import playPauseIcon from 'images/play-pause.png';

class App extends Component {
  constructor(props) {
    super(props);
    autobind(this);

    this.audioManager = new AudioManager();

    this.state = {
      show: false,
      hidden: false,
      menuVisible: false,
      isDriveDoorOpen: false,
      isCheckingDisc: true,
    };
  }

  hideDash() {
    this.setState(prevState => ({ hidden: !prevState.hidden, show: false }));
  }

  showIfHidden() {
    if (this.state.hidden) {
      this.setState({ hidden: false, show: true });
    }
  }

  getClassNames() {
    const {
      audio: { playing, paused, repeat },
    } = this.props;

    const hiddenClass = this.state.hidden ? 'hidden' : '';
    const pausedClass = paused ? 'paused' : '';
    const playingClass = playing ? 'playing' : '';
    const showClass = this.state.show ? 'show' : '';

    return `${hiddenClass} ${pausedClass} ${playingClass} ${showClass}`;
  }

  render() {
    const {
      audio: { playing, paused, repeat },
    } = this.props;

    return (
      <div className={this.getClassNames()}>
        <Header
          currentTrack={this.props.audio.currentTrack}
          audioManager={this.audioManager}
        />
        {paused && <img src={playPauseIcon} className="toast blink" />}
        <Menu
          audioManager={this.audioManager}
          hidden={this.state.hidden}
          showIfHidden={this.showIfHidden}
          toggleMenu={() => this.setState({ menuVisible: true })}
          hideDash={this.hideDash}
          repeat={repeat}
          paused={paused}
          playing={playing}
        />
        <div className="dashboard" />
        <Cubes
          audioManager={this.audioManager}
          paused={paused}
          playing={playing}
        />
        <StarField hidden={this.state.hidden} />

        {/* <div className="overlay"><FileReader /></div> */}
        {this.state.menuVisible && (
          <div className="overlay">
            <FileReader
              audio={this.props.audio}
              arrangeTracks={audioActions.arrangeTracks}
              addTracks={audioActions.addTracks}
              toggleMenu={() =>
                this.setState(state => ({ menuVisible: !state.menuVisible }))
              }
            />
          </div>
        )}
      </div>
    );
  }
}

App.propTypes = {
  audio: PropTypes.shape({
    trackNumber: PropTypes.number,
    repeat: PropTypes.oneOf(['off', 'context', 'track']).isRequired,
  }).isRequired,
};

function mapStateToProps(state) {
  return {
    audio: state.audio,
  };
}
export const AppContainer = App;
export default connect(mapStateToProps)(App);
