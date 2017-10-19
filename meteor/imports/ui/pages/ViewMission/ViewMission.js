import React from 'react';
import PropTypes from 'prop-types';
import { ButtonToolbar, ButtonGroup, Button, NavItem, Nav } from 'react-bootstrap';
import { withTracker } from 'meteor/react-meteor-data';
import { Meteor } from 'meteor/meteor';
import { Bert } from 'meteor/themeteorchef:bert';
import { LinkContainer } from 'react-router-bootstrap';
import { Route, Switch } from 'react-router-dom';
import Missions from '../../../api/Missions/Missions';
import Projects from '../../../api/Projects/Projects';
import NotFound from '../NotFound/NotFound';
import Loading from '../../components/Loading/Loading';
import MissionPlan from '../../components/MissionPlan/MissionPlan';
import MissionFlight from '../../components/MissionFlight/MissionFlight';
import MissionAnalysis from '../../components/MissionAnalysis/MissionAnalysis';

import './ViewMission.scss';

const handleRemove = (missionId, history, projectId) => {
  Meteor.call('missions.softDelete', missionId, (error) => {
    if (error) {
      Bert.alert(error.reason, 'danger');
    } else {
      Bert.alert('Mission deleted!', 'warning');
      history.push(`/projects/${projectId}`);
    }
  });
};

const renderMission = (mission, match, history, project) => (mission && mission.deleted === 'no' ? (
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
    <Switch>
      <Route
        exact
        path="/projects/:project_id/:mission_id/"
        render={props =>
          (React.createElement(MissionPlan, { mission, project, ...props }))}
      />
      <Route
        exact
        path="/projects/:project_id/:mission_id/plan"
        render={props =>
          (React.createElement(MissionPlan, { mission, project, ...props }))}
      />
      <Route
        exact
        path="/projects/:project_id/:mission_id/flight"
        render={props => (React.createElement(MissionFlight, { mission, project, ...props }))}
      />
      <Route
        exact
        path="/projects/:project_id/:mission_id/analysis"
        render={props => (React.createElement(MissionAnalysis, { mission, project, ...props }))}
      />
      <Route component={NotFound} />
    </Switch>
  </div>
) : <NotFound />);

const ViewMission = ({
  loading, mission, match, history, project,
}) => (
  !loading ? renderMission(mission, match, history, project) : <Loading />
);

ViewMission.propTypes = {
  loading: PropTypes.bool.isRequired,
  mission: PropTypes.object,
  project: PropTypes.object,
  match: PropTypes.object.isRequired,
  history: PropTypes.object.isRequired,
};

export default withTracker(({ match }) => {
  const projectId = match.params.project_id;
  const missionId = match.params.mission_id;
  const missionSub = Meteor.subscribe('missions.view', projectId, missionId);
  const projectSub = Meteor.subscribe('projects.view', projectId);
  return {
    loading: !missionSub.ready() && !projectSub.ready(),
    mission: Missions.findOne(missionId),
    project: Projects.findOne(projectId),
  };
})(ViewMission);
