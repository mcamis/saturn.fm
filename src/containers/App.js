import React, { Component } from "react";
import PropTypes from "prop-types";
import { connect } from "react-redux";

import autobind from "utilities/autobind";
import AudioManager from "utilities/audioManager";
import * as audioActions from "actions/audio";

import Cubes from "components/Cubes";
import Menu from "components/Menu";
import About from "components/About";
import FileReader from "components/FileReader";
import Header from "components/Header";
import StarField from "components/StarField";

const CurrentTrackDisplay = ({ href, artist, title }) => {
  //   album: "Entertainment System"
  // artist: "Professor Kliq"
  // file: "/7387f2263f3d4d909b3757f066da5ed9.mp3"
  // title: "No Refuge"
  // track: 1
  return (
    <div className="current-track-info" key={title + artist}>
      <p>
        {title} {artist && <>- {artist}</>}
      </p>
      {href && (
        <p>
          <a href={href} target="blank">
            {href}
          </a>
        </p>
      )}
    </div>
  );
};

CurrentTrackDisplay.propTypes = {
  href: PropTypes.string,
  artist: PropTypes.string.isRequired,
  title: PropTypes.string.isRequired
};

CurrentTrackDisplay.defaultProps = {
  href: ""
};

class App extends Component {
  constructor(props) {
    super(props);
    autobind(this);

    this.audioManager = new AudioManager();

    this.state = {
      animation: "plain",
      show: false,
      hidden: false,
      showAboutModal: false,
      fileReaderVisible: false,
      frameCallbacks: []
    };
    this.frameId = null;
  }

  componentDidMount() {
    this.frameId = requestAnimationFrame(this.animate);
  }

  getClassNames() {
    const {
      audio: { playing, paused }
    } = this.props;

    const hiddenClass = this.state.hidden ? "hidden" : "";
    const pausedClass = paused ? "paused" : "";
    const playingClass = playing ? "playing" : "";
    const showClass = this.state.show ? "show" : "";

    return `${hiddenClass} ${pausedClass} ${playingClass} ${showClass}`;
  }

  setRandomAnimation() {
    const randomAnimation = ["plain", "spinny", "fast"];
    const withoutCurrent = randomAnimation.filter(
      animation => animation !== this.state.animation
    );

    const nextAnimation =
      withoutCurrent[Math.floor(Math.random() * withoutCurrent.length)];

    this.setState({
      animation: nextAnimation
    });
  }

  setAnimationCallback(callback) {
    this.setState(prevState => ({
      frameCallbacks: [...prevState.frameCallbacks, callback]
    }));
  }

  hideDash() {
    const randomAnimation = ["plain", "spinny", "fast"];

    const animation =
      randomAnimation[Math.floor(Math.random() * randomAnimation.length)];

    this.setState(prevState => ({
      hidden: !prevState.hidden,
      show: false,
      animation
    }));
  }

  showIfHidden() {
    if (this.state.hidden) {
      this.frameId = this.frameId || requestAnimationFrame(this.animate);
      this.setState({ hidden: false, show: true });
    }
  }

  animate() {
    this.state.frameCallbacks.forEach(callback => callback());
    this.frameId = requestAnimationFrame(this.animate);
  }

  toggleMenu() {
    if (this.frameId) {
      cancelAnimationFrame(this.frameId);
      this.frameId = undefined;
    } else {
      requestAnimationFrame(this.animate);
    }

    this.setState(state => ({ fileReaderVisible: !state.fileReaderVisible }));
  }

  render() {
    const {
      audio: { playing, paused, repeat, playlist, currentTrack, tracks }
    } = this.props;

    const currentKey = playlist[currentTrack];
    const currentInfo = tracks[currentKey];

    return (
      <div className={this.getClassNames()}>
        <Header
          currentTrack={this.props.audio.currentTrack}
          audioManager={this.audioManager}
        />
        <Menu
          audioManager={this.audioManager}
          hidden={this.state.hidden}
          showIfHidden={this.showIfHidden}
          toggleMenu={this.toggleMenu}
          toggleAbout={() =>
            this.setState(prevState => ({
              showAboutModal: !prevState.showAboutModal
            }))
          }
          hideDash={this.hideDash}
          repeat={repeat}
          paused={paused}
          playing={playing}
          setAnimationCallback={this.setAnimationCallback}
        />
        <div className="dashboard" />
        <Cubes
          audioManager={this.audioManager}
          hidden={this.state.hidden}
          paused={paused}
          playing={playing}
          setAnimationCallback={this.setAnimationCallback}
        />
        {this.props.toast && <p>{this.props.toast}</p>}
        <StarField
          animation={this.state.animation}
          hidden={this.state.hidden}
          setAnimationCallback={this.setAnimationCallback}
          setRandomAnimation={this.setRandomAnimation}
        />
        {this.state.fileReaderVisible && (
          <div className="overlay">
            <FileReader
              audio={this.props.audio}
              {...audioActions}
              toggleMenu={this.toggleMenu}
            />
          </div>
        )}
        {this.state.showAboutModal && (
          <div className="overlay">
            <About
              toggleAbout={() =>
                this.setState(prevState => ({
                  showAboutModal: !prevState.showAboutModal
                }))
              }
            />
          </div>
        )}
        {currentInfo && (
          <CurrentTrackDisplay
            title={currentInfo.title}
            href={currentInfo.href}
            artist={currentInfo.artist}
          />
        )}
        {this.audioManager.analyser.audioContext.state === "suspended" && (
          <div className="start-context">
            <button
              type="button"
              onClick={() =>
                this.audioManager.analyser.audioContext
                  .resume()
                  .then(() => this.forceUpdate())
              }
            >
              <span>Press Start</span> スタート
            </button>
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
    repeat: PropTypes.oneOf(["off", "context", "track"]).isRequired
  }).isRequired,
  toast: PropTypes.string
};

App.defaultProps = {
  toast: ""
};

function mapStateToProps(state) {
  return {
    audio: state.audio
  };
}
export const AppContainer = App;
export default connect(mapStateToProps)(App);
