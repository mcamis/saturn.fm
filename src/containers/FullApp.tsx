import * as React from "react";
import { Suspense } from "react";
import {
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

  // todo these updates are occuring outside of react;

  const {
    repeat,
    tracks,
    currentTrackIndex,
    audioStatus,
  } = useAudioManagerContext();

  const isPaused = audioStatus === AudioStatus.Paused;
  const isPlaying = audioStatus === AudioStatus.Playing;

  const [showFileInput, setShowFileInput] = React.useState(false);
  const [showAboutModal, setShowAboutModal] = React.useState(false);
  const [hideDash, setHideDash] = React.useState(false);

  return (
    <div>
      <Header />
      <Menu
        isUiHidden={hideDash}
        showIfHidden={() => hideDash && setHideDash(false)}
        toggleMenu={setShowFileInput}
        toggleAbout={() => setShowAboutModal(true)}
        hideDash={() => setHideDash(true)}
        repeat={repeat}
        audioStatus={audioStatus}
      />
      <div className="dashboard" />
      <Cubes
        audioStatus={audioStatus}
        isUiHidden={hideDash}
        isPaused={isPaused}
        isPlaying={isPlaying}
      />
      {showFileInput && (
        <Suspense fallback={null}>
          <FileReader
            addTracks={() => {}}
            removeTrack={() => {}}
            toggleMenu={() => setShowFileInput(false)}
          />
        </Suspense>
      )}
      {showAboutModal && <About toggleAbout={() => setShowAboutModal(false)} />}
    </div>
  );
};

export default FullApp;
