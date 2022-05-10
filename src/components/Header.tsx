import { styled } from "@linaria/react";
import * as React from "react";
import { useState, useEffect, useRef } from "react";
import { formatTime } from "../utilities/helpers";
import { useAudioManagerContext } from "../audioManager";

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

  return (
    <Wrapper>
      <h3>Track</h3>
      <p className="track-number">{currentTrackIndex + 1}</p>
      <h3>Time</h3>
      <p>{formatTime(componentTime)}</p>
    </Wrapper>
  );
};

/*
//.playing {
  header:after {
    display: inline-block;
  }
}

.hidden {
  header {
    animation-name: floatUpRelative;
    animation-duration: 1000ms;
    animation-iteration-count: 1;
    animation-fill-mode: forwards; // animation-delay: 10s;
    animation-timing-function: ease-out;

    // animation-delay: 150ms;
  }
}

paused:
  header:after {
    display: inline-block;
    transform: translate(350%, 0);
    animation-play-state: paused;

    
      header p:nth-of-type(2),
  header:after {
    animation: blink 1s infinite;
  }
  }
  */

// todo include pixelated?
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
    background: url("../images/header.png") top (center / 100%) no-repeat;
  }

  &:after {
    display: none;
    content: "";
    background: url("../images/knight-rider.png") no-repeat;
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

  width: 79.5%;
  margin: 0 auto;
  position: relative;
  padding: 2% 13.5% 0;
  display: flex;
  height: calc(calc(var(--scene-width) * 0.795) * 0.1417322835);
  z-index: 10;
  color: #014949;

  h3 {
    margin: 0;
    display: inline-block;
    font-size: calc(var(--scene-width) / 35);

    letter-spacing: 2px;
    text-transform: uppercase;
    font-family: "Phoebe Condensed Bold";
    line-height: 1;
  }
  p {
    line-height: 1;
    margin: 0;
    letter-spacing: 2px;
    padding-left: 2%;

    font-size: calc(var(--scene-width) / 18);

    display: inline-block;
  }
  h3:nth-of-type(2) {
    margin-left: 25%;
  }
`;

export default Header;
