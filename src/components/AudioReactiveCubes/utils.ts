/* eslint-disable no-param-reassign */
import { Tween, Easing } from "es6-tween";
import { Color, Mesh } from "three";
import { logarithmic } from "../../utilities/helpers";

const COLOR_TWEENING_SCALE = 0.75;
const MAX_ACTIVE_ROTATION = 0.03;
const MIN_ACTIVE_ROTATION = 0.01;
const IDLE_ROTATION = 0.0025;

const randomRange = (max: number, min: number) => Math.random() * (max - min) + min;

const colorTween = (target: Mesh, channelFFT: number) => {
  const logVal = logarithmic(channelFFT * COLOR_TWEENING_SCALE);
  const hue = 142.5 - logVal;

  // // TODO: This HSL change is quick but doesn't exactly match the original behavior
  const { r, g, b } = new Color(`hsl(${hue > 0 ? hue : 0}, 100%, 48%)`);

  return new (Tween as any)((target as any).material.color)
    .to({ r, g, b }, 100)
    .easing(Easing.Linear.None)
    .start();
};

export const updateScaleAndColor = (cube: Mesh, averageFFT: number) => {
  colorTween(cube, averageFFT);

  const derivedInfluence = averageFFT * 0.007 > 1 ? 1 : averageFFT * 0.007;
  cube.morphTargetInfluences[0] = derivedInfluence;

  // TODO: Why did I use these magic numbers?
  const derivedSize = averageFFT * 0.008 + 0.5;
  const m = derivedSize < 1.65 ? derivedSize : 1.65;

  return new Tween(cube.scale)
    .to({ x: m, y: m, z: m }, 50)
    .easing(Easing.Linear.None)
    .start();
};

export const activeRotation = (cube: Mesh, modifier?: number) => {
  // TODO: At random interval, flip directions
  const derivedMax = modifier
    ? -Math.abs(MAX_ACTIVE_ROTATION)
    : MAX_ACTIVE_ROTATION;
  const derivedMin = modifier
    ? -Math.abs(MIN_ACTIVE_ROTATION)
    : MIN_ACTIVE_ROTATION;

  cube.rotateX(randomRange(derivedMax, derivedMin));
  cube.rotateY(randomRange(derivedMax, derivedMin));
};

export const idleRotation = (cube: Mesh, modifier = 1, down: boolean, up: boolean) => {
  if (up) {
    cube.position.y += 0.0075;
  } else if (down) {
    cube.position.y -= 0.0075;
  }
  // cube.rotateX(IDLE_ROTATION * modifier);
  cube.rotateY(IDLE_ROTATION * modifier);
};
