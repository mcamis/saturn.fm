import Rhyme from '../songs/Rhyme.mp3';
import NoRefuge from '../songs/No-Refuge.mp3';
export const average = arr => arr.reduce((p, c) => p + c, 0) / arr.length;

export const sceneWidth = () => {
  const actualWidth = window.innerWidth;
  const idealWidth = window.innerHeight * 1.25;

  if (idealWidth > actualWidth) {
    return actualWidth;
  } else {
    return idealWidth;
  }
};

export const formatTime = time => {
  const MM = Math.trunc(time / 60)
    .toString()
    .padStart(2, '0');
  const SS = Math.trunc(time % 60)
    .toString()
    .padStart(2, '0');

  return `${MM}:${SS}`;
};

export const randomSize = () => Math.floor(Math.random() * Math.floor(2)) + 2;
export const randomPosition = max => Math.random() * max - max * 0.5;

// I am very bad at maths
// https://stackoverflow.com/a/846249
export const logarithmic = position => {
  const minp = 0;
  const maxp = 100;
  const minv = Math.log(1);
  const maxv = Math.log(142);
  const scale = (maxv - minv) / (maxp - minp);
  return Math.exp(minv + scale * (position - minp));
};
