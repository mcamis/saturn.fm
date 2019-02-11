import React, { Component } from 'react';
import { DragDropContext, Droppable, Draggable } from 'react-beautiful-dnd';
import { getFilesWithTags, reorder } from 'utilities/files';

const getListStyle = isDraggingOver => ({
  background: isDraggingOver ? '' : '',
});

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

    this.props.arrangeTracks(items);
  }

  async getTracks() {
    const tracks = await getFilesWithTags({ extensions: '.mp3, .wav, .aac' });
    this.props.addTracks(tracks);
  }

  async gedivirectory() {
    const tracks = await getFilesWithTags({
      extensions: '.mp3, .wav, .aac',
      allowDirectory: true,
    });

    this.props.addTracks(tracks);
  }

  render() {
    return (
      <div className="FileReader">
        <div className="content">
          <h2>Edit Playlist</h2>
          <div className="playlists">
            <DragDropContext onDragEnd={this.onDragEnd}>
              <Droppable droppableId="droppable">
                {(provided, snapshot) => (
                  <div
                    ref={provided.innerRef}
                    style={getListStyle(snapshot.isDraggingOver)}
                  >
                    {this.props.audio.playlist.map((item, index) => {
                      const { artist, album, title } = this.props.audio.tracks[
                        item
                      ];

                      return (
                        <Draggable key={item} draggableId={item} index={index}>
                          {(provided, snapshot) => {
                            const className = `draggable ${
                              snapshot.isDragging ? 'isDragging' : ''
                            } ${
                              this.props.audio.playing &&
                              item ===
                                this.props.audio.playlist[
                                  this.props.audio.currentTrack
                                ]
                                ? 'currentTrack'
                                : ''
                            }`;
                            return (
                              <div
                                className={className}
                                ref={provided.innerRef}
                                {...provided.draggableProps}
                                {...provided.dragHandleProps}
                              >
                                <div>{title}</div>
                                <div>{artist}</div>
                                <div>{album}</div>
                                <button
                                  onClick={() => this.props.removeTrack(index)}
                                >
                                  Remove
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
          <button
            className="add-files"
            type="button"
            onClick={() => this.gedivirectory()}
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
          <button type="button" onClick={this.props.toggleMenu}>
            Close
          </button>
        </div>
      </div>
    );
  }
}
export default FileReader;
