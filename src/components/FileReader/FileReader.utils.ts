import { DropResult } from "react-beautiful-dnd";
/* eslint-disable react/jsx-props-no-spreading */
import { getFilesWithTags, reorder } from "../../utilities/files";
import { audioManagerSingleton } from "../../audioManager";

export async function getTracks() {
  const tracks = await getFilesWithTags({
    extensions: ".mp3, .m4a, .flac, .wav, .aac",
  });
  audioManagerSingleton.addTracks(tracks);
}

export async function getDirectory() {
  const tracks = await getFilesWithTags({
    extensions: ".mp3, .wav, .aac",
    allowDirectory: true,
  });

  audioManagerSingleton.addTracks(tracks);
}

export const getDraggableClasses = ({
  isDragging,
  currentPlaying,
}: {
  isDragging: boolean;
  currentPlaying: boolean;
}) =>
  `draggable ${isDragging ? "isDragging" : ""} ${
    currentPlaying ? "currentTrack" : ""
  }`;

export function onDragEnd(result: DropResult) {
  const curr = audioManagerSingleton.state.currentTrackIndex;

  // dropped outside the list
  if (!result.destination) {
    return;
  }

  const items = reorder(
    audioManagerSingleton.state.tracks,
    result.source.index,
    result.destination.index
  );

  // TODO: lol
  if (result.source.index === curr) {
    audioManagerSingleton.setCurrentTrack(result.destination.index);
  } else if (result.destination.index === curr) {
    if (result.source.index < curr) {
      audioManagerSingleton.setCurrentTrack(curr - 1);
    } else {
      audioManagerSingleton.setCurrentTrack(
        result.destination.index ? curr + 1 : 1
      );
    }
  } else if (result.source.index > curr && curr > result.destination.index) {
    audioManagerSingleton.setCurrentTrack(curr + 1);
  } else if (result.source.index < curr && curr < result.destination.index) {
    audioManagerSingleton.setCurrentTrack(curr - 1);
  }

  audioManagerSingleton.setNewTrackOrder(items);
}
