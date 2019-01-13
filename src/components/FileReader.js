import React, { Component } from 'react';

import { playlists, filePicker } from 'utilities/helpers';

class FileReader extends Component {
  constructor(props) {
    super(props);
    this.handleChange = this.handleChange.bind(this);
  }

  handleChange() {
    console.log(this.fileInput.files); // eslint-disable-line no-console
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
            {this.props.audioManager.playlist.map((track, i) => {
              return (
                <div key={track} onClick={() => {}}>
                  <p className="artist">{track}</p>
                </div>
              );
            })}

            <div className="add-files" onClick={() => this.addFiles()}>
              Add a file{' '}
            </div>
            <button onClick={this.props.toggleMenu}>Close</button>
          </div>
        </div>
      </div>
    );
  }
}
export default FileReader;
