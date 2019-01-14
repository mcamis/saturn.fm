import React, { Component } from 'react';

import { playlists, filePicker } from 'utilities/helpers';

class FileReader extends Component {
  constructor(props) {
    super(props);
  }


  async addFiles() {
    const files = await filePicker('.mp3, .wav, .aac');
    this.props.audioManager.addToPlaylist(files);
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
                <div key={key}>
                  <p className="artist">{`${artist} - ${title} -${album}`}</p>
                </div>
              );
            })}

            <div className="add-files" onClick={() => this.addFiles()}>
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
