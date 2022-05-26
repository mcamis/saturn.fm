/* eslint-disable react/jsx-props-no-spreading */
import { styled } from "@linaria/react";
import * as React from "react";
import { DragDropContext, Droppable, Draggable } from "react-beautiful-dnd";

import { getLocalizedCopy } from "../../utilities/helpers";
import { Modal } from "../Modal";
import { useAudioManagerContext } from "../../audioManager";
import type { Track } from "../../audioManager";

import {
  getTracks,
  onDragEnd,
  getDirectory,
  getDraggableClasses,
} from "./FileReader.utils";

// TODO: Fix event listener leak here
function FileReader({ toggleMenu }: { toggleMenu: () => void }) {
  const { tracks } = useAudioManagerContext();
  const { fileReader: fileReaderCopy } = getLocalizedCopy();

  return (
    <FileReaderUI
      toggleMenu={toggleMenu}
      fileReaderCopy={fileReaderCopy}
      tracks={tracks}
    />
  );
}

export const FileReaderUI = ({
  toggleMenu,
  fileReaderCopy,
  tracks,
}: {
  toggleMenu: () => void;
  fileReaderCopy: any; // TODO copy types
  tracks: Track[];
}) => {
  return (
    <Modal header={fileReaderCopy.header}>
      <PlaylistWrapper>
        <PlaylistHeader />
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
                        {(draggableProvided, { isDragging }) => (
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
                              // onClick={() => props.removeTrack(index)}
                              type="button"
                            >
                              ▵
                            </button>
                          </div>
                        )}
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
        <SaturnButton
          className="add-files"
          type="button"
          onClick={() => getDirectory()}
        >
          Add a directory
        </SaturnButton>
        <SaturnButton
          className="add-files"
          type="button"
          onClick={() => getTracks()}
        >
          Add file(s)
        </SaturnButton>
      </EditorControlButtons>
      <PlaylistFooter>
        <SaturnButton type="button" onClick={toggleMenu}>
          Exit
        </SaturnButton>
      </PlaylistFooter>
    </Modal>
  );
};

const EditorControlButtons = styled.div`
  margin-top: 2em;
  display: grid;
  grid-column-gap: 2em;
  grid-template-columns: 1fr 1fr;
  width: 100%;

  button {
    margin: 0;
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
const PlaylistHeader = () => {
  const { playlist: playlistCopy } = getLocalizedCopy();

  return (
    <PlaylistHeaderWrapper>
      <div>{playlistCopy.number}</div>
      <div>{playlistCopy.title}</div>
      <div>{playlistCopy.artist}</div>
      <div>{playlistCopy.album}</div>
      <div />
    </PlaylistHeaderWrapper>
  );
};

const PlaylistHeaderWrapper = styled.div`
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
    font-size: 22px;
    display: flex;
    align-self: flex-end;
    justify-content: center;
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
      animation: selected-item-pulse 3s infinite;
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
      text-align: center;
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

  @keyframes selected-item-pulse {
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

const SaturnButton = styled.button`
  border-radius: 3px;
  box-shadow: 0 0 0 2px rgba(53, 59, 101, 0.8),
    0 0 0 3.5px rgba(149, 149, 149, 0.8), 0 0 0 5px rgba(53, 59, 101, 0.8);
  display: inline-block;
  margin: 0 auto;
  margin-top: auto;
  color: white;
  font-family: Phoebe;
  font-size: 36px;
  padding: 14px 14px 10px;
  background-color: rgba(93, 21, 122, 0.8);
  border: 0;
  cursor: pointer;
`;

// FileReader.propTypes = {
//   arrangeTracks: PropTypes.func.isRequired,
//   addTracks: PropTypes.func.isRequired,
//   removeTrack: PropTypes.func.isRequired,
//   toggleMenu: PropTypes.func.isRequired,
// };

export default FileReader;
