import React from "react";
import PropTypes from "prop-types";

// TODO: Fix event listener leak here
const About = props => {
  return (
    <div className="About">
      <div className="content">
        <h2>About</h2>
        <div className="playlists">
          <p>
            <em>
              Your scientists were so preoccupied with whether or not they
              could, they didn’t stop to think if they should.
            </em>
          </p>
          <p>
            Saturn.fm is a recreation of the Sega Saturn BIOS CD player
            interface built with Javascript.
          </p>
          <p>
            Development is ongoing: if you have any feedback, bug reports or
            suggestions please let me know!
          </p>
          <ul>
            <li>
              <span role="img" aria-label="icon">
                💌
              </span>{" "}
              <a href="mailto:mcamis@gmail.com">mcamis@gmail.com</a>
            </li>
            <li>
              <span role="img" aria-label="icon">
                🐦
              </span>{" "}
              <a href="https://twitter.com/vmu_beep">twitter.com/vmu_beep</a>
            </li>
            <li>
              <span role="img" aria-label="icon">
                👨🏻‍🚀
              </span>{" "}
              <a href="https://adam.mcamis.lol">adam.mcamis.lol</a>
            </li>
            <li>
              <span role="img" aria-label="icon">
                🐙
              </span>
              <a href="https://github.com/mcamis/saturn.fm">
                github.com/mcamis/saturn.fm
              </a>
            </li>
          </ul>
        </div>
        {/* TODO: Saturn style buttons */}
        <button type="button" onClick={props.toggleAbout}>
          Close
        </button>
      </div>
    </div>
  );
};

About.propTypes = {
  toggleAbout: PropTypes.func.isRequired
};
export default About;
