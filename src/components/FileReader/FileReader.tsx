/* eslint-disable react/jsx-props-no-spreading */
import * as React from "react";
import { DragDropContext, Droppable, Draggable } from "react-beautiful-dnd";

import { getLocalizedCopy } from "../../utilities/helpers";
import { Modal } from "../Modal";
import { useAudioManagerContext } from "../../audioManager";
import type { Track } from "../../audioManager";

import styles from "./FileReader.module.scss";

import {
  getTracks,
  onDragEnd,
  getDirectory,
  getDraggableClasses,
} from "./FileReader.utils";
import { createStyleRegistry } from "styled-jsx";

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
      <div className={styles.playlistWrapper}>
        <PlaylistHeader />
        {/* TODO: Small font for playlist items */}
        <div className={styles.playlistEditor}>
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
        </div>
      </div>
      <div className={styles.editorControlButtons}>
        <button className={styles.saturnButton} onClick={() => getDirectory()}>
          Add a directory
        </button>
        <button
          className={styles.saturnButton}
          type="button"
          onClick={() => getTracks()}
        >
          Add file(s)
        </button>
      </div>
      <div style={{ marginTop: "auto" }}>
        <button
          className={styles.saturnButton}
          type="button"
          onClick={toggleMenu}
        >
          Exit
        </button>
      </div>
    </Modal>
  );
};

const PlaylistHeader = () => {
  const { playlist: playlistCopy } = getLocalizedCopy();

  return (
    <div className={styles.playlistHeaderWrapper}>
      <div>{playlistCopy.number}</div>
      <div>{playlistCopy.title}</div>
      <div>{playlistCopy.artist}</div>
      <div>{playlistCopy.album}</div>
      <div />
    </div>
  );
};

export default FileReader;
