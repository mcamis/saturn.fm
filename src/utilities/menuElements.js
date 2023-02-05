import {
  TextureLoader,
  NearestFilter,
  DoubleSide,
  CylinderGeometry,
  MeshBasicMaterial,
  PlaneGeometry,
} from "three";
import { Tween, Easing } from "es6-tween";
import discSrc from "../images/disc.png";
import moreSrc from "../images/more.png";
import hideSrc from "../images/hide.png";
import rwdSrc from "../images/rwd.png";
import playSrc from "../images/play-pause.png";
import ffwdSrc from "../images/ffwd.png";
import stopSrc from "../images/stop.png";
import repeatSrc from "../images/repeat.png";
import textureSrc from "../images/texture.gif";
import pinkSrc from "../images/pink.gif";
import orbShadow from "../images/orb-shadow.png";

export const orbitGeometry = new CylinderGeometry(
  1.45,
  1.45,
  0.35,
  40,
  1,
  true
);
const orbitTexture = new TextureLoader().load(textureSrc.src);
const pinkTexture = new TextureLoader().load(pinkSrc.src);

// NearestFilter gets us that sweet sweet pixelated look
orbitTexture.magFilter = NearestFilter;
pinkTexture.magFilter = NearestFilter;

export const purpleMesh = new MeshBasicMaterial({
  side: DoubleSide,
  transparent: true,
  map: orbitTexture,
});

export const pinkMesh = new MeshBasicMaterial({
  side: DoubleSide,
  transparent: true,
  map: pinkTexture,
});

export const planeGeometry = new PlaneGeometry(2, 2, 1, 1);
export const shadowGeometry = new PlaneGeometry(1.5, 1.5, 1, 1);
export const shadowTexture = new TextureLoader().load(orbShadow);

export const createButtons = ( hideMenu, toggleMenu) => [
  {
    name: "disc",
    position: [-2.25, 0, 1],
    onClick: () => {    },
    animationDuration: 400,
    animationDelay: 220,
    mapSrc: discSrc.src,
    showShadow: false,
  },
  {
    name: "settings",
    position: [0, 0, 1],
    onClick: () => {},
    animationDelay: 100,
    animationDuration: 400,
    mapSrc: moreSrc.src,
    showShadow: false,
  },
  {
    name: "hide",
    position: [2.25, 0, 1],
    onClick: () => {},
    animationDelay: 180,
    animationDuration: 400,
    mapSrc: hideSrc.src,
    showShadow: false,
  },
  {
    name: "rewind",
    position: [-2.25, -2.15, 1],
    onClick: () => {},
    animationDelay: 500,
    animationDuration: 350,
    mapSrc: rwdSrc.src,
    showShadow: false,
  },
  {
    name: "play",
    position: [0, -2.15, 1],
    onClick: () => {},
    animationDelay: 300,
    animationDuration: 350,
    mapSrc: playSrc.src,
    showShadow: false,
  },
  {
    name: "fastforward",
    position: [2.25, -2.15, 1],
    onClick: () => {},
    animationDelay: 280,
    animationDuration: 350,
    mapSrc: ffwdSrc.src,
  },
  {
    name: "repeat",
    position: [-2.25, -4.3, 1],
    onClick: () => {},
    animationDelay: 600,
    animationDuration: 300,
    mapSrc: repeatSrc.src,
    showShadow: true,
  },
  {
    name: "stop",
    position: [0, -4.3, 1],
    onClick: () => {},
    animationDelay: 700,
    animationDuration: 300,
    mapSrc: stopSrc.src,
    showShadow: true,
  },

  // {
  //   name: 'advanced',
  //   position: [2.25, -4.3, 1],
  //   onClick: hideDash,
  //   animationDelay: 900,
  //   animationDuration: 300,
  //   mapSrc: advancedSrc.src,
  // },
];

/* Animates a Vector3 to the target */
export function slideDown(
  vectorToAnimate,
  { x, y, z },
  { easing = Easing.Quadratic.In, delay, duration = 2000 }
) {
  // create the tween
  const tweenVector3 = new Tween(vectorToAnimate)
    .to({ x, y, z }, duration)
    .easing(easing)
    // .onUpdate(d => {
    //   if (options.update) {
    //     options.update(d);
    //   }
    // })
    // .onComplete(() => {
    //   if (options.callback) options.callback();
    // })
    .delay(delay);

  // start the tween
  tweenVector3.start();
  // return the tween in case we want to manipulate it later on
  // return tweenVector3;
}

export function animateButtonPosition(plane, target) {
  slideDown(plane.position, target, {
    duration: plane.material.userData.animationDuration,
    delay: plane.material.userData.animationDelay,
    easing: Easing.Quadratic.InOut,
  });
}
