import React from 'react';
import PropTypes from 'prop-types';
import './FlightWidgets.scss';

const drawPitch = (pitch) => {
  let newPitch = pitch;
  const pitchBound = 30;
  if (newPitch > pitchBound) {
    newPitch = pitchBound;
  } else if (newPitch < -pitchBound) {
    newPitch = -pitchBound;
  }
  newPitch *= 0.7;
  return newPitch;
};

const WidgetAttitude = ({ pitchProp, rollProp }) => (
  <div className="instrument">
    <div>
      <img alt="horizon_back" src="/img/svg/horizon_back.svg" />
    </div>
    <div style={{ transform: `rotate(${rollProp}deg)` }}>
      <img
        alt="horizon_ball"
        src="/img/svg/horizon_ball.svg"
        style={{ top: `${drawPitch(pitchProp)}%` }}
      />
    </div>
    <div>
      <img alt="horizon_circle" src="/img/svg/horizon_circle.svg" style={{ transform: `rotate(${rollProp}deg)` }} />
    </div>
    <div>
      <img src="/img/svg/horizon_mechanics.svg" alt="horizon_mechanics" />
      <img src="/img/svg/fi_circle.svg" alt="fi_circle" />
    </div>
  </div>
);


WidgetAttitude.propTypes = {
  pitchProp: PropTypes.number.isRequired,
  rollProp: PropTypes.number.isRequired,
};

export default WidgetAttitude;
