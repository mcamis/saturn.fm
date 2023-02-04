import * as React from "react";
import { audioManagerSingleton } from "../audioManager";
import styles from './CreateAudioContextButton.module.scss'

export const CreateAudioContextButton = () => {
  return (
    <div className={styles.wrapper}>
      <button type="button" onClick={() => audioManagerSingleton.init()}>
        Click to Start
      </button>
    </div>
  );
};
