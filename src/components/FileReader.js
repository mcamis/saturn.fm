import React, { Component } from 'react';
import { getFilesWithTags } from 'utilities/files';

class FileReader extends Component {
  async getTracks() {
    const tracks = await getFilesWithTags({ extensions: '.mp3, .wav, .aac' });
    this.props.addTracks(tracks);
  }

  render() {
    return (
      <div className="FileReader">
        <div className="content">
          <h2>Edit Playlist</h2>
          <div className="playlists">
            {this.props.audio.playlist.map(key => {
              const { artist, album, title } = this.props.audio.tracks[key];
              return (
                <div>
                  <p className="artist">{`${artist} - ${title} -${album}`}</p>
                </div>
              );
            })}

            <div className="add-files" onClick={() => this.getTracks()}>
              Add a file
            </div>
            <button onClick={this.props.toggleMenu}>Close</button>
          </div>
        </div>
      </div>
    );
  }
}
export default FileReader;
