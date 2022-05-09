import React, { useState, useEffect, useRef } from "react";
import { formatTime } from "../utilities/helpers";
import { audioManagerSingleton } from "../utilities/audioManager";
import {
  useAudioManagerContext,
  AudioManagerContextProvider,
} from "../containers/AudioManagerContext";
// https://overreacted.io/making-setinterval-declarative-with-react-hooks/
function useInterval(callback: () => void, delay: number) {
  const savedCallback = useRef<() => void>();

  // Remember the latest callback.
  useEffect(() => {
    savedCallback.current = callback;
  });

  useEffect(() => {
    function tick() {
      savedCallback?.current();
    }
    if (delay !== null) {
      const id = setInterval(tick, delay);
      return () => clearInterval(id);
    }
  }, [delay]);
}

const Header = () => {
  const [componentTime, setComponentTime] = useState(0);
  const [state] = useAudioManagerContext();
  console.log(state?.currentTrackIndex);
  console.log(state?.playerState);

  // useInterval(() => {
  //   setComponentTime(audioManagerSingleton.currentTime);
  // }, 1000);

  // TODO: Fix Safari missing prop changes / renders
  return (
    <header>
      <h3>Track</h3>
      <p className="track-number">{state.currentTrackIndex + 1}</p>
      <h3>Time</h3>
      <p>{formatTime(componentTime)}</p>
    </header>
  );
};

const WithProvider = () => (
  <AudioManagerContextProvider>
    <Header />
  </AudioManagerContextProvider>
);

export default WithProvider;
