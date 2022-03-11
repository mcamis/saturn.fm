import React, { useState, useEffect, useRef } from "react";
import { formatTime } from "../utilities/helpers";

// https://overreacted.io/making-setinterval-declarative-with-react-hooks/
function useInterval(callback: () => void, delay: number) {
  const savedCallback = useRef<() => void>();

  // Remember the latest callback.
  useEffect(() => {
    savedCallback.current = callback;
  });

  // TODO: move this to redux?
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

type AudioManager = {
  currentTime: number;
};

const Header = ({
  audioManager,
  currentTrack,
}: {
  audioManager: AudioManager;
  currentTrack: number;
}) => {
  const [componentTime, setComponentTime] = useState(0);

  useInterval(() => {
    setComponentTime(audioManager.currentTime);
  }, 1000);

  // TODO: Fix Safari missing prop changes / renders
  // TODO: Fix poor performance
  return (
    <header>
      <h3>Track</h3>
      <p className="track-number">{currentTrack + 1}</p>
      <h3>Time</h3>
      <p>{formatTime(componentTime)}</p>
    </header>
  );
};

export default Header;
