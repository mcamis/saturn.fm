import * as React from "react";
import dynamic from "next/dynamic";

import { useAudioManagerContext } from "../audioManager";
import About from "../components/About";
import AudioReactiveCubes from "../components/AudioReactiveCubes";
import { DashboardBackground } from "../components/DashboardBackground";
import Header from "../components/Header";
import Menu from "../components/MenuHooks";
import { usePrevious } from "../hooks";
import styles from "./FullApp.module.scss";

const FileReader = dynamic(
  () => import("../components/FileReader/FileReader"),
  {
    loading: () => null,
  }
);

const FullApp = ({isUiHidden, setIsUiHidden}) => {
  const { repeat, audioStatus } = useAudioManagerContext();

  const [showFileInput, setShowFileInput] = React.useState(false);
  const [showAboutModal, setShowAboutModal] = React.useState(false);
  const wasHidden = usePrevious(isUiHidden);
  console.log({isUiHidden})
  return (
    <main className={styles.wrapper}>
      <Header
        showExitAnimation={isUiHidden}
        showEntranceAnimation={!isUiHidden && wasHidden}
      />
      <Menu
        isUiHidden={isUiHidden}
        showIfHidden={() => isUiHidden && setIsUiHidden(false)}
        toggleMenu={() => setShowFileInput(true)}
        toggleAbout={() => setShowAboutModal(true)}
        toggleDashVisibility={() => setIsUiHidden(true)}
        repeat={repeat}
        audioStatus={audioStatus}
      />
      <AudioReactiveCubes shouldHide={isUiHidden} />
      {showFileInput && (
        <FileReader toggleMenu={() => setShowFileInput(false)} />
      )}
      {showAboutModal && <About toggleAbout={() => setShowAboutModal(false)} />}
      <DashboardBackground showExitAnimation={isUiHidden} />
    </main>
  );
};

export default FullApp;
