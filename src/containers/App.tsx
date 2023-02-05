import * as React from "react";
import { Suspense } from "react";

import {
  AudioManagerContextProvider,
  useAudioManagerContext,
} from "../audioManager";
import { CreateAudioContextButton } from "../components/CreateAudioContextButton";
import dynamic from "next/dynamic";
import styles from "./App.module.scss";

// Don't load three.js until an audio context is
const FullApp = React.lazy(() => import("./FullApp"));
const Starfield = React.lazy(() => import("../components/Starfield/Starfield"));

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
        <Suspense fallback={null}>
          <FullApp isUiHidden={isUiHidden} setIsUiHidden={setIsUiHidden} />
        </Suspense>
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
