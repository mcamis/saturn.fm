import React from 'react';
import PropTypes from 'prop-types';

const OrbButton = ({ icon, className, callback }) => (
  <li>
    <button className={className} onClick={() => callback()}>
      {icon && <img src={icon} alt="TODO" />}
    </button>
  </li>
);

OrbButton.defaultProps = {
  callback: () => {},
  className: '',
  icon: '',
};

OrbButton.propTypes = {
  icon: PropTypes.string,
  className: PropTypes.string,
  callback: PropTypes.func,
};
export default OrbButton;
