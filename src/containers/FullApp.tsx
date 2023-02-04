
import * as React from "react";
// import { Suspense } from "react";

import { useAudioManagerContext } from "../audioManager";
// import About from "../components/About";
// import AudioReactiveCubes from "../components/AudioReactiveCubes";
// import DashboardBackground from "../components/DashboardBackground";
import Header from "../components/Header";
// import Menu from "../components/Menu";
import { Starfield } from "../components/Starfield/Starfield";
import { usePrevious } from "../hooks";
import introSrc from "../effects/intro.mp3";

import styles from './FullApp.module.scss'


// const FileReader = React.lazy(
//   () => import("../components/FileReader/FileReader")
// );

const FullApp = () => {
  const { repeat, audioStatus } = useAudioManagerContext();

  const [showFileInput, setShowFileInput] = React.useState(false);
  const [showAboutModal, setShowAboutModal] = React.useState(false);
  const [hideDash, setHideDash] = React.useState(false);
  const wasHidden = usePrevious(hideDash);

  return (
    <main className={styles.wrapper}>
      <Header
        showExitAnimation={hideDash}
        showEntranceAnimation={!hideDash && wasHidden}
      />
      {/*
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
      <DashboardBackground showExitAnimation={hideDash} />*/}
      <Starfield isUiHidden={hideDash} /> 
    </main>
  );
};


export default FullApp;
