import React, { Component, Suspense } from "react";
import {
  AudioManagerContextProvider,
  audioManagerSingleton,
  AudioStatus,
  useAudioManagerContext,
} from "../audioManager";
import Cubes from "../components/Cubes";
import Menu from "../components/Menu";
import About from "../components/About";
import Header from "../components/Header";

import introSrc from "../effects/intro.mp3";

const FileReader = React.lazy(() => import("../components/FileReader"));

const FullApp = () => {
  React.useEffect(() => {
    const audioElement = new Audio();
    audioElement.src = introSrc;
    audioElement.play();
  }, []);
  // class App extends Component {
  //   constructor(props) {
  //     super(props);
  //     autobind(this);

  //     this.introEffect = new Audio();
  //     this.introEffect.src = introSrc;

  //     this.state = {
  //       show: false,
  //       isUiHidden: false,
  //       showAboutModal: false,
  //       fileReaderVisible: false,
  //       frameCallbacks: [],
  //     };
  //     this.frameId = null;
  //   }

  //   componentDidMount() {
  //     this.frameId = requestAnimationFrame(this.animate);
  //   }

  //   setupAnalyser() {
  //     audioManagerSingleton.createAudioContext(() => {
  //       this.forceUpdate();
  //       this.playIntro();
  //     });
  //   }

  //   getClassNames() {
  //     const isPlaying =
  //       audioManagerSingleton.state.audioStatus === AudioStatus.Playing;
  //     const isPaused =
  //       audioManagerSingleton.state.audioStatus === AudioStatus.Paused;

  //     const hiddenClass = this.state.isUiHidden ? "hidden" : "";
  //     const introClass = audioManagerSingleton ? "intro" : " ";
  //     const pausedClass = isPaused ? "paused" : "";
  //     const playingClass = isPlaying ? "playing" : "";
  //     const showClass = this.state.show ? "show" : "";
  //     const languageClass = ["ja-JP", "ja"].includes(navigator.language)
  //       ? "japanese"
  //       : "";

  //     return `${hiddenClass} ${introClass} ${pausedClass} ${playingClass} ${showClass} ${languageClass}`;
  //   }

  //   setAnimationCallback(callback) {
  //     this.setState((prevState) => ({
  //       frameCallbacks: [...prevState.frameCallbacks, callback],
  //     }));
  //   }

  //   playIntro() {
  //     setTimeout(() => {
  //       this.introEffect.play();
  //     }, 350);
  //   }

  //   hideDash() {
  //     this.setState((prevState) => ({
  //       isUiHidden: !prevState.isUiHidden,
  //       show: false,
  //     }));
  //   }

  //   showIfHidden() {
  //     if (this.state.isUiHidden) {
  //       this.frameId = this.frameId || requestAnimationFrame(this.animate);
  //       this.setState({ isUiHidden: false, show: true });
  //     }
  //   }

  //   animate() {
  //     this.state.frameCallbacks.forEach((callback) => callback());
  //     this.frameId = requestAnimationFrame(this.animate);
  //   }

  //   toggleMenu() {
  //     if (this.frameId) {
  //       cancelAnimationFrame(this.frameId);
  //       this.frameId = undefined;
  //     } else {
  //       requestAnimationFrame(this.animate);
  //     }

  //     this.setState((state) => ({ fileReaderVisible: !state.fileReaderVisible }));
  //   }

  // todo these updates are occuring outside of react;
  const isPaused =
    audioManagerSingleton.state.audioStatus === AudioStatus.Paused;
  const isPlaying =
    audioManagerSingleton.state.audioStatus === AudioStatus.Playing;
  const currentTrack =
    audioManagerSingleton.state.tracks[
      audioManagerSingleton.state.currentTrackIndex
    ];
  const { repeat, audioStatus } = useAudioManagerContext();

  const [showFileInput, setShowFileInput] = React.useState(false);

  return (
    <div>
      <Header />
      <Menu
        isUiHidden={false}
        showIfHidden={() => {}}
        toggleMenu={setShowFileInput}
        toggleAbout={() => {}}
        hideDash={() => {}}
        setAnimationCallback={() => {}}
        repeat={repeat}
        audioStatus={audioStatus}
      />
      <div className="dashboard" />
      <Cubes
        audioStatus={audioStatus}
        isUiHidden={false}
        isPaused={isPaused}
        isPlaying={isPlaying}
        setAnimationCallback={() => {}}
      />
      {showFileInput && (
        <Suspense fallback={null}>
          <FileReader
            addTracks={() => {}}
            removeTrack={() => {}}
            toggleMenu={setShowFileInput}
          />
        </Suspense>
      )}
      {false && (
        <About
          toggleAbout={
            () => {}
            //   this.setState((prevState) => ({
            //     showAboutModal: !prevState.showAboutModal,
            //   }))
          }
        />
      )}
    </div>
  );
};

// const useSoundEffect = (src: string) => {

//   React.useEffect(() => {
//     const audioElement = new Audio();
//     audioElement.src = src;
//   }

//   this.introEffect = new Audio();
//   this.introEffect.src = introSrc;

//   this.introEffect.play();

// };

export default FullApp;
