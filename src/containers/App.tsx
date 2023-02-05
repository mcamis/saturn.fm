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
  const [isUiHidden, setIsUiHidden] = React.useState(false);

  return (
    <>
      {audioContextState !== "suspended" && (
        <Suspense fallback={null}>
          <FullApp isUiHidden={isUiHidden} setIsUiHidden={setIsUiHidden} />
        </Suspense>
      )}
      {audioContextState === "suspended" && <CreateAudioContextButton />}
      <Starfield isUiHidden={isUiHidden}/>
    </>
  );
};

export const AppWithAudioContextProvider = () => (
  <AudioManagerContextProvider>
    <App />
  </AudioManagerContextProvider>
);
