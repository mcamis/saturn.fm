import { styled } from "@linaria/react";
import * as React from "react";
import { useState, useEffect, useRef } from "react";
import { formatTime } from "../utilities/helpers";
import { useAudioManagerContext } from "../audioManager";
import headerSrc from "../images/header.png";
import knightSrc from "../images/knight-rider.png";

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
  const { audioElement, currentTrackIndex, ...rest } = useAudioManagerContext();
  useInterval(() => {
    setComponentTime(audioElement.currentTime);
  }, 1000);

  // TODO: Fix Safari missing prop changes / renders
  return (
    <Wrapper>
      <h3>Track</h3>
      <p className="track-number">{currentTrackIndex + 1}</p>
      <h3>Time</h3>
      <p>{formatTime(componentTime)}</p>
    </Wrapper>
  );
};

const Wrapper = styled.header`
  user-select: none;

  &:before {
    width: 100%;
    position: absolute;
    top: 0;
    left: 0;
    height: 100%;
    z-index: -1;
    content: "";
    background: url(${headerSrc}) top (center / 100%) no-repeat;
  }

  &:after {
    display: none;
    content: "";
    background: url(${knightSrc}) no-repeat;
    background-position: center center;
    background-size: 100% 100%;
    height: 12%;
    width: 8%;
    bottom: 5%;
    position: absolute;

    animation-name: knight-rider;
    animation-duration: 1000ms;
    animation-iteration-count: infinite;
    animation-timing-function: linear;
    z-index: -2;
  }
`;

export default Header;
