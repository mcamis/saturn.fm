export const average = arr => arr.filter(Boolean).reduce((p, c) => p + c, 0) / arr.length;

export const sceneWidth = () => {
  // Maintain a 4:3 aspect ratio on wide screens, shrink on portrait screens
  const actualWidth = window.innerWidth;
  const idealWidth = window.innerHeight * 1.3333;
  if (idealWidth > actualWidth) {
    document.documentElement.style.setProperty('--scene-width', actualWidth + "px");
    return actualWidth;
  } else {
    document.documentElement.style.setProperty('--scene-width', idealWidth + "px");
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
