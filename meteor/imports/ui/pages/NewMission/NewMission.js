import React from 'react';
import PropTypes from 'prop-types';
import MissionEditor from '../../components/MissionEditor/MissionEditor';

const NewMission = ({ history, match }) => (
  <div className="NewMission">
    <h4 className="page-header">New Mission</h4>
    <MissionEditor history={history} match={match} />
  </div>
);

NewMission.propTypes = {
  history: PropTypes.object.isRequired,
  match: PropTypes.object.isRequired,
};

export default NewMission;
