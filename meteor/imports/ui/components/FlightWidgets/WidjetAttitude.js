import React from 'react';
import PropTypes from 'prop-types';
import $ from 'jquery';
import './FlightWidgets.scss';

const drawPtich = (pitch) => {
  let newPitch = pitch;
  const pitchBound = 25;
  if (newPitch > pitchBound) {
    newPitch = pitchBound;
  } else if (newPitch < -pitchBound) {
    newPitch = -pitchBound;
  }
  newPitch *= 0.7;
  return newPitch;
};

const WidjetAttitude = ({ instSize, pitchProp, rollProp }) => (
  <div
    className="instrument"
    style={{
      height: `${instSize}vh`, width: `${instSize}vh`, maxHeight: ($(window).innerWidth() * 5) / 37, maxWidth: ($(window).innerWidth() * 5) / 37,
    }}
  >
    <div>
      <img alt="horizon_back" src="/img/svg/horizon_back.svg" />
    </div>
    <div>
      <img
        alt="horizon_ball"
        src="/img/svg/horizon_ball.svg"
        style={{ top: `${drawPtich(pitchProp)}%`, transform: `rotate(${rollProp}deg)` }}
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


WidjetAttitude.propTypes = {
  instSize: PropTypes.string.isRequired,
  pitchProp: PropTypes.number.isRequired,
  rollProp: PropTypes.number.isRequired,
};

export default WidjetAttitude;
