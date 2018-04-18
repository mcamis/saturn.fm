import { Tween, Easing } from '@tweenjs/tween.js';
import { Color } from 'three/src/math/Color';

import { logarithmic } from 'utilities/helpers';

const COLOR_TWEENING_SCALE = .75;
const MAX_ACTIVE_ROTATION = 0.03;
const MIN_ACTIVE_ROTATION = 0.01;
const IDLE_ROTATION = 0.0025;

const colorTween = (target, channelFFT) => {
  const logVal = logarithmic(channelFFT * COLOR_TWEENING_SCALE);
  const hue = 142.5 - logVal;

  const initial = new Color(target.material.color.getHex());

  // TODO: This HSL change is quick but doesn't exactly match the original behavior
  const newColor = new Color(`hsl(${hue > 0 ? hue : 0}, 100%, 48%)`);

  return new Tween(initial)
    .to(newColor, 250)
    .easing(Easing.Quadratic.Out)
    .onUpdate(() => {
      target.material.color.set(initial);
    })
    .start();
};

export const updateScaleAndColor = (cube, channelFFT) => {
  colorTween(cube, channelFFT);

  // TODO: Tween scale?
  const derivedSize = channelFFT * 0.01 + 1;
  cube.scale.set(derivedSize, derivedSize, derivedSize);
};

const randomRange = (max, min) => Math.random() * (max - min) + min;

export const activeRotation = (cube, modifier) => {
  const derivedMax = modifier
    ? -Math.abs(MAX_ACTIVE_ROTATION)
    : MAX_ACTIVE_ROTATION;
  const derivedMin = modifier
    ? -Math.abs(MIN_ACTIVE_ROTATION)
    : MIN_ACTIVE_ROTATION;

  cube.rotateX(randomRange(derivedMax, derivedMin));
  cube.rotateY(randomRange(derivedMax, derivedMin));
};

export const idleRotation = (cube, modifier = 1) => {
  cube.rotateX(IDLE_ROTATION * modifier);
  cube.rotateY(IDLE_ROTATION * modifier);
};
