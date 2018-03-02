import React from 'react';
import PropTypes from 'prop-types';

const OrbButton = ({ icon, className, callback }) => (
  <li>
    <button className={className} onClick={() => callback()}>
      <img src={icon} alt="TODO" />
    </button>
  </li>
);

OrbButton.defaultProps = {
  callback: () => {},
  className: '',
};

OrbButton.propTypes = {
  icon: PropTypes.element.isRequired,
  className: PropTypes.string,
  callback: PropTypes.func
}
export default OrbButton;
