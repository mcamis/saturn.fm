import * as THREE from "three";
import * as TWEEN from "es6-tween";

export function average(arr) {
  // Prevent returning NaN
  if (!arr.length) {
    return 0;
  }

  let fullValue = 0;
  for (let i = 0; i < arr.length; i += 1) {
    fullValue += arr[i];
  }

  return fullValue / arr.length;
}

export const sceneWidth = () => {
  // Maintain a 4:3 aspect ratio on wide screens, shrink on portrait screens
  const actualWidth = window.innerWidth;
  const idealWidth = window.innerHeight * 1.3333;
  if (idealWidth > actualWidth) {
    document.documentElement.style.setProperty(
      "--scene-width",
      `${actualWidth}px`
    );
    return actualWidth;
  }
  document.documentElement.style.setProperty(
    "--scene-width",
    `${idealWidth}px`
  );
  return idealWidth;
};

export const formatTime = (time) => {
  const MM = Math.trunc(time / 60)
    .toString()
    .padStart(2, "0");
  const SS = Math.trunc(time % 60)
    .toString()
    .padStart(2, "0");

  return `${MM}:${SS}`;
};

export const randomSize = () => Math.random() * 2 + 1;
export const randomPosition = (max) => Math.random() * max - max * 0.5;

// I am very bad at maths
// https://stackoverflow.com/a/846249
export const logarithmic = (position) => {
  const minp = 0;
  const maxp = 100;
  const minv = Math.log(1);
  const maxv = Math.log(142);
  const scale = (maxv - minv) / (maxp - minp);
  return Math.exp(minv + scale * (position - minp));
};

export const throttle = (func, timeFrame = 0) => {
  let lastTime = 0;
  return (args) => {
    const now = new Date();
    if (now - lastTime >= timeFrame) {
      func(args);
      lastTime = now;
    }
  };
};

export function triggerButtonCallback(object, onClick) {
  new TWEEN.Tween(object.scale)
    .to({ x: 1.5, y: 1.5, z: 1.5 }, 100)
    .easing(TWEEN.Easing.Quadratic.Out)
    .start();

  setTimeout(() => {
    new TWEEN.Tween(object.scale)
      .to({ x: 1, y: 1, z: 1 }, 100)
      .easing(TWEEN.Easing.Quadratic.In)
      .start();
  }, 250);

  onClick();
}

// https://stemkoski.github.io/Three.js/Texture-Animation.html
/* eslint-disable no-param-reassign */
export function TextureAnimator(
  texture,
  tilesHorizontal = 222,
  tileDisplayDuration = 40,
  tilesVertical = 2
) {
  texture.wrapS = THREE.RepeatWrapping;
  texture.wrapT = THREE.RepeatWrapping;
  texture.repeat.set(1 / tilesHorizontal, 1 / tilesVertical);

  let currentDisplayTime = 0;
  let currentTile = 0;

  this.update = (milliSec) => {
    currentDisplayTime += milliSec;
    while (currentDisplayTime > tileDisplayDuration) {
      currentDisplayTime -= tileDisplayDuration;
      currentTile += 1;

      if (currentTile === 437) {
        currentTile = 0;
      }

      const currentColumn = currentTile % tilesHorizontal;
      const currentRow = Math.floor(currentTile / tilesHorizontal);

      // texture.offset.y = currentRow / tilesVertical;
      texture.offset.y = 1 - currentRow / tilesVertical - 1 / tilesVertical;
      texture.offset.x = currentColumn / tilesHorizontal;
    }
  };
}
