import * as React from "react";
import PropTypes from "prop-types";

import { Modal } from "./Modal";
import styles from "./About.module.scss";

const About = (props: { toggleAbout: () => void}) => {
  return (
    <Modal header="about">
      <div className={styles.wrapper}>
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
      </div>
      {/* TODO: Saturn style buttons */}
      <button type="button" onClick={props.toggleAbout}>
        Exit
      </button>
    </Modal>
  );
};

const SocialLink = (props: {href: string, children: string}) => {
  return (
    <li>
      <a href={props.href}>{props.children}</a>
    </li>
  );
};
About.propTypes = {
  toggleAbout: PropTypes.func.isRequired,
};
export default About;
