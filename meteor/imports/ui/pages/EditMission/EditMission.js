import React from 'react';
import PropTypes from 'prop-types';
import { withTracker } from 'meteor/react-meteor-data';
import { Meteor } from 'meteor/meteor';
import Missions from '../../../api/Missions/Missions';
import MissionEditor from '../../components/MissionEditor/MissionEditor';
import NotFound from '../NotFound/NotFound';

const EditMission = ({ mission, history, match }) => (mission ? (
  <div className="EditMission">
    <h4 className="page-header">{`Editing "${mission.name}"`}</h4>
    <MissionEditor mission={mission} history={history} match={match} />
  </div>
) : <NotFound />);

EditMission.defaultProps = {
  mission: {},
};

EditMission.propTypes = {
  mission: PropTypes.object,
  history: PropTypes.object.isRequired,
  match: PropTypes.object.isRequired,
};

export default withTracker(({ match }) => {
  const projectId = match.params.project_id;
  const missionId = match.params.mission_id;
  const subscription = Meteor.subscribe('missions.view', projectId, missionId);
  return {
    loading: !subscription.ready(),
    mission: Missions.findOne(missionId),
  };
})(EditMission);
