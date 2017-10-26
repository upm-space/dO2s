import React from 'react';
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

const WidgetAirSpeed = ({ speedProp }) => (
  <div className="instrument">
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
  speedProp: PropTypes.number.isRequired,
};


export default WidgetAirSpeed;
