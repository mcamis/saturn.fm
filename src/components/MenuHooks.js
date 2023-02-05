// Todo: Import specific tween functions as needed
import * as TWEEN from "es6-tween";
import {
  Clock,
  Scene,
  Vector2,
  Raycaster,
  PerspectiveCamera,
  WebGLRenderer,
  TextureLoader,
  NearestFilter,
  Mesh,
  MeshBasicMaterial,
  Vector3,
} from "three";
import * as React from "react";
import PropTypes from "prop-types";
import styles from './Menu.module.scss'
import {
  audioManagerSingleton,
  AudioStatus,
  RepeatValues,
} from "../audioManager";

import {
  throttle,
  sceneWidth,
  triggerButtonCallback,
  TextureAnimator,
  getLocalizedCopy,
} from "../utilities/helpers";

import {
  animateButtonPosition,
  createButtons,
  orbitGeometry,
  purpleMesh,
  pinkMesh,
  planeGeometry,
  shadowGeometry,
  shadowTexture,
} from "../utilities/menuElements";

import globeSprite from "../images/globeSprite.png";

import buttonSrc from "../effects/button-press.mp3";
import highlightSrc from "../effects/button-highlight.mp3";
import hideSrc from "../effects/hide.mp3";
import showSrc from "../effects/show.mp3";

import autobind from "../utilities/autobind";
import {MenuItems} from './MenuItems/MenuItems'

// TODO: Set more magic numbers to constants
const SHADOW_OFFSET = 1.025;

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
    return (
      <>
        <div key={activeButton} className={styles.tooltip}>
          {getToolTip(props.repeat, props.audioStatus, activeButton)}
        </div>
        <div className={styles.wrapper}>
        <MenuItems />
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
