import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { DragDropContext, Droppable, Draggable } from 'react-beautiful-dnd';
import SpeakerIcon from './SpeakerIcon';
import TrashIcon from './TrashIcon';

// TODO: Fix event listener leak here
const About = props => {

    return (
      <div className="About">
        <div className="content">
          <h2>About</h2>
          <div className="playlists">
            <p>Cool stuff here</p>
          </div>
          <button type="button" onClick={props.toggleAbout}>
            Close
          </button>
        </div>
      </div>
    );
  };

About.propTypes = {
  toggleAbout: PropTypes.func.isRequired,
};
export default About;
