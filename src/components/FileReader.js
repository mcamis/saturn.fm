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
        <p>Professor Kliq -- Entertainment System</p>
        <p>Professor Kliq -- Entertainment System</p>
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
