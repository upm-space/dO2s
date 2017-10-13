import React from 'react';
import PropTypes from 'prop-types';
import $ from 'jquery';
import './FlightWidgets.scss';

const setAltitude1 = (altitude1) => {
  console.log(90 + (((altitude1 % 500) * 360) / 500));
  return (90 + (((altitude1 % 500) * 360) / 500));
};

const setAltitude2 = (altitude1) => {
  console.log((altitude1 / 500) * 360);
  return ((altitude1 / 500) * 360);
};

const WidjetAltimeter = ({ instSize, altitudeProp }) => (
  <div
    className="instrument"
    style={{
      height: `${instSize}vh`, width: `${instSize}vh`, maxHeight: ($(window).innerWidth() * 5) / 37, maxWidth: ($(window).innerWidth() * 5) / 37,
    }}
  >
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

WidjetAltimeter.propTypes = {
  instSize: PropTypes.string.isRequired,
  altitudeProp: PropTypes.number.isRequired,
};

export default WidjetAltimeter;
