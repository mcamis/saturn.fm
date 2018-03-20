import React from 'react';
import PropTypes from 'prop-types';

const OrbButton = ({ icon, buttonClick, className, callback, tooltipText }) => (
  <li>
    <button className={className} onClick={() => buttonClick(callback)}>
      {icon && <img src={icon} alt="TODO" />}
    </button>
    <div className="tooltip">{tooltipText}</div>
  </li>
);

OrbButton.defaultProps = {
  callback: () => {},
  className: '',
  icon: '',
  tooltipText: '',
};

OrbButton.propTypes = {
  icon: PropTypes.string,
  className: PropTypes.string,
  callback: PropTypes.func,
};
export default OrbButton;
