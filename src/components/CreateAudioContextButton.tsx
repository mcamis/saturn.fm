import * as React from "react";
import { audioManagerSingleton } from "../audioManager";
import styles from "./CreateAudioContextButton.module.scss";
import introSrc from "../effects/intro.mp3";

export const CreateAudioContextButton = () => {
  return (
    <div className={styles.wrapper}>
      <div className={styles.warning}>
        <h1>⚠️ WARNING: PHOTOSENSITIVITY ⚠️</h1>
        <p>This app displays flashing colors and shapes</p>
      </div>
      <button
        type="button"
        onClick={() => {
          // TODO: Sound effects manager
          const audioElement = new Audio();
          audioElement.src = introSrc;
          window.setTimeout(() => {
            audioElement.play();
          }, 500); // TODO: Figure out this magic number?
          audioManagerSingleton.init();
        }}
      >
        Click to Start
      </button>
    </div>
  );
};
