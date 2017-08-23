import React from 'react';
import PropTypes from 'prop-types';

const MissionPlan = ({ mission }) => (
  <div>
    <h1>MissionPlan</h1>
    <p>{JSON.stringify(mission)}</p>
  </div>
);

MissionPlan.propTypes = {
  mission: PropTypes.object.isRequired,
};

export default MissionPlan;
