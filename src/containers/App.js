import React, { Component, Suspense } from "react";
import PropTypes from "prop-types";

import autobind from "../utilities/autobind";
import { audioManagerSingleton, PlayerState } from "../utilities/audioManager";

import Cubes from "../components/Cubes";
import Menu from "../components/Menu";
import About from "../components/About";
import Header from "../components/Header";
import Starfield from "../components/Starfield";
import CurrentTrackDisplay from "../components/CurrentTrackDisplay";

import introSrc from "../effects/intro.mp3";

const FileReader = React.lazy(() => import("../components/FileReader"));

class App extends Component {
  constructor(props) {
    super(props);
    autobind(this);

    this.introEffect = new Audio();
    this.introEffect.src = introSrc;

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
    audioManagerSingleton.createContext(() => {
      this.forceUpdate();
      this.playIntro();
    });
  }

  getClassNames() {
    const isPlaying =
      audioManagerSingleton.state.playerState === PlayerState.Playing;
    const isPaused =
      audioManagerSingleton.state.playerState === PlayerState.Paused;

    const hiddenClass = this.state.isUiHidden ? "hidden" : "";
    const introClass = audioManagerSingleton ? "intro" : " ";
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
    // todo these updates are occuring outside of react;
    const isPaused =
      audioManagerSingleton.state.playerState === PlayerState.Paused;
    const isPlaying =
      audioManagerSingleton.state.playerState === PlayerState.Playing;
    const currentTrack =
      audioManagerSingleton.state.tracks[
        audioManagerSingleton.state.currentTrackIndex
      ];

    return (
      <div className={this.getClassNames()}>
        {audioManagerSingleton.analyser.audioContext.state !== "suspended" && (
          <>
            <Header
              currentTrack={currentTrack}
              audioManager={audioManagerSingleton}
            />
            <Menu
              isUiHidden={this.state.isUiHidden}
              showIfHidden={this.showIfHidden}
              toggleMenu={this.toggleMenu}
              toggleAbout={() =>
                this.setState((prevState) => ({
                  showAboutModal: !prevState.showAboutModal,
                }))
              }
              hideDash={this.hideDash}
              setAnimationCallback={this.setAnimationCallback}
            />
            <div className="dashboard" />
            <Cubes
              audioManager={audioManagerSingleton}
              isUiHidden={this.state.isUiHidden}
              isPaused={isPaused}
              isPlaying={isPlaying}
              setAnimationCallback={this.setAnimationCallback}
            />
            {this.props.toast && <p>{this.props.toast}</p>}

            {this.state.fileReaderVisible && (
              <Suspense fallback={null}>
                <FileReader
                  setCurrentTrack={() => {}}
                  addTracks={() => {}}
                  removeTrack={() => {}}
                  toggleMenu={this.toggleMenu}
                />
              </Suspense>
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
            {currentTrack && (
              <CurrentTrackDisplay
                title={currentTrack.title}
                href={currentTrack.href}
                artist={currentTrack.artist}
              />
            )}
          </>
        )}
        <Starfield isUiHidden={this.state.isUiHidden} />
        {audioManagerSingleton.analyser.audioContext.state === "suspended" && (
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
  toast: PropTypes.string,
};

App.defaultProps = {
  toast: "",
};

export const AppContainer = App;
export default App;
