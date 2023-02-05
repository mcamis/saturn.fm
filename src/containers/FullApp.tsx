
import * as React from "react";
import dynamic from 'next/dynamic'

import { useAudioManagerContext } from "../audioManager";
import About from "../components/About";
import AudioReactiveCubes from "../components/AudioReactiveCubes";
import {DashboardBackground} from "../components/DashboardBackground";
import Header from "../components/Header";
import Menu from "../components/MenuHooks";
import { usePrevious } from "../hooks";
import styles from './FullApp.module.scss'

const FileReader = dynamic(() => import("../components/FileReader/FileReader"), {
  loading: () => null,
})

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
      <Menu
        isUiHidden={hideDash}
        showEntranceAnimation={!hideDash && wasHidden}
        showIfHidden={() => hideDash && setHideDash(false)}
        toggleMenu={() =>setShowFileInput(true)}
        toggleAbout={() => setShowAboutModal(true)}
        hideDash={() => setHideDash(true)}
        repeat={repeat}
        audioStatus={audioStatus}
      />
      <AudioReactiveCubes shouldHide={hideDash} />
      {showFileInput && <FileReader toggleMenu={() => setShowFileInput(false)} /> }
    {showAboutModal && <About toggleAbout={() => setShowAboutModal(false)} />} 
      <DashboardBackground showExitAnimation={hideDash} />
    </main>
  );
};


export default FullApp;
