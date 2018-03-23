import React, { PureComponent } from 'react';
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
import buttonSrc from 'songs/button-press.mp3';

class Menu extends PureComponent {
  constructor(props) {
    super(props);
    autobind(this);
    this.buttonEffect = new Audio();
    this.buttonEffect.src = buttonSrc;
  }

  componentDidMount() {
    window.onkeydown = e => {
      e.preventDefault();
      if (e.keyCode === 32) {
        this.buttonClick(() => {});
      }
    };
  }

  buttonClick(callback) {
    this.buttonEffect.currentTime = 0;
    this.buttonEffect.play();
    callback();
  }

  render() {
    const { audioManager, repeat } = this.props;
    let repeatElement;
    if (repeat === 'track') {
      repeatElement = (
        <div>
          Repeat: <strong>1</strong> / All / Off
        </div>
      );
    } else if (repeat === 'context') {
      repeatElement = (
        <div>
          Repeat: 1 / <strong>All</strong> / Off
        </div>
      );
    } else {
      repeatElement = (
        <div>
          Repeat: 1 / All / <strong>Off</strong>
        </div>
      );
    }
    console.log('menu');
    return (
      <ul>
        <li>
          <Link to="source" className="gold disc">
            <img src={discIcon} alt="TODO" />
          </Link>
          <div className="tooltip">WELP</div>
        </li>
        <OrbButton
          buttonClick={this.buttonClick}
          className="gold"
          icon={moreIcon}
          tooltipText="System Settings"
        />
        <OrbButton
          buttonClick={this.buttonClick}
          className="gold"
          icon={visualizerIcon}
          tooltipText="Hide Controls"
        />
        <OrbButton
          buttonClick={this.buttonClick}
          className="middle rewind"
          icon={rwdIcon}
          callback={audioManager.previousTrack}
          tooltipText="Skip Backwards"
        />
        <OrbButton
          buttonClick={this.buttonClick}
          className="middle play-pause"
          icon={playPauseIcon}
          callback={audioManager.togglePlay}
          tooltipText="Play / Pause"
        />
        <OrbButton
          buttonClick={this.buttonClick}
          className="middle fast-forward"
          icon={ffwdIcon}
          tooltipText="Skip Forwards"
          callback={audioManager.nextTrack}
        />
        <OrbButton
          buttonClick={this.buttonClick}
          className="bottom repeat"
          icon={repeatIcon}
          callback={audioManager.toggleRepeat}
          tooltipText={repeatElement}
        />
        <OrbButton
          buttonClick={this.buttonClick}
          className="bottom stop"
          icon={stopIcon}
          callback={audioManager.stop}
          tooltipText="Stop"
        />
        <OrbButton
          buttonClick={this.buttonClick}
          className="bottom globe"
          tooltipText="Advanced Controls"
        />
      </ul>
    );
  }
}

export default Menu;
