import React, { Component } from "react";
import PropTypes from "prop-types";
import { connect } from "react-redux";

import autobind from "../utilities/autobind";
import AudioManager from "../utilities/audioManager";
import * as audioActions from "../actions/audio";

import Cubes from "../components/Cubes";
import Menu from "../components/Menu";
import About from "../components/About";
import FileReader from "../components/FileReader";
import Header from "../components/Header";
import Starfield from "../components/Starfield";
import CurrentTrackDisplay from "../components/CurrentTrackDisplay";

import introSrc from "../effects/intro.mp3";

class App extends Component {
  constructor(props) {
    super(props);
    autobind(this);

    this.introEffect = new Audio();
    this.introEffect.src = introSrc;

    this.audioManager = null;

    this.state = {
      show: false,
      isUiHidden: false,
      showAboutModal: false,
      fileReaderVisible: false,
      frameCallbacks: [],
    };
    this.frameId = null;
  }

  componentDidMount() {
    this.frameId = requestAnimationFrame(this.animate);
  }

  setupAnalyser() {
    this.audioManager = new AudioManager();

    this.audioManager.createContext(() => { 
      this.forceUpdate();
      this.playIntro();
    });
  }

  getClassNames() {
    const {
      audio: { isPlaying, isPaused },
    } = this.props;

    const hiddenClass = this.state.isUiHidden ? "hidden" : "";
    const introClass = this.audioManager ? "intro" : " ";
    const pausedClass = isPaused ? "paused" : "";
    const playingClass = isPlaying ? "playing" : "";
    const showClass = this.state.show ? "show" : "";
    const languageClass = ["ja-JP", "ja"].includes(navigator.language)
      ? "japanese"
      : "";

    return `${hiddenClass} ${introClass} ${pausedClass} ${playingClass} ${showClass} ${languageClass}`;
  }

  setAnimationCallback(callback) {
    this.setState((prevState) => ({
      frameCallbacks: [...prevState.frameCallbacks, callback],
    }));
  }

  playIntro() {
    setTimeout(() => {
      this.introEffect.play();
    }, 350);
  }

  hideDash() {
    this.setState((prevState) => ({
      isUiHidden: !prevState.isUiHidden,
      show: false,
    }));
  }

  showIfHidden() {
    if (this.state.isUiHidden) {
      this.frameId = this.frameId || requestAnimationFrame(this.animate);
      this.setState({ isUiHidden: false, show: true });
    }
  }

  animate() {
    this.state.frameCallbacks.forEach((callback) => callback());
    this.frameId = requestAnimationFrame(this.animate);
  }

  toggleMenu() {
    if (this.frameId) {
      cancelAnimationFrame(this.frameId);
      this.frameId = undefined;
    } else {
      requestAnimationFrame(this.animate);
    }

    this.setState((state) => ({ fileReaderVisible: !state.fileReaderVisible }));
  }

  render() {
    const {
      audio: { isPlaying, isPaused, repeat, playlist, currentTrack, tracks },
    } = this.props;

    

    const currentKey = playlist[currentTrack];
    const currentInfo = tracks[currentKey];

    return (
      <div className={this.getClassNames()}>
        {this.audioManager && (
          <>
            <Header
              currentTrack={this.props.audio.currentTrack}
              audioManager={this.audioManager}
            />
            <Menu
              audioManager={this.audioManager}
              isUiHidden={this.state.isUiHidden}
              showIfHidden={this.showIfHidden}
              toggleMenu={this.toggleMenu}
              toggleAbout={() =>
                this.setState((prevState) => ({
                  showAboutModal: !prevState.showAboutModal,
                }))
              }
              hideDash={this.hideDash}
              repeat={repeat}
              isPaused={isPaused}
              isPlaying={isPlaying}
              setAnimationCallback={this.setAnimationCallback}
            />
            <div className="dashboard" />
            <Cubes
              audioManager={this.audioManager}
              isUiHidden={this.state.isUiHidden}
              isPaused={isPaused}
              isPlaying={isPlaying}
              setAnimationCallback={this.setAnimationCallback}
            />
            {this.props.toast && <p>{this.props.toast}</p>}

            {this.state.fileReaderVisible && (
              <FileReader
                {...audioActions}
                audio={this.props.audio}
                toggleMenu={this.toggleMenu}
              />
            )}
            {this.state.showAboutModal && (
              <About
                toggleAbout={() =>
                  this.setState((prevState) => ({
                    showAboutModal: !prevState.showAboutModal,
                  }))
                }
              />
            )}
            {currentInfo && (
              <CurrentTrackDisplay
                title={currentInfo.title}
                href={currentInfo.href}
                artist={currentInfo.artist}
              />
            )}
          </>
        )}
        <Starfield isUiHidden={this.state.isUiHidden} />
        {(!this.audioManager ||
          this.audioManager.analyser.audioContext.state === "suspended") && (
          <div className="start-context">
            <button type="button" onClick={() => this.setupAnalyser()}>
              Press Start
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
    isPlaying: PropTypes.bool.isRequired,
    isPaused: PropTypes.bool.isRequired,
    repeat: PropTypes.oneOf(["off", "context", "track"]).isRequired,
  }).isRequired,
  toast: PropTypes.string,
};

App.defaultProps = {
  toast: "",
};

function mapStateToProps(state) {
  return {
    audio: state.audio,
  };
}
export const AppContainer = App;
export default connect(mapStateToProps)(App);
