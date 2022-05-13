import { cx } from "@linaria/core";

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

const Header = ({
  showExitAnimation,
  showEntranceAnimation,
}: {
  showExitAnimation: boolean;
  showEntranceAnimation: boolean;
}) => {
  const [componentTime, setComponentTime] = useState(0);
  const { audioElement, currentTrackIndex, ...rest } = useAudioManagerContext();
  useInterval(() => {
    setComponentTime(audioElement.currentTime);
  }, 1000);

  return (
    <Wrapper
      className={cx(
        showExitAnimation && "showExitAnimation",
        showEntranceAnimation && "showEntranceAnimation"
      )}
    >
      <TopLayer>
        <h3>Track</h3>
        <p className="track-number">{currentTrackIndex + 1}</p>
        <h3>Time</h3>
        <p>{formatTime(componentTime)}</p>
      </TopLayer>
      <KnightRider />
    </Wrapper>
  );
};

/*
paused:
  header:after {
    display: inline-block;
    transform: translate(350%, 0);
    animation-play-state: paused;
  }

  header p:nth-of-type(2),
  header:after {
    animation: blink 1s infinite;
  
  }
  @keyframes blink {
  0% { opacity: 0; }
  49% { opacity: 0; }
  50% { opacity: 1; }
}
  */

// todo include pixelated?

const Wrapper = styled.header`
  width: 79.5%;
  margin: 0 auto;
  position: relative;

  &.showExitAnimation {
    animation: float-up 1s ease-out 1 forwards;

    @keyframes float-up {
      from {
        transform: translateY(0%);
      }

      to {
        transform: translateY(-105%);
      }
    }
  }

  &.showEntranceAnimation {
    animation-name: floatDownInRelative;
    animation-duration: 600ms;
    animation-iteration-count: 1;
    animation-fill-mode: backwards; // animation-delay: 10s;
    animation-timing-function: linear;
    animation-delay: 700ms;

    @keyframes floatDownInRelative {
      from {
        transform: translateY(-105%);
      }

      to {
        transform: translateY(0%);
      }
    }
  }
`;
const TopLayer = styled.header`
  user-select: none;
  background: url("../images/header.png") top (center / 100%) no-repeat;
  padding: 2.5% 17% 0;
  height: calc(calc(var(--scene-width) * 0.795) * 0.1417322835);

  display: flex;
  width: 100%;
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

const KnightRider = styled.div`
  width: 54%;
  position: absolute;
  bottom: 5px;
  left: 50%;
  z-index: -1;
  content: "";
  background: black;
  height: 10px;
  transform: translate(-50%, 0);

  &:after {
    content: "";
    background: url("../images/knight-rider.png") no-repeat;
    background-position: center center;
    background-size: 100% 100%;
    height: 100%;
    width: 8%;
    bottom: 5%;
    position: absolute;

    animation-name: knight-rider;
    animation-duration: 1000ms;
    animation-iteration-count: infinite;
    animation-timing-function: linear;
    z-index: -1;
  }

  @keyframes knight-rider {
    0% {
      transform: translateX(0) scaleX(0);
    }
    5% {
      transform: translateX(50%) scaleX(1);
    }

    90% {
      transform: translateX(1100%) scaleX(1);
    }
    100% {
      transform: translateX(1200%) scaleX(0);
    }
  }
`;
export default Header;
