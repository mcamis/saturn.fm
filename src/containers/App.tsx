import * as React from "react";
import { Suspense } from "react";

import {
  AudioManagerContextProvider,
  useAudioManagerContext,
} from "../audioManager";
import { ContextCTA } from "../components/ContextCta";
import Starfield from "../components/Starfield";

const FullApp = React.lazy(() => import("./FullApp"));

const App = () => {
  const { audioContextState } = useAudioManagerContext();

  return (
    <div>
      {audioContextState !== "suspended" && (
        <Suspense fallback={null}>
          <FullApp />
        </Suspense>
      )}
      <Starfield isUiHidden={false} />
      {audioContextState === "suspended" && <ContextCTA />}
    </div>
  );
};

export default () => (
  <AudioManagerContextProvider>
    <App />
  </AudioManagerContextProvider>
);
