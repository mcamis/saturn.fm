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

const FullApp = ({
  isUiHidden,
  setIsUiHidden,
}: {
  isUiHidden: boolean;
  setIsUiHidden: (_: boolean) => void;
}) => {
  const [isExitAnimationFinished, setIsExitAnimationFinished] =
    React.useState(false);
  const { repeat, audioStatus } = useAudioManagerContext();
  const [showFileInput, setShowFileInput] = React.useState(false);
  const [showAboutModal, setShowAboutModal] = React.useState(false);
  const wasHidden = usePrevious(isUiHidden);

  React.useEffect(() => {
    if (isUiHidden) {
      setIsExitAnimationFinished(false);
      window.setTimeout(() => setIsExitAnimationFinished(true), 2000);
    } else {
      setIsExitAnimationFinished(true);
    }
  }, [isUiHidden]);
  React.useEffect(() => {
    // TODO: move this to a ref
    document.addEventListener("keydown", (e) => {
      if (e.code === "Escape") {
        isExitAnimationFinished && setIsUiHidden(false);
      }
    });
  }, []);
  return (
    <main
      className={styles.wrapper}
      onClick={() => {
        if (isUiHidden && isExitAnimationFinished) {
          setIsUiHidden(false);
        }
      }}
    >
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
      <DashboardBackground isUiHidden={isUiHidden} />
    </main>
  );
};

export default FullApp;
