import jsmediatags from 'jsmediatags';
import uuidv4 from 'uuid/v4';
/**
 * Automatically generate a file input alert, resolves with a FileList instance
 * @param {*} extensions
 * @param {*} allowDirectory
 */
export async function filePicker({
  extensions = null,
  allowDirectory = false,
}) {
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

function getMediaTags(file) {
  return new Promise((resolve, reject) => {
    jsmediatags.read(file, {
      onSuccess: tag => resolve(tag),
      onError: error => reject(error),
    });
  });
}

async function generateTrackInfo(file) {
  const {
    tags: { artist = '', album = '', title = file.name },
  } = await getMediaTags(file);

  return {
    file,
    trackNumber: 3,
    artist,
    album,
    title,
  };
}

async function createTracklist(files) {
  const filesToAdd = [];
  // eslint-disable-next-line no-restricted-syntax
  for (const file of files) {
    filesToAdd.push(generateTrackInfo(file));
  }

  const withMetadata = await Promise.all(filesToAdd);
  return withMetadata.reduce((result, file) => {
    const UUID = uuidv4();
    result[UUID] = file; // eslint-disable-line no-param-reassign
    return result;
  }, {});
}

export async function getFilesWithTags(options) {
  const fileList = await filePicker(options);
  const trackList = await createTracklist(fileList);
  return trackList;
}

// a little function to help us with reordering the result
export const reorder = (list, startIndex, endIndex) => {
  const result = Array.from(list);
  const [removed] = result.splice(startIndex, 1);
  result.splice(endIndex, 0, removed);

  return result;
};
