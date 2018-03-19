import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { Link } from 'react-router-dom';

import autobind from 'utilities/autobind';

class SourcePicker extends Component {
  constructor(props) {
    super(props);
    autobind(this);
  }

  setSourceAndRedirect(source) {
    this.props.setSource(source);
    this.props.history.push('/');
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
          <button onClick={() => this.setSourceAndRedirect('web')}>
            Select
          </button>
        </div>
        <div className="option">
          <h2>
            Spotify Connect <label>BETA</label>
          </h2>
          <img src="" />
          <p>Choice copy</p>
          <button onClick={() => this.setSourceAndRedirect('spotify')}>
            Select
          </button>
        </div>
      </section>
    );
  }
}

export default SourcePicker;
