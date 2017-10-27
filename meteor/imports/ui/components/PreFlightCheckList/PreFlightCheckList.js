import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { Button, Row, Col } from 'react-bootstrap';
import { Route, Switch, Redirect } from 'react-router-dom';

import NotFound from '../../pages/NotFound/NotFound';
import SvgMilestones from '../SvgMilestones/SvgMilestones';
import PreFlightConnection from '../PreFlightConnection/PreFlightConnection';
import PreFlightTOL from '../PreFlightTOL/PreFlightTOL';
import PreFlightChecks from '../PreFlightChecks/PreFlightChecks';

class PreFlightCheckList extends Component {
  constructor(props) {
    super(props);
    this.changeSelected = this.changeSelected.bind(this);
    this.state = {
      selectedItem: props.match.path.split('/').pop(),
    };
  }

  changeSelected(selected) {
    this.setState({ selectedItem: selected });
  }

  render() {
    const {
      mission, project, match, history,
    } = this.props;
    const itemsPreFlight = [{
      text: 'Connection',
      selected: this.state.selectedItem === 'connect',
      checked: true,
      callback: () => history.push(`/projects/${match.params.project_id}/${match.params.mission_id}/preflight/connect`),
    }, {
      text: 'Path Fixes',
      selected: this.state.selectedItem === 'tol',
      checked: true,
      callback: () => history.push(`/projects/${match.params.project_id}/${match.params.mission_id}/preflight/tol`),
    }, {
      text: 'System Check',
      selected: this.state.selectedItem === 'checklist',
      checked: false,
      callback: () => history.push(`/projects/${match.params.project_id}/${match.params.mission_id}/preflight/checklist`),
    },
    ];
    return (
      <div className="PreFlightCheckList"><h1>PreFlightCheckList</h1>
        <Row>
          <Col xs={12} sm={3} md={3} lg={3}>
            <div className="PreFlightStages">
              <SvgMilestones elements={itemsPreFlight} />
            </div>
          </Col>
          <Col xs={12} sm={9} md={9} lg={9}>
            <Switch>
              <Route
                exact
                path="/projects/:project_id/:mission_id/preflight"
                render={() => (
                  <Redirect to={`${match.url}/connect`} />)}
              />
              <Route
                exact
                path="/projects/:project_id/:mission_id/preflight/connect"
                render={props => (
                  <PreFlightConnection
                    mission={mission}
                    project={project}
                    getPath={this.changeSelected}
                    {...props}
                  />)}
              />
              <Route
                exact
                path="/projects/:project_id/:mission_id/preflight/tol"
                render={props => (<PreFlightTOL
                  mission={mission}
                  project={project}
                  getPath={this.changeSelected}
                  {...props}
                />)}
              />
              <Route
                exact
                path="/projects/:project_id/:mission_id/preflight/checklist"
                render={props =>
                  (<PreFlightChecks
                    mission={mission}
                    project={project}
                    getPath={this.changeSelected}
                    {...props}
                  />)}
              />
              <Route component={NotFound} />
            </Switch>
          </Col>
        </Row>
      </div>
    );
  }
}

PreFlightCheckList.propTypes = {
  mission: PropTypes.object.isRequired,
  project: PropTypes.object.isRequired,
  match: PropTypes.object.isRequired,
  history: PropTypes.object.isRequired,
};

export default PreFlightCheckList;
