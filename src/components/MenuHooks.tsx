import * as React from "react";
import PropTypes from "prop-types";
import styles from './Menu.module.scss'
import {
  AudioStatus,
  RepeatValues,
} from "../audioManager";

import {
  getLocalizedCopy,
} from "../utilities/helpers";
import { audioManagerSingleton } from "../audioManager";

import {MenuItems} from './MenuItems/MenuItems'

function getToolTip(repeat, audioStatus, activeButton) {
  const { menu } = getLocalizedCopy();
  const isPlaying = audioStatus === AudioStatus.Playing;
  const isPaused = audioStatus === AudioStatus.Paused;

  const tooltips = {
    disc: () => <p>{menu.disc}</p>,
    settings: () => <p>{menu.settings}</p>,
    hide: () => <p>{menu.hide}</p>,
    rewind: () => <p>{menu.skipBackwards}</p>,
    fastforward: () => <p>{menu.skipForwards}</p>,
    play: () => {
      let playElement = (
        <p>
          {menu.play} / {menu.pause}
        </p>
      );
      if (isPlaying) {
        playElement = (
          <p>
            <strong>{menu.play}</strong> / {menu.pause}
          </p>
        );
      } else if (isPaused) {
        playElement = (
          <p>
            {menu.play} / <strong>{menu.pause}</strong>
          </p>
        );
      }
      return playElement;
    },
    repeat: () => {
      let repeatElement = (
        <p>
          {menu.repeat}: {menu.repeatOne} / {menu.repeatAll} /{" "}
          <strong>{menu.repeatOff}</strong>
        </p>
      );
      if (repeat === RepeatValues.Single) {
        repeatElement = (
          <p>
            {menu.repeat}: <strong>{menu.repeatOne}</strong> /{" "}
            {menu.repeatAll} / {menu.repeatOff}
          </p>
        );
      } else if (repeat === RepeatValues.All) {
        repeatElement = (
          <p>
            {menu.repeat}: {menu.repeatOne} /{" "}
            <strong>{menu.repeatAll}</strong> / {menu.repeatOff}
          </p>
        );
      }
      return repeatElement;
    },
    stop: () => <p>{menu.stop}</p>,
    advanced: () => <p>{menu.advanced}</p>,
  };

  return tooltips?.[activeButton]?.() ?? null;
}
const Menu = (props) => {
  const [activeButton, setActiveButton] = React.useState();

  const handleMenuClick = (action: string) => {
    console.log({action})
    switch (action) {
      case 'play':
        return audioManagerSingleton.togglePlayPause();
      case 'fastforward':
        return audioManagerSingleton.loadNextTrack();
      case 'disc':
        return props.toggleMenu();
        case 'rewind':
          return audioManagerSingleton.loadPreviousTrack();
          case 'repeat':
            return audioManagerSingleton.toggleRepeat();
            case 'hide':
              return props.hideDash();
              case 'stop':
                return audioManagerSingleton.stop();
                case 'advanced':
                  return props.toggleAbout();
        
    }
  }
  
    return (
      <>
        <div key={activeButton} className={styles.tooltip}>
          {getToolTip(props.repeat, props.audioStatus, activeButton)}
        </div>
        <div className={styles.wrapper}>
        <MenuItems setActiveButton={setActiveButton} activeButton={activeButton}  handleClick={handleMenuClick}/>
        </div>
      </>
    );

}

Menu.propTypes = {
  toggleMenu: PropTypes.func.isRequired,
  hideDash: PropTypes.func.isRequired,
  isUiHidden: PropTypes.bool.isRequired,
  showIfHidden: PropTypes.func.isRequired,
};

export default Menu;
