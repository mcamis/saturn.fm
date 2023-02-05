import {
  TextureLoader,
  NearestFilter,
  DoubleSide,
  CylinderGeometry,
  MeshBasicMaterial,
  PlaneGeometry,
  Vector3,
  Mesh,
} from "three";
import { Tween, Easing } from "@tweenjs/tween.js";
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
export const shadowTexture = new TextureLoader().load(orbShadow.src);

// export const menuButtons = {
//   disc: {
//     position: [-2.25, 0, 1],
//     animationDuration: 400,
//     animationDelay: 220,
//     imageSrc: discSrc.src,
//     showShadow: false,
//   },
//   settings: {
//     position: [0, 0, 1],
//     animationDelay: 100,
//     animationDuration: 400,
//     imageSrc: moreSrc.src,
//     showShadow: false,
//   },
//   hide: {
//     position: [2.25, 0, 1],
//     animationDelay: 180,
//     animationDuration: 400,
//     imageSrc: hideSrc.src,
//     showShadow: false,
//   },
//   rewind: {
//     position: [-2.25, -2.15, 1],
//     animationDelay: 500,
//     animationDuration: 350,
//     imageSrc: rwdSrc.src,
//     showShadow: false,
//   },
//   play: {
//     position: [0, -2.15, 1],
//     animationDelay: 300,
//     animationDuration: 350,
//     imageSrc: playSrc.src,
//     showShadow: false,
//   },
//   fastforward: {
//     position: [2.25, -2.15, 1],
//     animationDelay: 280,
//     animationDuration: 350,
//     imageSrc: ffwdSrc.src,
//     showShadow: false,
//   },
//   repeat: {
//     position: [-2.25, -4.3, 1],
//     animationDelay: 600,
//     animationDuration: 300,
//     imageSrc: repeatSrc.src,
//     showShadow: true,
//   },
//   stop: {
//     position: [0, -4.3, 1],
//     animationDelay: 700,
//     animationDuration: 300,
//     imageSrc: stopSrc.src,
//     showShadow: true,
//   },
//   advanced: {
//     position: [2.25, -4.3, 1],
//     onClick: () => {},
//     animationDelay: 900,
//     animationDuration: 300,
//   },
// };

export type MenuButton = {
  name: string;
  position: number[];
  animationDuration: number;
  animationDelay: number;
  mapSrc: string;
  showShadow: boolean;
  onClick: any;
};

export const menuButtonsData = [
  {
    name: "disc",
    position: [-2.25, 0, 1],
    onClick: () => {},
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
    showShadow: false,
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
];

export const menuButtons = new Map();
menuButtonsData.forEach((button) => menuButtons.set(button.name, button));

/* Animates a Vector3 to the target */
export function slideDown(
  vectorToAnimate: Vector3,
  { x, y, z }: Vector3,
  { delay, duration }: { delay: number; duration: number }
) {
  // create the tween
  const tweenVector3 = new Tween(vectorToAnimate)
    .to({ x, y, z }, duration)
    .easing(Easing.Quadratic.InOut)
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

export function animateButtonPosition(plane: Mesh, target: Vector3) {
  slideDown(plane.position, target, {
    duration: (plane.material as any)?.userData?.animationDuration ?? 2000,
    delay: (plane.material as any)?.userData?.animationDelay ?? 200,
  });
}
