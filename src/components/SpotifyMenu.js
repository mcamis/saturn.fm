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

class SpotifyMenu extends Component {
  constructor(props) {
    super(props);
    autobind(this);
  }

  // playOrPause() {
  //   const { paused } = this.props;
  //   console.log(this.props);
  //   if (paused) {
  //     this.props.play();
  //   } else {
  //     this.props.pause();
  //   }
  // }

  //   rewind() {
  //     const { audio } = this.props;
  //     audio.currentTime = 0;
  //   }

  //   stop() {
  //     const { audio } = this.props;
  //     audio.pause();
  //     audio.currentTime = 0;
  //   }

  //   toggleRepeat() {
  //     const { audio } = this.props;
  //     const loopEnabled = audio.loop;
  //     audio.loop = !loopEnabled;
  //   }

  render() {
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
          callback={this.props.getInfo}
        />
        <OrbButton
          className="middle rewind"
          icon={rwdIcon}
          callback={this.props.skipBackwards}
          tooltipText="Skip Backwards"
        />
        <OrbButton
          className="middle play-pause"
          icon={playPauseIcon}
          callback={this.props.togglePlay}
          tooltipText="Play / Pause"
        />
        <OrbButton
          className="middle fast-forward"
          icon={ffwdIcon}
          callback={this.props.skipForwards}
          tooltipText="Skip Forwards"
        />
        <OrbButton
          className="bottom repeat"
          icon={repeatIcon}
          callback={this.props.repeat}
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

export default SpotifyMenu;
