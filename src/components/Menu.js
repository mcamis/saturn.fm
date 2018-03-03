import React, { Component } from 'react';
import PropTypes from 'prop-types';

import spotifyIcon from 'images/spotify.png';
import playPauseIcon from 'images/play-pause.png';
import ffwdIcon from 'images/ffwd.png';
import rwdIcon from 'images/rwd.png';
import stopIcon from 'images/stop.png';
import repeatIcon from 'images/repeat.png';
import visualizerIcon from 'images/visualizer.png';

import OrbButton from 'components/OrbButton';

const Menu = () => (
  <ul>
    <OrbButton className="gold" icon={spotifyIcon} />
    <OrbButton className="gold" icon={spotifyIcon} />
    <OrbButton className="gold" icon={visualizerIcon} />
    <OrbButton className="middle rewind" icon={rwdIcon} />
    <OrbButton className="middle play-pause" icon={playPauseIcon} />
    <OrbButton className="middle fast-forward" icon={ffwdIcon} />
    <OrbButton className="bottom repeat" icon={repeatIcon} />
    <OrbButton className="bottom stop" icon={stopIcon} />
    <OrbButton className="bottom globe" />
  </ul>
);

export default Menu;
