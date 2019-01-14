import React, { useState, useEffect, useRef } from 'react';
import PropTypes from 'prop-types';
import { formatTime } from 'utilities/helpers';
import timeSrc from 'images/time.png';
import trackSrc from 'images/track.png';

const Header = ({ audioManager, currentTrack }) => {
  const [componentTime, setComponentTime] = useState(0);
  const intervalRef = useRef();
  

  useEffect(() => {
    const id = setInterval(() => {
      console.log('what?', audioManager.currentTime);
      setComponentTime(audioManager.currentTime);
    }, 1000);

    intervalRef.current = id;
    return () => {
      clearInterval(intervalRef.current);
    };
  });

  // TODO: Fix Safari missing prop changes / renders
  return (
    <header>
      <div className="info">
        <div className="track">
          <img src={trackSrc} alt="TODO" />
          <div className="track-number">
            {`${currentTrack + 1}`}
          </div>
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
