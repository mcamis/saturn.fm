import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import fastforward from 'images/text/fastforward.png';
import advance from 'images/text/advanced.png';
import hide from 'images/text/hide.png';
import stop from 'images/text/stop.png';
import rewind from 'images/text/rewind.png';

const getTooltipSrc = props => {
  // const { playing, paused, repeat } = props;

  const tooltips = {
    disc: fastforward,
    settings: fastforward,
    hide,
    rewind,
    fastforward,
    play: fastforward,
    //   let playElement = <p className={className}>Play / Pause</p>;
    //   if (playing) {
    //     playElement = (
    //       <p className={className}>
    //         <strong>Play</strong>/ Pause
    //       </p>
    //     );
    //   } else if (paused) {
    //     playElement = (
    //       <p className={className}>
    //         Play / <strong>Pause</strong>
    //       </p>
    //     );
    //   }
    //   return playElement;
    // },
    repeat: fastforward,
    //   let repeatElement = (
    //     <p className={className}>
    //       Repeat: 1 / All / <strong>Off</strong>
    //     </p>
    //   );
    //   if (repeat === 'track') {
    //     repeatElement = (
    //       <p className={className}>
    //         Repeat: <strong>1</strong> / All / Off
    //       </p>
    //     );
    //   } else if (repeat === 'context') {
    //     repeatElement = (
    //       <p className={className}>
    //         Repeat: 1 / <strong>All</strong> / Off
    //       </p>
    //     );
    //   }
    //   return repeatElement;
    // },
    stop,
    advanced: advance,
  };

  return tooltips[props.activeButton];
};

const Tooltip = props => {
  return (
    <div className="tooltips">
      <img src={getTooltipSrc(props)} />
    </div>
  );
};

Tooltip.propTypes = {
  activeButton: PropTypes.string.isRequired,
};

export default Tooltip;
