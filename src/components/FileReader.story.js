/* eslint-disable react/jsx-props-no-spreading */
// Button.stories.js

import React from "react";
import FileReader from "./FileReader";

import "../styles/index.scss";

const props = {
  audio: {
    tracks: defaultState.tracks,
    playlist: defaultState.playlist,
  },
  arrangeTracks: () => {},
  addTracks: () => {},
  removeTrack: () => {},
  toggleMenu: () => {},
};

const Template = (args) => <FileReader {...args} />;

export const FirstStory = Template.bind({});

FirstStory.args = {
  ...props,
  /* the args you need here will depend on your component */
};

// This default export determines where your story goes in the story list
export default {
  title: "FileReader",
  component: FileReader,
};
