import React, { Component } from 'react';

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
        <input
          type="file"
          onChange={() => this.handleChange()}
          ref={input => {
            this.fileInput = input;
          }}
          multiple
        />
      </div>
    );
  }
}
export default FileReader;
