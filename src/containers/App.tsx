import * as React from "react";
import { Suspense } from "react";

import {
  AudioManagerContextProvider,
  useAudioManagerContext,
} from "../audioManager";
import { ContextCTA } from "../components/ContextCta";

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
      {audioContextState === "suspended" && <ContextCTA />}
    </>
  );
};

export default () => (
  <AudioManagerContextProvider>
    <App />
  </AudioManagerContextProvider>
);
