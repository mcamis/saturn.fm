import React from "react";

const OrbButton = ({
  buttonClick,
  callback,
  className,
  icon,
  tooltipText,
}: {
  buttonClick: (_: any) => void;
  callback: () => void;
  className: string;
  icon: string;
  tooltipText: string;
}) => (
  <li>
    <button
      className={className}
      onClick={() => buttonClick(callback)}
      type="button"
    >
      {icon && <img src={icon} alt="TODO" />}
    </button>
    <div className="tooltip">{tooltipText}</div>
  </li>
);

export default OrbButton;
