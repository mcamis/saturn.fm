import React, { Component } from 'react';
import PropTypes from 'prop-types';

import autobind from 'utilities/autobind';

class SourcePicker extends Component {
  constructor(props) {
    super(props);
    autobind(this);
  }

  render() {
    const { sourceSelection } = this.props;
    return (
      <section className="source-picker">
        <p>Hello!</p>
        <div className="option">
          <h2>Playlist</h2>
          <img src="" />
          <p>{`I made a mixtape just for you <3`}</p>
          <button>Select</button>
        </div>
        <div className="option">
          <h2>Spotify</h2>
          <img src="" />
          <p>Choice copy</p>
          <button>Select</button>
        </div>
        <div className="option">
          <h2>Device</h2>
          <img src="" />
          <p>Choice copy</p>
          <button>Select</button>
        </div>
      </section>
    );
  }
}

export default SourcePicker;
