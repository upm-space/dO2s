import React from 'react';
import PropTypes from 'prop-types';
import { ButtonToolbar, ButtonGroup, Button } from 'react-bootstrap';
import { createContainer } from 'meteor/react-meteor-data';
import { Meteor } from 'meteor/meteor';
import { Bert } from 'meteor/themeteorchef:bert';
import { LinkContainer } from 'react-router-bootstrap';
import Missions from '../../../api/Missions/Missions';
import NotFound from '../NotFound/NotFound';
import Loading from '../../components/Loading/Loading';
// import MissionPlan from '../../components/MissionPlan/MissionPlan';
// import MissionFlight from '../../components/MissionFlight/MissionFlight';
// import MissionAnalysis from '../../components/MissionAnalysis/MissionAnalysis';

const handleRemove = (missionId, history, projectId) => {
  if (confirm('Move to Trash?')) {
    Meteor.call('missions.softDelete', missionId, (error) => {
      if (error) {
        Bert.alert(error.reason, 'danger');
      } else {
        Bert.alert('Mission deleted!', 'warning');
        history.push(`/projects/${projectId}`);
      }
    });
  }
};

const renderMission = (mission, match, history) => (mission && mission.deleted === 'no' ? (
  <div className="ViewMission">
    <div className="page-header clearfix">
      <h4 className="pull-left">{ mission && mission.name }</h4>
      <ButtonToolbar className="pull-right">
        <ButtonGroup bsSize="small">
          <Button>Purur</Button>
          <Button>
            Purr
          </Button>
        </ButtonGroup>
        <ButtonGroup bsSize="small">
          <Button onClick={() => history.push(`${match.url}/edit`)}>Edit</Button>
          <Button onClick={() => handleRemove(mission._id, history, mission.project)} className="text-danger">
            Delete
          </Button>
        </ButtonGroup>
      </ButtonToolbar>
    </div>

  </div>
) : <NotFound />);

const ViewMission = ({ loading, mission, match, history }) => (
  !loading ? renderMission(mission, match, history) : <Loading />
);

ViewMission.propTypes = {
  loading: PropTypes.bool.isRequired,
  mission: PropTypes.object,
  match: PropTypes.object.isRequired,
  history: PropTypes.object.isRequired,
};

export default createContainer(({ match }) => {
  const projectId = match.params.project_id;
  const missionId = match.params.mission_id;
  const subscription = Meteor.subscribe('missions.view', projectId, missionId);
  return {
    loading: !subscription.ready(),
    mission: Missions.findOne(missionId),
  };
}, ViewMission);
