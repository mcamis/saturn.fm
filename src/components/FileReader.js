import React, { Component } from 'react';

import { playlists } from 'utilities/helpers';

class FileReader extends Component {
  constructor(props) {
    super(props);
    this.handleChange = this.handleChange.bind(this);
  }

  handleChange() {
    console.log(this.fileInput.files); // eslint-disable-line no-console
  }

  render() {
    return (
      <div className="FileReader">
        {playlists.map(playlist => {
          return (
            <p
              onClick={() =>
                this.props.audioManager.setPlaylist(playlist.tracks)
              }
            >
              {playlist.name}
            </p>
          );
        })}
        <input
          type="file"
          onChange={() => this.handleChange()}
          ref={input => {
            this.fileInput = input;
          }}
          multiple
        />
        <button onClick={this.props.toggleMenu}>Close</button>
      </div>
    );
  }
}
export default FileReader;
