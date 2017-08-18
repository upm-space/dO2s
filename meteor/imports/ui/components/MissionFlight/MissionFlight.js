import React from 'react';
import PropTypes from 'prop-types';

const MissionFlight = ({ mission }) => (
  <div>
    <h1>MissionFlight</h1>
    <p>{JSON.stringify(mission)}</p>
  </div>
);

MissionFlight.propTypes = {
  mission: PropTypes.object.isRequired,
};

export default MissionFlight;
