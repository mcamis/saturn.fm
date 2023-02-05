import * as React from "react";
import {
  AudioManagerContextProvider,
  useAudioManagerContext,
} from "../audioManager";
import { CreateAudioContextButton } from "../components/CreateAudioContextButton";
import dynamic from "next/dynamic";
import styles from "./App.module.scss";

// Don't load three.js until an audio context is
const FullApp = dynamic(() => import("./FullApp"), { ssr: false });
const Starfield = dynamic(() => import("../components/Starfield/Starfield"), {
  ssr: false,
});

const App = () => {
  const [hasMounted, setHasMounted] = React.useState(false);
  const { audioContextState } = useAudioManagerContext();
  const [isUiHidden, setIsUiHidden] = React.useState(false);

  React.useEffect(() => {
    setHasMounted(true);
  }, []);

  return (
    <>
      {audioContextState !== "suspended" && (
        <FullApp isUiHidden={isUiHidden} setIsUiHidden={setIsUiHidden} />
      )}
      {audioContextState === "suspended" && <CreateAudioContextButton />}
      {hasMounted && <Starfield isUiHidden={isUiHidden} />}
      <div className={styles.galaxy} />
    </>
  );
};

export const AppWithAudioContextProvider = () => (
  <AudioManagerContextProvider>
    <App />
  </AudioManagerContextProvider>
);
