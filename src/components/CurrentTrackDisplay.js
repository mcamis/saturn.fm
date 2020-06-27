import React from "react";
import PropTypes from "prop-types";

const CurrentTrackDisplay = ({ href, artist, title }) => {
  // album: "Entertainment System"
  // artist: "Professor Kliq"
  // file: "/7387f2263f3d4d909b3757f066da5ed9.mp3"
  // title: "No Refuge"
  // track: 1
  return (
    <div className="current-track-info nice" key={title + artist}>
      <p>
        {title} {artist && <>- {artist}</>}
      </p>
      {href && (
        <p>
          <a href={href} target="blank">
            {href}
          </a>
        </p>
      )}
    </div>
  );
};
CurrentTrackDisplay.propTypes = {
  href: PropTypes.string,
  artist: PropTypes.string.isRequired,
  title: PropTypes.string.isRequired,
};

CurrentTrackDisplay.defaultProps = {
  href: "",
};

export default CurrentTrackDisplay;
