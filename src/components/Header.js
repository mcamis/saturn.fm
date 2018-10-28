import React, { useState, useEffect, useRef } from 'react';
import PropTypes from 'prop-types';
import { formatTime } from 'utilities/helpers';
import timeSrc from 'images/time.png';
import trackSrc from 'images/track.png';

const Header = ({ audioManager, audio }) => {
  const [componentTime, setComponentTime] = useState(0);
  const intervalRef = useRef();

  useEffect(() => {
    const id = setInterval(() => {
      setComponentTime(audioManager.currentTime);
    }, 1000);

    intervalRef.current = id;
    return () => {
      clearInterval(intervalRef.current);
    };
  });

  return (
    <header>
      <div className="info">
        <div className="track">
          <img src={trackSrc} alt="TODO" />
          <div className="track-number">{audio.trackNumber}</div>
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
