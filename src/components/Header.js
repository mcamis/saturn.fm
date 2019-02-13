import React, { useState, useEffect, useRef } from 'react';
import PropTypes from 'prop-types';
import { formatTime } from 'utilities/helpers';
import timeSrc from 'images/time.png';
import trackSrc from 'images/track.png';

// https://overreacted.io/making-setinterval-declarative-with-react-hooks/
function useInterval(callback, delay) {
  const savedCallback = useRef();

  // Remember the latest callback.
  useEffect(() => {
    savedCallback.current = callback;
  });

  // TODO: move this to redux!
  useEffect(
    () => {
      function tick() {
        savedCallback.current();
      }
      if (delay !== null) {
        const id = setInterval(tick, delay);
        return () => clearInterval(id);
      }
    },
    [delay]
  );
}

const Header = ({ audioManager, currentTrack }) => {
  const [componentTime, setComponentTime] = useState(0);

  useInterval(() => {
    setComponentTime(audioManager.currentTime);
  }, 1000);

  // TODO: Fix Safari missing prop changes / renders
  return (
    <header>
      <div className="info">
        <div className="track">
          <img src={trackSrc} alt="TODO" />
          <div className="track-number">{`${currentTrack + 1}`}</div>
        </div>
        <div className="time">
          <img src={timeSrc} alt="TODO" />
        </div>
        <div className="timer">{formatTime(componentTime)}</div>
      </div>
      <div className="knight-rider" />
    </header>
  );
};

export default Header;
