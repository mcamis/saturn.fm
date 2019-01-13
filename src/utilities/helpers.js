import Rhyme from '../songs/Rhyme.mp3';
import NoRefuge from '../songs/No-Refuge.mp3';
import YMO from '../images/ymo.jpg';

export const average = arr => arr.reduce((p, c) => p + c, 0) / arr.length;

export const sceneWidth = () =>
  window.innerWidth > 1000 ? 1000 : window.innerWidth;

export const formatTime = time => {
  const MM = Math.trunc(time / 60)
    .toString()
    .padStart(2, '0');
  const SS = Math.trunc(time % 60)
    .toString()
    .padStart(2, '0');

  return `${MM}:${SS}`;
};

export const randomSize = () => Math.random() * (6 - 4) + 4;
export const randomPosition = () => Math.random() * 1000 - 500;

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

export const playlists = [
  {
    artist: 'Professor Kliq',
    name: 'Rhyme',
    tracks: [Rhyme, NoRefuge],
    coverArt: YMO,
  },
  {
    artist: 'Haruomi Hosono',
    name: 'Paraiso',

    tracks: [NoRefuge, Rhyme],
    coverArt: YMO,
  },
  {
    artist: 'Big Time Fun',
    name: 'Wetness',
    tracks: [NoRefuge, Rhyme],
    coverArt: YMO,
  },
  {
    artist: 'Polish Bride ',
    name: 'Butt Dimples',
    tracks: [NoRefuge, Rhyme],
    coverArt: YMO,
  },
];

export async function filePicker(extensions = null, allowDirectory = false) {
  return new Promise(resolve => {
    const fileInput = document.createElement('input');
    if (extensions) fileInput.setAttribute('accept', extensions);

    fileInput.type = 'file';
    fileInput.multiple = true;

    fileInput.webkitdirectory = allowDirectory;
    fileInput.directory = allowDirectory;
    fileInput.mozdirectory = allowDirectory;

    fileInput.addEventListener('change', e => resolve(e.target.files));
    fileInput.click();
  });
}
