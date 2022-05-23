/* eslint-disable react/jsx-props-no-spreading */
// Button.stories.js

import * as React from "react";
import { FileReaderUI } from "./FileReader";
import type { Track } from "../../audioManager";

const props = {
  tracks: [] as Track[],
  arrangeTracks: () => {},
  addTracks: () => {},
  removeTrack: () => {},
  toggleMenu: () => {},
  fileReaderCopy: {
    header: "Header",
  },
};

const Template = (args) => <FileReaderUI {...args} />;

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
