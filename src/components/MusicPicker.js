import React, { Component } from 'react';
import PropTypes from 'prop-types';

import autobind from 'utilities/autobind';

class MusicPicker extends Component {
  constructor(props) {
    super(props);
    autobind(this);
  }

  render() {
    return <p>Hello!</p>;
  }
}

export default MusicPicker;
