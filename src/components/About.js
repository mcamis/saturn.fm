import React from "react";
import PropTypes from "prop-types";

import { ModalHeader } from "./ModalHeader";

// TODO: Fix event listener leak here
const About = (props) => {
  return (
    <div className="About">
      <div className="content">
        <ModalHeader>About</ModalHeader>
        <div className="playlists">
          <p>
            <em>
              Your scientists were so preoccupied with whether or not they
              could, they didn’t stop to think if they should.
            </em>
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
        <button className="close" type="button" onClick={props.toggleAbout}>
          Exit
        </button>
      </div>
    </div>
  );
};

About.propTypes = {
  toggleAbout: PropTypes.func.isRequired,
};
export default About;
