import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';

import autobind from 'utilities/autobind';
import AudioManager from 'utilities/audioManager';
import * as audioActions from 'actions/audio';

import Cubes from 'components/Cubes';
import Menu from 'components/Menu';
import FileReader from 'components/FileReader';
import Header from 'components/Header';
import StarField from 'components/StarField';

class App extends Component {
  constructor(props) {
    super(props);
    autobind(this);

    this.audioManager = new AudioManager();

    this.state = {
      show: false,
      hidden: false,
      menuVisible: false,
    };
  }

  getClassNames() {
    const {
      audio: { playing, paused },
    } = this.props;

    const hiddenClass = this.state.hidden ? 'hidden' : '';
    const pausedClass = paused ? 'paused' : '';
    const playingClass = playing ? 'playing' : '';
    const showClass = this.state.show ? 'show' : '';

    return `${hiddenClass} ${pausedClass} ${playingClass} ${showClass}`;
  }

  hideDash() {
    this.setState(prevState => ({ hidden: !prevState.hidden, show: false }));
  }

  showIfHidden() {
    if (this.state.hidden) {
      this.setState({ hidden: false, show: true });
    }
  }

  appeaseSafari() {
    // ugh
    if (this.audioManager.analyser.audioContext.state === 'suspended') {
      this.audioManager.analyser.audioContext.resume();
    }
  }

  render() {
    const {
      audio: { playing, paused, repeat },
    } = this.props;

    return (
      <div
        className={this.getClassNames()}
        onClick={() => this.appeaseSafari()}
      >
        <Header
          currentTrack={this.props.audio.currentTrack}
          audioManager={this.audioManager}
        />
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
        {this.props.toast && <p>{this.props.toast}</p>}
        <StarField hidden={this.state.hidden} />
        {this.state.menuVisible && (
          <div className="overlay">
            <FileReader
              audio={this.props.audio}
              {...audioActions}
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
    currentTrack: PropTypes.number,
    playing: PropTypes.bool.isRequired,
    paused: PropTypes.bool.isRequired,
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
