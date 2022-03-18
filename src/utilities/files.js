import jsmediatags from "jsmediatags";
import { v4 as uuidv4 } from "uuid";
/**
 * Automatically generate a file input alert, resolves with a FileList instance
 * @param {*} extensions
 * @param {*} allowDirectory
 */
export async function filePicker({
  extensions = null,
  allowDirectory = false,
}) {
  return new Promise((resolve) => {
    const fileInput = document.createElement("input");
    if (extensions) fileInput.setAttribute("accept", extensions);

    fileInput.type = "file";
    fileInput.multiple = true;
    fileInput.webkitdirectory = allowDirectory;
    fileInput.directory = allowDirectory;
    fileInput.mozdirectory = allowDirectory;

    fileInput.addEventListener("change", (e) => {
      resolve(e.target.files);
      document.body.removeChild(fileInput);

    });

    document.body.appendChild(fileInput);
    fileInput.click();
  });
}

function getMediaTags(file) {
  return new Promise((resolve, reject) => {
    jsmediatags.read(file, {
      onSuccess: (tag) => resolve(tag),
      onError: (error) => reject(error),
    });
  });
}

async function generateTrackInfo(file) {
  let metadata = {};
  try {
    metadata = await getMediaTags(file);
  } catch (err) {
    // eslint-disable-next-line no-console
    console.log("Fetching Tags Error", err);
  }
  const {
    tags: {
      artist = "",
      album = "",
      title = file.name,
      track = 0,
      picture = {},
    } = {},
  } = metadata;

  const { data, type } = picture;

  let maybAlbumArtBlob;
  if (data) {
    const byteArray = new Uint8Array(data);
    const blob = new Blob([byteArray], { type });
    maybAlbumArtBlob = URL.createObjectURL(blob);
  }

  return {
    file,
    track,
    artist,
    album,
    title,
    albumArtUrl: maybAlbumArtBlob,
  };
}

async function createTracklist(files) {
  const filesToAdd = [];
  // eslint-disable-next-line no-restricted-syntax
  for (const file of files) {
    if (file.type.includes("audio")) {
      filesToAdd.push(generateTrackInfo(file));
    }
  }

  const withMetadata = await Promise.all(filesToAdd);
  return withMetadata.reduce((result, file) => {
    const UUID = uuidv4();
    result[UUID] = file; // eslint-disable-line no-param-reassign
    return result;
  }, {});
}

export async function getFilesWithTags(options) {
  let fileList;
  try {
    fileList = await filePicker(options);
  } catch (err) {
    // eslint-disable-next-line no-console
    console.log(err);
    // this.queueToast('Oops, something went wrong fetching your files. Please try again')
  }
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
