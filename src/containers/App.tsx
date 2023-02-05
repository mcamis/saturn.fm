import * as React from "react";
import { Suspense } from "react";
import { Starfield } from "../components/Starfield/Starfield";

import {
  AudioManagerContextProvider,
  useAudioManagerContext,
} from "../audioManager";
import { CreateAudioContextButton } from "../components/CreateAudioContextButton";

// Don't load three.js until an audio context is reated
const FullApp = React.lazy(() => import("./FullApp"));

const App = () => {
  const { audioContextState } = useAudioManagerContext();

  return (
    <>
      {audioContextState !== "suspended" && (
        <Suspense fallback={null}>
          <FullApp />
        </Suspense>
      )}
      {audioContextState === "suspended" && <CreateAudioContextButton />}
      <Starfield />
    </>
  );
};

export const AppWithAudioContextProvider = () => (
  <AudioManagerContextProvider>
    <App />
  </AudioManagerContextProvider>
);
