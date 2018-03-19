import React, { Component } from 'react';
import PropTypes from 'prop-types';

import StarField from 'components/StarField';
import Cubes from 'components/Cubes';
import SpotifyMenu from 'components/SpotifyMenu';
import SpotifyPlayer from 'utilities/spotifyPlayer';
import SpotifyAuth from 'components/SpotifyAuth';

import timeSrc from 'images/time.png';
import trackSrc from 'images/track.png';
import autobind from 'utilities/autobind';

class Spotify extends Component {
  constructor(props) {
    super(props);
    this.state = {
      volumeLeft: 1,
      volumeRight: 1,
      currentTime: 0,
    };
    this.spotifyPlayer = new SpotifyPlayer(this.props.push);

    autobind(this);
  }

  getInfo() {
    this.spotifyPlayer.getStats();
  }

  // TODO: "Waiting for track"
  render() {
    const { currentTime, volumeLeft, volumeRight } = this.state;
    return (
      <div>
        <header>
          <div className="info">
            <div className="track">
              <img src={trackSrc} />
            </div>
            <div className="time">
              <img src={timeSrc} />
            </div>
            <div className="timer">{currentTime}</div>
          </div>
          <div className="knight-rider" />
        </header>
        <SpotifyMenu
          getInfo={() => this.getInfo()}
          togglePlay={() => this.spotifyPlayer.togglePlay()}
          skipForwards={() => this.spotifyPlayer.skipForwards()}
          skipBackwards={() => this.spotifyPlayer.skipBackwards()}
          repeat={() => this.spotifyPlayer.toggleRepeat()}
          stop={() => this.spotifyPlayer.stop()}
        />
        <div className="dashboard" />
        <Cubes volumeLeft={volumeLeft} volumeRight={volumeRight} />
        <StarField />
      </div>
    );
  }
}

export default Spotify;
