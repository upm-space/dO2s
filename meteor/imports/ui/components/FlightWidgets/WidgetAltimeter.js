import React from 'react';
import PropTypes from 'prop-types';
import './FlightWidgets.scss';

const setAltitude1 = altitude1 => (90 + (((altitude1 % 500) * 360) / 500));

const setAltitude2 = altitude1 => ((altitude1 / 500) * 360);

const WidgetAltimeter = ({ altitudeProp }) => (
  <div className="instrument">
    <div>
      <img src="/img/svg/altitude_ticks.svg" alt="altitude_ticks" />
    </div>
    <div>
      <img src="/img/svg/fi_needle_small.svg" style={{ transform: `rotate(${setAltitude2(altitudeProp)}deg)` }} alt="fi_needle_small" />
    </div>
    <div>
      <img src="/img/svg/fi_needle.svg" style={{ transform: `rotate(${setAltitude1(altitudeProp)}deg)` }} alt="fi_needle" />
    </div>
    <div>
      <img src="/img/svg/fi_circle.svg" alt="fi_circle" />
    </div>
  </div>
);

WidgetAltimeter.propTypes = {
  altitudeProp: PropTypes.number.isRequired,
};

export default WidgetAltimeter;
