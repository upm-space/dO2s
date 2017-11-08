import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { Button, Row, Col, Panel, ListGroup, ListGroupItem, Nav, NavItem } from 'react-bootstrap';
import { Route, Switch, Redirect } from 'react-router-dom';
import { LinkContainer } from 'react-router-bootstrap';

import NotFound from '../../pages/NotFound/NotFound';
import MissionFileManagement from '../MissionFileManagement/MissionFileManagement';

class MissionAnalysis extends Component {
  constructor(props) {
    super(props);
    this.state = {
      mypth: 0,
    };
  }
  render() {
    const {
      mission, project, match,
    } = this.props;
    return (
      <div className="PreFlightCheckList"><h1>PreFlightCheckList</h1>
        <Row>
          <Col xs={12} sm={3} md={3} lg={3}>
            <Nav bsStyle="pills" activeKey={1} stacked>
              <LinkContainer to={`/projects/${match.params.project_id}/${match.params.mission_id}/analysis/file-manager`}>
                <NavItem eventKey={1}>File Manager</NavItem>
              </LinkContainer>
              <LinkContainer to={`/projects/${match.params.project_id}/${match.params.mission_id}/analysis/photo-sync`}>
                <NavItem eventKey={2}>Map Photo Sync</NavItem>
              </LinkContainer>
              <LinkContainer to={`/projects/${match.params.project_id}/${match.params.mission_id}/analysis/motion-video`}>
                <NavItem eventKey={3}>Full Motion Video</NavItem>
              </LinkContainer>
              <LinkContainer to={`/projects/${match.params.project_id}/${match.params.mission_id}/analysis/graphs`}>
                <NavItem eventKey={4}>Log Analysis</NavItem>
              </LinkContainer>
            </Nav>
          </Col>
          <Col xs={12} sm={9} md={9} lg={9}>
            <Switch>
              <Route
                exact
                path="/projects/:project_id/:mission_id/analysis/"
                render={() => (
                  <Redirect to={`${match.url}/file-manager`} />)}
              />
              <Route
                exact
                path="/projects/:project_id/:mission_id/analysis/file-manager"
                render={props => (
                  <MissionFileManagement
                    mission={mission}
                    project={project}
                    {...props}
                  />)}
              />
              {/* <Route
                exact
                path="/projects/:project_id/:mission_id/analysis/"
                render={props => (<PreFlightTOL
                  mission={mission}
                  project={project}
                  getPath={this.changeSelected}
                  {...props}
                />)}
              />
              <Route
                exact
                path="/projects/:project_id/:mission_id/analysis/"
                render={props =>
                  (<PreFlightChecks
                    mission={mission}
                    project={project}
                    getPath={this.changeSelected}
                    {...props}
                  />)}
              /> */}
              <Route component={NotFound} />
            </Switch>
          </Col>
        </Row>
      </div>
    );
  }
}

MissionAnalysis.propTypes = {
  mission: PropTypes.object.isRequired,
  project: PropTypes.object.isRequired,
  match: PropTypes.object.isRequired,
  history: PropTypes.object.isRequired,
};

export default MissionAnalysis;
