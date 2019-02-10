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

  render() {
    // return (

    //         {this.props.audio.playlist.map(key => {
    //           return (
    //             <div>
    //             </div>
    //           );
    //         })}

    //       </div>
    //     </div>
    //   </div>
    // );

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
                      console.log(item);
                      const { artist, album, title } = this.props.audio.tracks[
                        item
                      ];

                      return (
                        <Draggable key={item} draggableId={item} index={index}>
                          {(provided, snapshot) => {
                            const className = `draggable ${
                              snapshot.isDragging ? 'isDragging' : ''
                            }`;
                            return (
                              <div
                                className={className}
                                ref={provided.innerRef}
                                {...provided.draggableProps}
                                {...provided.dragHandleProps}
                              >
                                <p className="artist">
                                  {`${artist} - ${title} -${album}`}
                                  <button
                                    onClick={() =>
                                      this.props.removeTrack(index)
                                    }
                                  >
                                    Remove
                                  </button>
                                </p>
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
            <button
              className="add-files"
              type="button"
              onClick={() => this.getTracks()}
            >
              Add a file
            </button>
            <button type="button" onClick={this.props.toggleMenu}>
              Close
            </button>
          </div>
        </div>
      </div>
    );
  }
}
export default FileReader;
