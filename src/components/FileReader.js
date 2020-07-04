import React, { Component } from "react";
import PropTypes from "prop-types";
import { DragDropContext, Droppable, Draggable } from "react-beautiful-dnd";
import { getFilesWithTags, reorder } from "utilities/files";
import SpeakerIcon from "./SpeakerIcon";
import TrashIcon from "./TrashIcon";

import { getI11yCopy } from "utilities/helpers";

const getDraggableClasses = ({ isDragging, currentPlaying }) => {
  return `draggable ${isDragging ? "isDragging" : ""} ${
    currentPlaying ? "currentTrack" : ""
  }`;
};

// TODO: Fix event listener leak here
class FileReader extends Component {
  constructor(props) {
    super(props);
    this.onDragEnd = this.onDragEnd.bind(this);
  }

  onDragEnd(result) {
    // dropped outside the list
    if (!result.destination) {
      return;
    }

    const items = reorder(
      this.props.audio.playlist,
      result.source.index,
      result.destination.index
    );
    this.props.setCurrentTrack(result.destination.index);
    this.props.arrangeTracks(items);
  }

  async getTracks() {
    const tracks = await getFilesWithTags({
      extensions: ".mp3, .m4a, .flac, .wav, .aac",
    });
    this.props.addTracks(tracks);
  }

  async getDirectory() {
    const tracks = await getFilesWithTags({
      extensions: ".mp3, .wav, .aac",
      allowDirectory: true,
    });

    this.props.addTracks(tracks);
  }

  render() {
    const {
      audio: { currentTrack, playing, playlist, tracks },
    } = this.props;

    const copy = getI11yCopy();

    return (
      <div className="overlay">
        <div className="FileReader">
          <div className="content">
            <h2>{copy.disc}</h2>
            <div className="playlist-wrapper">
              <div className="playlist-header">
                <div>No.</div>
                <div>Title</div>
                <div>Artist</div>
                <div>Album</div>
                <div></div>
              </div>
              {/* TODO: Small font for playlist items */}
              <div className="playlists">
                <DragDropContext onDragEnd={this.onDragEnd}>
                  <Droppable droppableId="droppable">
                    {(provided) => (
                      <div ref={provided.innerRef}>
                        {playlist.map((item, index) => {
                          const { artist, album, title } = tracks[item];
                          const currentPlaying =
                            playing && item === playlist[currentTrack];

                          return (
                            <Draggable
                              key={item}
                              draggableId={item}
                              index={index}
                            >
                              {(draggableProvided, { isDragging }) => {
                                return (
                                  <div
                                    className="draggable"
                                    className={getDraggableClasses({
                                      isDragging,
                                      currentPlaying,
                                    })}
                                    ref={draggableProvided.innerRef}
                                    {...draggableProvided.draggableProps}
                                    {...draggableProvided.dragHandleProps}
                                  >
                                    <div>
                                      {currentPlaying ? "▱" : index + 1}
                                    </div>
                                    <div>{title}</div>
                                    <div>{artist}</div>
                                    <div>{album}</div>
                                    <button
                                      className="icon-button"
                                      // TODO: Prompt on delete?
                                      onClick={() =>
                                        this.props.removeTrack(index)
                                      }
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
              </div>
              <div className="memory-wrapper">
                Memory available:{" "}
                <div>
                  {performance.memory
                    ? performance.memory.jsHeapSizeLimit -
                      performance.memory.usedJSHeapSize
                    : ""}
                </div>
              </div>
            </div>
            <button
              className="add-files"
              type="button"
              onClick={() => this.getDirectory()}
            >
              Add a directory
            </button>
            <button
              className="add-files"
              type="button"
              onClick={() => this.getTracks()}
            >
              Add file(s)
            </button>
            <button
              className="exit"
              type="button"
              onClick={this.props.toggleMenu}
            >
              Exit
            </button>
          </div>
        </div>
      </div>
    );
  }
}

FileReader.propTypes = {
  audio: PropTypes.shape({
    tracks: PropTypes.object.isRequired,
    playlist: PropTypes.array.isRequired,
  }).isRequired,
  arrangeTracks: PropTypes.func.isRequired,
  addTracks: PropTypes.func.isRequired,
  removeTrack: PropTypes.func.isRequired,
  toggleMenu: PropTypes.func.isRequired,
};
export default FileReader;
