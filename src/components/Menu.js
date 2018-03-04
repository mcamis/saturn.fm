import React, { Component } from 'react';
import PropTypes from 'prop-types';

import spotifyIcon from 'images/spotify.png';
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

  playOrPause() {
    const { audio, audioContext } = this.props;
    if (audio.paused || audio.ended) {
      // iOS will auto-suspend AudioContext
      // TODO: make this resume more intelligent
      audioContext.resume();
      audio.play();
    } else {
      audio.pause();
    }
  }

  rewind() {
    const { audio } = this.props;
    audio.currentTime = 0;
  }

  stop() {
    const { audio } = this.props;
    audio.pause();
    audio.currentTime = 0;
  }

  toggleRepeat() {
    const { audio } = this.props;
    const loopEnabled = audio.loop;
    audio.loop = !loopEnabled;
  }

  render() {
    return (
      <ul>
        <OrbButton className="gold" icon={spotifyIcon} />
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
          callback={this.rewind}
          tooltipText="Skip Backwards"
        />
        <OrbButton
          className="middle play-pause"
          icon={playPauseIcon}
          callback={this.playOrPause}
          tooltipText="Play / Pause"
        />
        <OrbButton
          className="middle fast-forward"
          icon={ffwdIcon}
          tooltipText="Skip Forwards"
        />
        <OrbButton
          className="bottom repeat"
          icon={repeatIcon}
          callback={this.toggleRepeat}
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
