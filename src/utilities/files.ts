import type { TagType } from "jsmediatags/types";
import jsmediatags from "jsmediatags";
import { v4 as uuidv4 } from "uuid";
import type { Track } from "../audioManager";

type FilePickerOptions = {
  extensions?: string;
  allowDirectory?: boolean;
};
/**
 * Automatically generate a file input alert, resolves with a FileList instance
 * @param {*} extensions
 * @param {*} allowDirectory
 */
export async function filePicker({
  extensions,
  allowDirectory,
}: FilePickerOptions) {
  return new Promise<FileList>((resolve) => {
    const fileInput = document.createElement("input");
    if (extensions) fileInput.setAttribute("accept", extensions);

    fileInput.type = "file";
    fileInput.multiple = true;
    fileInput.webkitdirectory = allowDirectory;
    (fileInput as any).directory = allowDirectory;
    (fileInput as any).mozdirectory = allowDirectory;

    fileInput.addEventListener("change", (e) => {
      resolve((e.target as any).files); // todo fix
      document.body.removeChild(fileInput);
    });

    document.body.appendChild(fileInput);
    fileInput.click();
  });
}

function getMediaTags(file: File) {
  return new Promise((resolve, reject) => {
    jsmediatags.read(file, {
      onSuccess: (tag: TagType) => resolve(tag),
      onError: (error: any) => reject(error),
    });
  });
}

const isValidString = (s: unknown) => typeof s === "string" && s.length;

async function generateTrackInfo(file: File) {
  let metadata = {};
  try {
    metadata = await getMediaTags(file);
  } catch (err) {
    // eslint-disable-next-line no-console
    console.log("Fetching Tags Error", err);
  }
  const { tags: { artist, album, title, track, picture } = {} } =
    metadata as TagType;

  let maybAlbumArtBlob;
  if (picture?.data) {
    const byteArray = new Uint8Array(picture?.data);
    const blob = new Blob([byteArray], { type: picture?.format });
    maybAlbumArtBlob = URL.createObjectURL(blob);
  }

  return {
    file,
    track: track ?? 0,
    artist: isValidString(artist) ? artist : "Unknown Artist",
    album: isValidString(album) ? album : "Unknown Album",
    title: isValidString(title) ? title : file.name,
    albumArtUrl: maybAlbumArtBlob,
  };
}

async function createTracklist(files: FileList) {
  const filesToAdd = [];
  // eslint-disable-next-line no-restricted-syntax
  for (const file of Array.from(files)) {
    if (file.type.includes("audio")) {
      filesToAdd.push(generateTrackInfo(file));
    }
  }

  const withMetadata = await Promise.all(filesToAdd);
  return withMetadata.reduce((result, file) => {
    result.push({ ...file, id: uuidv4() });
    return result;
  }, []);
}

export async function getFilesWithTags(options: FilePickerOptions) {
  let fileList;
  try {
    fileList = await filePicker(options);
    console.log(fileList);
  } catch (err) {
    // eslint-disable-next-line no-console
    console.log(err);
    // this.queueToast('Oops, something went wrong fetching your files. Please try again')
  }
  const trackList = await createTracklist(fileList);
  return trackList;
}

// a little function to help us with reordering the result
export const reorder = (
  trackList: Track[],
  startIndex: number,
  endIndex: number
) => {
  const result = Array.from(trackList);
  const [removed] = result.splice(startIndex, 1);
  result.splice(endIndex, 0, removed);

  return result;
};
