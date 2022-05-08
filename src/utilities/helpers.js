import { RepeatWrapping } from "three";
import * as TWEEN from "es6-tween";
import Track2 from "../songs/Cookies/02.mp3";
import Track3 from "../songs/Cookies/03.mp3";
import Track4 from "../songs/Cookies/04.mp3";
import CookiesCover from "../songs/Cookies/cover.png";

const JP_LOCALES = ["ja-JP", "ja"];

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
  tilesHorizontal = 23,
  tileDisplayDuration = 40,
  tilesVertical = 19
) {
  texture.wrapS = RepeatWrapping;
  texture.wrapT = RepeatWrapping;
  texture.repeat.set(1 / tilesHorizontal, 1 / tilesVertical);

  let currentDisplayTime = 0;
  let currentTile = 0;
  const totalTiles = 419;

  this.update = (milliSec) => {
    currentDisplayTime += milliSec;
    while (currentDisplayTime > tileDisplayDuration) {
      currentDisplayTime -= tileDisplayDuration;
      currentTile += 1;

      if (currentTile > totalTiles) {
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

export const getLocalizedCopy = (preferredLanguage = navigator.language) => {
  if (JP_LOCALES.includes(preferredLanguage)) {
    return {
      intro: {},
      menu: {
        disc: "プレイリスト",
        settings: "ユーザー設定",
        hide: "パネル消去",
        skipBackwards: "曲戻し",
        skipForwards: "曲送り",
        play: "再生",
        pause: "一時停止",
        repeat: "リピート",
        repeatOne: "1曲",
        repeatAll: "全曲",
        repeatOff: "解除",
        stop: "停  止",
        advanced: "機能切り替え",
        exit: "",
      },
      fileReader: {
        header: "Edit Playlist",
        helpText: "",
        exit: "",
        directory: "",
        files: "",
      },
      playlist: {
        number: "#",
        title: "title",
        artist: "artist",
        album: "album",
      },
    };
  }

  return {
    menu: {
      disc: "Edit Playlist",
      settings: "Coming Soon",
      hide: "Hide",
      skipBackwards: "Skip Backwards",
      skipForwards: "Skip Forwards",
      play: "Play",
      pause: "Pause",
      repeat: "Repeat",
      repeatOne: "1",
      repeatAll: "All",
      repeatOff: "Off",
      stop: "Stop",
      advanced: "About",
      exit: "",
    },
    fileReader: {
      header: "Edit Playlist",
      helpText: "",
      exit: "",
      directory: "",
      files: "",
    },
    playlist: {
      number: "#",
      title: "title",
      artist: "artist",
      album: "album",
    },
  };
};

export const defaultTracks = [
  {
    file: Track2,
    track: 1,
    album: "Music for Touching",
    artist: "Cookies",
    title: "Go Back",
    href: "",
    albumArtUrl: CookiesCover,
    isDefault: true,
    srcPath: "",
  },
  {
    file: Track3,
    track: 2,
    album: "Music for Touching",
    artist: "Cookies",
    title: "July Seventeen",
    href: "",
    albumArtUrl: CookiesCover,
    isDefault: true,
    srcPath: "",
  },
  {
    file: Track4,
    track: 3,
    album: "Music for Touching",
    artist: "Cookies",
    title: "Crybaby (A)",
    href: "",
    albumArtUrl: CookiesCover,
    isDefault: true,
    srcPath: "",
  },
];
