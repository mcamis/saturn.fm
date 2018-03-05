import { Tween, Easing } from '@tweenjs/tween.js';
import { Color } from 'three/src/math/Color';

export const average = arr => arr.reduce((p, c) => p + c, 0) / arr.length;

export const formatTime = time =>
  Math.trunc(time / 60)
    .toString()
    .padStart(2, '0') +
  ':' +
  Math.trunc(time % 60)
    .toString()
    .padStart(2, '0');

export const randomSize = () => Math.random() * (6 - 4) + 4;
export const randomPosition = () => Math.random() * 1000 - 500;

// I am very bad at maths
// https://stackoverflow.com/a/846249
const logarithmic = position => {
  const minp = 0;
  const maxp = 100;
  const minv = Math.log(1);
  const maxv = Math.log(142);
  const scale = (maxv - minv) / (maxp - minp);
  return Math.exp(minv + scale * (position - minp));
};

export const colorTween = (target, volume) => {
  const logVal = logarithmic(volume * 0.6);
  const hue = 142.5 - logVal;

  const initial = new Color(target.material.color.getHex());
  // TODO: This HSL change is quick but doesn't exactly match the original behavior
  const newColor = new Color(`hsl(${hue > 0 ? hue : 0}, 100%, 48%)`);

  return new Tween(initial)
    .to(newColor, 20)
    .easing(Easing.Quadratic.Out)
    .onUpdate(() => {
      target.material.color.set(initial);
    })
    .start();
};
