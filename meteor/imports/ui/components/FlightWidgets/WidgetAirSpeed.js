import React from 'react';
import $ from 'jquery';
import PropTypes from 'prop-types';
import './FlightWidgets.scss';

const draw = (speed) => {
  const airspeedBoundL = 0;
  const airspeedBoundH = 160;
  let newSpeed = speed;

  if (newSpeed > airspeedBoundH) {
    newSpeed = airspeedBoundH;
  } else if (newSpeed < airspeedBoundL) {
    newSpeed = airspeedBoundL;
  }
  newSpeed = 90 + (newSpeed * 10);
  return `${newSpeed.toString()}deg`;
};

const WidgetAirSpeed = ({ instSize, speedProp }) => (
  <div
    className="instrument"
    style={{
      height: `${instSize}vh`, width: `${instSize}vh`, maxHeight: ($(window).innerWidth() * 5) / 37, maxWidth: ($(window).innerWidth() * 5) / 37,
    }}
  >
    <div>
      <img src="/img/svg/speed_mechanics.svg" alt="speed_mechanics" />
    </div>
    <div>
      <img id="speedControl" src="/img/svg/fi_needle.svg" style={{ transform: `rotate(${draw(speedProp)})` }} alt="fi_needle" />
    </div>
    <div>
      <img src="/img/svg/fi_circle.svg" alt="fi_circle" />
    </div>
  </div>
);


WidgetAirSpeed.propTypes = {
  instSize: PropTypes.string.isRequired,
  speedProp: PropTypes.number.isRequired,
};


export default WidgetAirSpeed;
