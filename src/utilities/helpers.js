import * as THREE from "three";

export function average (arr){
  let fullValue = 0;
  for (let i = 0; i < arr.length; i++){
    if(arr[i]){ 
     fullValue += arr[i];
    }
  }
  
  return fullValue / arr.length;
}


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


export const throttle = (func, timeFrame = 0) => {
  let lastTime = 0;
  return args => {
    const now = new Date();
    if (now - lastTime >= timeFrame) {
      func(args);
      lastTime = now;
    }
  };
}



// TODO: Move to utility class
export function textureAnimator(texture, tilesHorizontal, tileDisplayDuration) {
  texture.wrapS = THREE.RepeatWrapping;
  texture.wrapT = THREE.RepeatWrapping;
  texture.repeat.set(1 / tilesHorizontal, 1);

  let currentDisplayTime = 0;
  let currentTile = 0;

  this.update = milliSec => {
    currentDisplayTime += milliSec;
    while (currentDisplayTime > tileDisplayDuration) {
      currentDisplayTime -= tileDisplayDuration;
      currentTile += 1;

      if (currentTile === tilesHorizontal) currentTile = 0;

      const currentColumn = currentTile % tilesHorizontal;
      texture.offset.x = currentColumn / tilesHorizontal;
    }
  };
}