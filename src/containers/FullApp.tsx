import { cx } from "@linaria/core";
import { styled } from "@linaria/react";
import * as React from "react";
import { Suspense } from "react";

import { useAudioManagerContext } from "../audioManager";
import About from "../components/About";
import AudioReactiveCubes from "../components/AudioReactiveCubes";
import DashboardBackground from "../components/DashboardBackground";
import Header from "../components/Header";
import Menu from "../components/Menu";
import Starfield from "../components/Starfield";
import { usePrevious } from "../hooks";
import introSrc from "../effects/intro.mp3";

const FileReader = React.lazy(
  () => import("../components/FileReader/FileReader")
);

const FullApp = () => {
  const [hasLoaded, setHasLoaded] = React.useState(false);
  React.useEffect(() => {
    const audioElement = new Audio();
    audioElement.src = introSrc;
    audioElement.play();
    setHasLoaded(true);
  }, []);

  const { repeat, audioStatus } = useAudioManagerContext();

  const [showFileInput, setShowFileInput] = React.useState(false);
  const [showAboutModal, setShowAboutModal] = React.useState(false);
  const [hideDash, setHideDash] = React.useState(false);
  const wasHidden = usePrevious(hideDash);

  return (
    <AppWrapper className={cx(hasLoaded && "hasLoaded")}>
      <Header
        showExitAnimation={hideDash}
        showEntranceAnimation={!hideDash && wasHidden}
      />
      <Menu
        isUiHidden={hideDash}
        showEntranceAnimation={!hideDash && wasHidden}
        showIfHidden={() => hideDash && setHideDash(false)}
        toggleMenu={setShowFileInput}
        toggleAbout={() => setShowAboutModal(true)}
        hideDash={() => setHideDash(true)}
        repeat={repeat}
        audioStatus={audioStatus}
      />
      <AudioReactiveCubes shouldHide={hideDash} />
      {showFileInput && (
        <Suspense fallback={null}>
          <FileReader toggleMenu={() => setShowFileInput(false)} />
        </Suspense>
      )}
      {showAboutModal && <About toggleAbout={() => setShowAboutModal(false)} />}
      <DashboardBackground showExitAnimation={hideDash} />
      <Starfield isUiHidden={hideDash} />
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
