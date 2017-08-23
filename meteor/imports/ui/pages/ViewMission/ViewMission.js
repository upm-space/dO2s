import React from 'react';
import PropTypes from 'prop-types';
import { ButtonToolbar, ButtonGroup, Button, NavItem, Nav } from 'react-bootstrap';
import { createContainer } from 'meteor/react-meteor-data';
import { Meteor } from 'meteor/meteor';
import { Bert } from 'meteor/themeteorchef:bert';
import { LinkContainer } from 'react-router-bootstrap';
import { Redirect } from 'react-router-dom';
import Missions from '../../../api/Missions/Missions';
import NotFound from '../NotFound/NotFound';
import Loading from '../../components/Loading/Loading';
import MissionPlan from '../../components/MissionPlan/MissionPlan';
import MissionFlight from '../../components/MissionFlight/MissionFlight';
import MissionAnalysis from '../../components/MissionAnalysis/MissionAnalysis';

import './ViewMission.scss';

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

const handleMissionNav = (match, mission) => {
  if (match.path === '/projects/:project_id/:mission_id/plan') {
    return <MissionPlan mission={mission} />;
  } else if (match.path === '/projects/:project_id/:mission_id/flight') {
    return <MissionFlight mission={mission} />;
  } else if (match.path === '/projects/:project_id/:mission_id/analysis') {
    return <MissionAnalysis mission={mission} />;
  } else if (match.path === '/projects/:project_id/:mission_id') {
    return <Redirect to={`/projects/${match.params.project_id}/${match.params.mission_id}/plan`} />;
  }
  return <NotFound />;
};


const renderMission = (mission, match, history) => (mission && mission.deleted === 'no' ? (
  <div className="ViewMission">
    <div className="page-header clearfix">
      <h4 className="pull-left">{ mission && mission.name }</h4>
      <div className="mission-nav">
        <div className="mission-nav-buttons">
          <Nav bsStyle="pills" activeKey={1}>
            <LinkContainer to={`/projects/${match.params.project_id}/${match.params.mission_id}/plan`}>
              <NavItem eventKey={1} href={`/projects/${match.params.project_id}/${match.params.mission_id}/plan`}>Plan</NavItem>
            </LinkContainer>
            <LinkContainer to={`/projects/${match.params.project_id}/${match.params.mission_id}/flight`}>
              <NavItem eventKey={2} title={`/projects/${match.params.project_id}/${match.params.mission_id}/flight`}>Flight</NavItem>
            </LinkContainer>
            <LinkContainer to={`/projects/${match.params.project_id}/${match.params.mission_id}/analysis`}>
              <NavItem eventKey={3} href={`/projects/${match.params.project_id}/${match.params.mission_id}/analysis`}>Analysis</NavItem>
            </LinkContainer>
          </Nav>
        </div>
        <div className="mission-buttons">
          <ButtonToolbar>
            <ButtonGroup bsSize="small">
              <Button onClick={() => history.push(`/projects/${match.params.project_id}/${match.params.mission_id}/edit`)}>Edit</Button>
              <Button
                onClick={() => handleRemove(mission._id, history, mission.project)}
                className="text-danger"
              >
                Delete
              </Button>
            </ButtonGroup>
          </ButtonToolbar>
        </div>
      </div>
    </div>
    {handleMissionNav(match, mission)}
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
