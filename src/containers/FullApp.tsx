import { cx } from "@linaria/core";
import { styled } from "@linaria/react";
import * as React from "react";
import { Suspense } from "react";
import { AudioStatus, useAudioManagerContext } from "../audioManager";
import Starfield from "../components/Starfield";
import Cubes from "../components/Cubes";
import Menu from "../components/Menu";
import About from "../components/About";
import Header from "../components/Header";

import introSrc from "../effects/intro.mp3";

const FileReader = React.lazy(() => import("../components/FileReader"));

const FullApp = () => {
  const [hasLoaded, setHasLoaded] = React.useState(false);
  React.useEffect(() => {
    const audioElement = new Audio();
    audioElement.src = introSrc;
    audioElement.play();
    setHasLoaded(true);
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

  const { repeat, audioStatus } = useAudioManagerContext();

  const isPaused = audioStatus === AudioStatus.Paused;
  const isPlaying = audioStatus === AudioStatus.Playing;

  const [showFileInput, setShowFileInput] = React.useState(false);
  const [showAboutModal, setShowAboutModal] = React.useState(false);
  const [hideDash, setHideDash] = React.useState(false);

  return (
    <AppWrapper className={cx(hasLoaded && "hasLoaded")}>
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
      <Starfield isUiHidden={false} />
    </AppWrapper>
  );
};

const AppWrapper = styled.div`
  height: 100%;
  filter: brightness(0);

  &.hasLoaded {
    animation-name: menuBrightness;
    animation-duration: 1s;
    animation-iteration-count: 1;
    animation-fill-mode: forwards; // animation-delay: 10s;
    animation-timing-function: ease-out;
    animation-delay: 200ms;

    @keyframes menuBrightness {
      from {
        filter: brightness(0);
      }

      to {
        filter: brightness(1);
      }
    }
  }
`;

export default FullApp;
