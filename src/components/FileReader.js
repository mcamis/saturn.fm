/* eslint-disable react/jsx-props-no-spreading */
import * as React from "react";
import PropTypes from "prop-types";
import styled, { keyframes } from "styled-components";
import { DragDropContext, Droppable, Draggable } from "react-beautiful-dnd";
import { getFilesWithTags, reorder } from "../utilities/files";
import { getLocalizedCopy } from "../utilities/helpers";
import { Modal } from "./Modal";
import { audioManagerSingleton, useAudioManagerContext } from "../audioManager";

async function getTracks() {
  const tracks = await getFilesWithTags({
    extensions: ".mp3, .m4a, .flac, .wav, .aac",
  });
  audioManagerSingleton.addTracks(tracks);
}

async function getDirectory() {
  const tracks = await getFilesWithTags({
    extensions: ".mp3, .wav, .aac",
    allowDirectory: true,
  });

  audioManagerSingleton.addTracks(tracks);
}

const getDraggableClasses = ({ isDragging, currentPlaying }) => {
  return `draggable ${isDragging ? "isDragging" : ""} ${
    currentPlaying ? "currentTrack" : ""
  }`;
};

function onDragEnd(result) {
  const curr =
    audioManagerSingleton.state.tracks[
      audioManagerSingleton.state.currentTrackIndex
    ];

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

// TODO: Fix event listener leak here
const FileReader = (props) => {
  const { tracks } = useAudioManagerContext();
  const { fileReader, playlist: playlistCopy } = getLocalizedCopy();

  return (
    <Modal className="FileReader" header={fileReader.header}>
      <PlaylistWrapper>
        <PlaylistHeader>
          <div>{playlistCopy.number}</div>
          <div>{playlistCopy.title}</div>
          <div>{playlistCopy.artist}</div>
          <div>{playlistCopy.album}</div>
          <div />
        </PlaylistHeader>
        {/* TODO: Small font for playlist items */}
        <PlaylistEditor>
          <DragDropContext onDragEnd={onDragEnd}>
            <Droppable droppableId="droppable">
              {(provided) => (
                <div ref={provided.innerRef}>
                  {tracks.map(({ artist, album, title, id }, index) => {
                    // const currentPlaying =
                    //   isPlaying && item === tracks[currentTrackIndex];
                    const currentPlaying = false;

                    return (
                      <Draggable key={id} draggableId={id} index={index}>
                        {(draggableProvided, { isDragging }) => {
                          return (
                            <div
                              className={getDraggableClasses({
                                isDragging,
                                currentPlaying,
                              })}
                              ref={draggableProvided.innerRef}
                              {...draggableProvided.draggableProps}
                              {...draggableProvided.dragHandleProps}
                            >
                              <div>{currentPlaying ? "▱" : index + 1}</div>
                              <div>{title}</div>
                              <div>{artist}</div>
                              <div>{album}</div>
                              <button
                                className="icon-button"
                                onClick={() => props.removeTrack(index)}
                                type="button"
                              >
                                ▵
                              </button>
                            </div>
                          );
                        }}
                      </Draggable>
                    );
                  })}
                  {provided.placeholder}
                </div>
              )}
            </Droppable>
          </DragDropContext>
        </PlaylistEditor>
      </PlaylistWrapper>
      <EditorControlButtons>
        <button
          className="add-files"
          type="button"
          onClick={() => getDirectory()}
        >
          Add a directory
        </button>
        <button className="add-files" type="button" onClick={() => getTracks()}>
          Add file(s)
        </button>
      </EditorControlButtons>
      <PlaylistFooter>
        <button
          className="exit-button"
          type="button"
          onClick={props.toggleMenu}
        >
          Exit
        </button>
      </PlaylistFooter>
    </Modal>
  );
};

const EditorControlButtons = styled.div`
  margin-top: 2em;
  button {
    margin: 0 1em;
  }
`;

const PlaylistWrapper = styled.div`
  width: 100%;
  max-height: calc(var(--vh, 1vh) * 60);
  display: flex;
  flex-direction: column;
  align-items: center;
  border-radius: 3px;
  box-shadow: 0 0 0 2px rgba(53, 59, 101, 0.8),
    0 0 0 3.5px rgba(149, 149, 149, 0.8), 0 0 0 5px rgba(53, 59, 101, 0.8);
`;

const PlaylistFooter = styled.footer`
  margin-top: auto;
`;

const PlaylistHeader = styled.div`
  background-color: rgba(131, 23, 71, 0.65);
  border-bottom: 1px solid rgba(255, 255, 255, 0.25);

  width: 100%;
  display: flex;
  flex-direction: row;
  color: white;
  text-align: left;
  font-size: 42px;
  text-transform: capitalize;

  @media screen and (min-width: 500px) {
    padding: 14px 0 0;
  }

  div:nth-child(1) {
    width: 40px;
  }
  // Song
  div:nth-child(2) {
    width: 40%;
    max-width: 400px;
  }
  //Artist
  div:nth-child(3) {
    width: 25%;
    max-width: 200px;
  }
  // Album
  div:nth-child(4) {
    width: 25%;
    max-width: 200px;
  }
  div:nth-child(5) {
    width: 30px;
  }
`;

const selectedItemPulse = keyframes`
0% {
  background: rgba(255, 255, 255, 0.1);
}

50% {
  background: rgba(255, 255, 255, 0.25);
}

100% {
  background: rgba(255, 255, 255, 0.1);
}
`;

const PlaylistEditor = styled.div`
  background-color: rgba(131, 23, 71, 0.65);
  width: 100%;

  .draggable {
    * {
      user-select: none; /* Standard */
    }
    cursor: grab;
    border-radius: 2px;
    margin: 0 0 2px;
    display: flex;
    flex-direction: row;
    text-align: left;
    align-items: center;
    font-size: 10px;
    font-family: ChibiPhoebe;
    text-transform: uppercase;
    letter-spacing: 1px;
    font-size: 20px;

    @media screen and (min-width: 500px) {
      font-size: 26px;
      line-height: 14px;
      padding: 3px 0 3px;
      margin: 0;
    }
    p {
      margin: 0;
      padding: 0;
    }
    &:hover {
      animation: ${selectedItemPulse} 3s infinite;
    }
    &:active {
      cursor: grabbing !important;
    }
    &.isDragging {
      cursor: grabbing;
      border: 1px white;
      background: rgba(255, 255, 255, 0.5);
      border-radius: 2px;
    }
    // Handle
    div:nth-child(1) {
      width: 40px;
    }
    //Song
    div:nth-child(2) {
      width: 40%;
      max-width: 400px;
      overflow: hidden;
      white-space: pre;
      text-overflow: ellipsis;
    }
    //Artist
    div:nth-child(3) {
      width: 25%;
      max-width: 300px;
      overflow: hidden;
      white-space: pre;
      text-overflow: ellipsis;
    }
    // Album
    div:nth-child(4) {
      width: 25%;
      max-width: 300px;
      overflow: hidden;
      white-space: pre;
      text-overflow: ellipsis;
    }
    button {
      font-family: ChibiPhoebe;
      transition: all 200ms ease;
      color: white;
      background: none;
      border: 0;
      outline: 0;
      padding: 0;
      margin: 0 auto;
      line-height: inherit;
    }
  }
`;

FileReader.propTypes = {
  arrangeTracks: PropTypes.func.isRequired,
  addTracks: PropTypes.func.isRequired,
  removeTrack: PropTypes.func.isRequired,
  toggleMenu: PropTypes.func.isRequired,
};
export default FileReader;
