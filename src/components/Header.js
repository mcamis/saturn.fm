import React, { useState, useEffect, useRef } from "react";
import PropTypes from "prop-types";
import { formatTime } from "utilities/helpers";
import timeSrc from "images/time.png";
import trackSrc from "images/track.png";

// https://overreacted.io/making-setinterval-declarative-with-react-hooks/
function useInterval(callback, delay) {
  const savedCallback = useRef();

  // Remember the latest callback.
  useEffect(() => {
    savedCallback.current = callback;
  });

  // TODO: move this to redux?
  useEffect(() => {
    function tick() {
      savedCallback.current();
    }
    if (delay !== null) {
      const id = setInterval(tick, delay);
      return () => clearInterval(id);
    }
  }, [delay]);
}

const Header = ({ audioManager, currentTrack }) => {
  const [componentTime, setComponentTime] = useState(0);

  useInterval(() => {
    setComponentTime(audioManager.currentTime);
  }, 1000);

  // TODO: Fix Safari missing prop changes / renders
  // TODO: Fix poor performance
  return (
    <header>
      <h3>Track</h3>
      <p className="track-number">{`${currentTrack + 1}`}</p>
      <h3>Time</h3>
      <p>{formatTime(componentTime)}</p>
      <div className="knight-rider" />
    </header>
  );
};

Header.propTypes = {
  audioManager: PropTypes.shape({}),
};

export default Header;
