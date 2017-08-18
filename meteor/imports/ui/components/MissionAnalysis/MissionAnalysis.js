import React from 'react';
import PropTypes from 'prop-types';

const MissionAnalysis = ({ mission }) => (
  <div>
    <h1>MissionAnalysis</h1>
    <p>{JSON.stringify(mission)}</p>
  </div>
);

MissionAnalysis.propTypes = {
  mission: PropTypes.object.isRequired,
};


export default MissionAnalysis;
