import React from "react";
import PropTypes from "prop-types";
import styled from "styled-components";

import { Modal } from "./Modal";

const About = (props) => {
  return (
    <Modal header="About" className="About">
      <MainContent>
        <p>
          <em>
            Your scientists were so preoccupied with whether or not they could,
            they didn’t stop to think if they should.
          </em>
        </p>
        <ul>
          <SocialLink href="mailto:mcamis@gmail.com">
            mcamis@gmail.com
          </SocialLink>
          <SocialLink href="https://twitter.com/vmu_beep">
            https://twitter.com/vmu_beep
          </SocialLink>
          <SocialLink href="https://adam.mcamis.lol">
            https://adam.mcamis.lol
          </SocialLink>
          <SocialLink href="https://github.com/mcamis/saturn.fm">
            https://github.com/mcamis/saturn.fm
          </SocialLink>
        </ul>
      </MainContent>
      {/* TODO: Saturn style buttons */}
      <button className="close" type="button" onClick={props.toggleAbout}>
        Exit
      </button>
    </Modal>
  );
};

const SocialLink = (props) => {
  return (
    <li>
      <a href={props.href}>{props.children}</a>
    </li>
  );
};

const MainContent = styled.div`
  font-size: 16px !important;
  text-align: left;
  padding: 1em;
  line-height: 22px;

  box-shadow: 0 0 0 2px rgba(53, 59, 101, 0.8),
    0 0 0 3.5px rgba(149, 149, 149, 0.8), 0 0 0 5px rgba(53, 59, 101, 0.8);
  background-color: rgba(131, 23, 71, 0.65);
  border-bottom: 1px solid rgba(255, 255, 255, 0.25);
  em {
    margin: 0.5em;
    padding: 1em 1em 1em 2em;
    display: inline-block;
    border-left: 2px solid white;
  }
  a {
    text-decoration: none;
    color: #f2f2f2;
    margin-left: 0.5em;
  }
  ul {
    margin-top: 2em;
  }
  ul li {
    list-style-type: none;
    margin-bottom: 15px;
  }
`;

About.propTypes = {
  toggleAbout: PropTypes.func.isRequired,
};
export default About;
