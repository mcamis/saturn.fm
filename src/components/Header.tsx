import clsx from "clsx";
import { useState } from "react";

import { formatTime } from "../utilities/helpers";
import { audioManagerSingleton, useAudioManagerContext } from "../audioManager";
import { useInterval } from "../hooks";
import styles from "./Header.module.scss";

const Header = ({
  showExitAnimation,
  showEntranceAnimation,
}: {
  showExitAnimation: boolean;
  showEntranceAnimation: boolean;
}) => {
  const [componentTime, setComponentTime] = useState(0);
  const { currentTrackIndex } = useAudioManagerContext();

  useInterval(() => {
    setComponentTime(audioManagerSingleton?.audioElement.currentTime);
  }, 1000);

  return (
    <header
      className={clsx(styles.wrapper, {
        [styles.showExitAnimation]: showExitAnimation,
        [styles.showEntranceAnimation]: showEntranceAnimation,
      })}
    >
      <div className={styles.topLayer}>
        <h3>Track</h3>
        <p className="track-number">{currentTrackIndex + 1}</p>
        <h3>Time</h3>
        <p>{formatTime(componentTime)}</p>
      </div>
      <div className={styles.knightRider} />
    </header>
  );
};

export default Header;
