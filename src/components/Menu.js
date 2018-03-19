import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { Link } from 'react-router-dom';

import discIcon from 'images/disc.png';
import playPauseIcon from 'images/play-pause.png';
import ffwdIcon from 'images/ffwd.png';
import moreIcon from 'images/more.png';

import rwdIcon from 'images/rwd.png';
import stopIcon from 'images/stop.png';
import repeatIcon from 'images/repeat.png';
import visualizerIcon from 'images/visualizer.png';

import autobind from 'utilities/autobind';
import OrbButton from 'components/OrbButton';

class Menu extends Component {
  constructor(props) {
    super(props);
    autobind(this);
  }

  render() {
    const { audioManager } = this.props;
    return (
      <ul>
        <li>
          <Link to="source" className="gold disc">
            <img src={discIcon} alt="TODO" />
          </Link>
          <div className="tooltip">WELP</div>
        </li>
        <OrbButton
          className="gold"
          icon={moreIcon}
          tooltipText="System Settings"
        />
        <OrbButton
          className="gold"
          icon={visualizerIcon}
          tooltipText="Hide Controls"
        />
        <OrbButton
          className="middle rewind"
          icon={rwdIcon}
          callback={audioManager.previousTrack}
          tooltipText="Skip Backwards"
        />
        <OrbButton
          className="middle play-pause"
          icon={playPauseIcon}
          callback={audioManager.togglePlay}
          tooltipText="Play / Pause"
        />
        <OrbButton
          className="middle fast-forward"
          icon={ffwdIcon}
          tooltipText="Skip Forwards"
          callback={audioManager.nextTrack}
        />
        <OrbButton
          className="bottom repeat"
          icon={repeatIcon}
          callback={audioManager.toggleRepeat}
          tooltipText="Repeat: 1 / All / Off"
        />
        <OrbButton
          className="bottom stop"
          icon={stopIcon}
          callback={this.stop}
          tooltipText="Stop"
        />
        <OrbButton className="bottom globe" tooltipText="Advanced Controls" />
      </ul>
    );
  }
}

export default Menu;
