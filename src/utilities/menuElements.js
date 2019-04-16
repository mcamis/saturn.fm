import discSrc from 'images/disc.png';
import moreSrc from 'images/more.png';
import hideSrc from 'images/hide.png';
import rwdSrc from 'images/rwd.png';
import playSrc from 'images/play-pause.png';
import ffwdSrc from 'images/ffwd.png';
import stopSrc from 'images/stop.png';
import repeatSrc from 'images/repeat.png';
import textureSrc from 'images/texture.gif';
import pinkSrc from 'images/pink.gif';
import orbShadow from 'images/orb-shadow.png';

import * as THREE from 'three';
import { Tween, Easing } from '@tweenjs/tween.js';

export const orbitGeometry = new THREE.CylinderGeometry(
  1.45,
  1.45,
  0.35,
  12,
  1,
  true
);
const orbitTexture = new THREE.TextureLoader().load(textureSrc);
const pinkTexture = new THREE.TextureLoader().load(pinkSrc);

// NearestFilter gets us that sweet sweet pixelated look
orbitTexture.magFilter = THREE.NearestFilter;
pinkTexture.magFilter = THREE.NearestFilter;

export const purpleMesh = new THREE.MeshBasicMaterial({
  lights: false,
  side: THREE.DoubleSide,
  transparent: true,
  map: orbitTexture,
});

export const pinkMesh = new THREE.MeshBasicMaterial({
  lights: false,
  side: THREE.DoubleSide,
  transparent: true,
  map: pinkTexture,
});

export const planeGeometry = new THREE.PlaneGeometry(2, 2, 1, 1);
export const shadowGeometry = new THREE.PlaneGeometry(1.5, 1.5, 1, 1);
export const shadowTexture = new THREE.TextureLoader().load(orbShadow);

export const createButtons = (audioManager, hideMenu, toggleMenu) => [
  {
    name: 'disc',
    position: [-2.25, 0, 1],
    onClick: () => {
      setTimeout(() => toggleMenu(), 500);
    },
    animationDuration: 400,
    animationDelay: 220,
    mapSrc: discSrc,
    showShadow: false,
  },
  {
    name: 'settings',
    position: [0, 0, 1],
    onClick: () => {},
    animationDelay: 100,
    animationDuration: 400,
    mapSrc: moreSrc,
    showShadow: false,
  },
  {
    name: 'hide',
    position: [2.25, 0, 1],
    onClick: hideMenu,
    animationDelay: 180,
    animationDuration: 400,
    mapSrc: hideSrc,
    showShadow: false,
  },
  {
    name: 'rewind',
    position: [-2.25, -2.15, 1],
    onClick: audioManager.previousTrack,
    animationDelay: 500,
    animationDuration: 350,
    mapSrc: rwdSrc,
    showShadow: false,
  },
  {
    name: 'play',
    position: [0, -2.15, 1],
    onClick: audioManager.togglePlay,
    animationDelay: 300,
    animationDuration: 350,
    mapSrc: playSrc,
    showShadow: false,
  },
  {
    name: 'fastforward',
    position: [2.25, -2.15, 1],
    onClick: audioManager.nextTrack,
    animationDelay: 280,
    animationDuration: 350,
    mapSrc: ffwdSrc,
  },
  {
    name: 'repeat',
    position: [-2.25, -4.3, 1],
    onClick: audioManager.toggleRepeat,
    animationDelay: 600,
    animationDuration: 300,
    mapSrc: repeatSrc,
    showShadow: true,
  },
  {
    name: 'stop',
    position: [0, -4.3, 1],
    onClick: audioManager.stop,
    animationDelay: 700,
    animationDuration: 300,
    mapSrc: stopSrc,
    showShadow: true,
  },

  // {
  //   name: 'advanced',
  //   position: [2.25, -4.3, 1],
  //   onClick: hideDash,
  //   animationDelay: 900,
  //   animationDuration: 300,
  //   mapSrc: advancedSrc,
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
