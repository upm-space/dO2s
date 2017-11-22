import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { Meteor } from 'meteor/meteor';
import { withTracker } from 'meteor/react-meteor-data';
import { Bert } from 'meteor/themeteorchef:bert';

import { Button, Row, Col, FormGroup, ControlLabel, HelpBlock } from 'react-bootstrap';
import PreFlightMap from '../PreFlightMap/PreFlightMap';

import RPAs from '../../../api/RPAs/RPAs';
import getElevation from '../../../modules/mission-planning/get-elevation';
import { addLandingPath, deleteLandingPath, convertWaypointArrayToGeoJSON, setWaypointWebNumbers } from '../../../modules/mission-planning/waypoint-utilities';

class PreFlightTOL extends Component {
  constructor(props) {
    super(props);
    this.toogleButtonSwtich = this.toggleButtonSwitch.bind(this);
    this.setTakeOffPoint = this.setTakeOffPoint.bind(this);
    this.setLandingPoint = this.setLandingPoint.bind(this);
    this.editWayPointList = this.editWayPointList.bind(this);
    this.calculateElevation = this.calculateElevation.bind(this);
    this.checkLimit = this.checkLimit.bind(this);
    this.setLandingPath = this.setLandingPath.bind(this);
    this.removeLandingPath = this.removeLandingPath.bind(this);
    this.editLandingBearing = this.editLandingBearing.bind(this);
    this.readWPfromRPA = this.readWPfromRPA.bind(this);

    this.state = {
      isClockWise: false,
      segmentSizeOverLimit: false,
      readWPList: {},
      buttonStates: {
        getAngleActive: false,
      },
    };
  }

  componentDidMount() {
    this.props.getPath(this.props.match.path.split('/').pop());
  }

  setTakeOffPoint(takeOffPoint = 0) {
    if (takeOffPoint !== 0) {
      Meteor.call('missions.setTakeOffPoint', this.props.mission._id, takeOffPoint, (error) => {
        if (error) {
          Bert.alert(error.reason, 'danger');
        } else {
          Bert.alert('Take Off Point Set', 'success');
        }
      });
    } else {
      Bert.alert('No take off point reading', 'danger');
    }
  }

  setLandingPoint(landingPoint = 0) {
    if (landingPoint !== 0) {
      Meteor.call('missions.setLandingPoint', this.props.mission._id, landingPoint, (error) => {
        if (error) {
          Bert.alert(error.reason, 'danger');
        } else {
          Bert.alert('Landing Point Set', 'success');
        }
      });
    } else {
      Bert.alert('No lading point reading', 'danger');
    }
  }

  setLandingPath() {
    const doWaypointsExist = this.props.mission.flightPlan &&
     this.props.mission.flightPlan.missionCalculation &&
     this.props.mission.flightPlan.missionCalculation.waypointList;
    const isHeightDefined = this.props.mission.flightPlan &&
     this.props.mission.flightPlan.flightParameters &&
     this.props.mission.flightPlan.flightParameters.height;
    const landingSlope = this.props.rpa.flightParameters.optimalLandingSlope;
    const landingBearing = this.props.mission.flightPlan &&
     this.props.mission.flightPlan.landingBearing;
    if (!doWaypointsExist) {
      Bert.alert('You need to draw the mission', 'danger');
      return;
    } else if (!isHeightDefined) {
      Bert.alert('You need to define the Flight Height', 'danger');
      return;
    } else if (!landingSlope && landingSlope === 0) {
      Bert.alert('The landing sole is zero', 'warning');
      return;
    }
    const newWaypointList = addLandingPath(
      doWaypointsExist,
      landingBearing,
      this.segmentSize.value,
      landingSlope,
      isHeightDefined,
      this.state.isClockWise,
    );
    if (newWaypointList === 0) {
      Bert.alert('Landing Path already defined', 'warning');
      return;
    }
    this.editWayPointList(newWaypointList);
  }

  removeLandingPath() {
    const doWaypointsExist = this.props.mission.flightPlan &&
     this.props.mission.flightPlan.missionCalculation &&
     this.props.mission.flightPlan.missionCalculation.waypointList;
    const isHeightDefined = this.props.mission.flightPlan &&
     this.props.mission.flightPlan.flightParameters &&
     this.props.mission.flightPlan.flightParameters.height;
    const landingSlope = this.props.rpa.flightParameters.optimalLandingSlope;
    if (!doWaypointsExist) {
      Bert.alert('You need to draw the mission', 'danger');
      return;
    } else if (!isHeightDefined) {
      Bert.alert('You need to define the Flight Height', 'danger');
      return;
    } else if (!landingSlope && landingSlope === 0) {
      Bert.alert('The landing sole is zero', 'warning');
      return;
    }
    const newWaypointList = deleteLandingPath(doWaypointsExist);
    if (newWaypointList === 0) {
      Bert.alert('No landing path defined', 'warning');
      return;
    }
    this.editWayPointList(newWaypointList);
  }

  readWPfromRPA() {
    // TODO send message to read WP list from RPA
    const telArrayforTesting = [
      {
        lat: -20.1742351208975, lng: 57.6712475717068, alt: 50, seq: 0, command: 1,
      },
      {
        lat: -20.1752926079632, lng: 57.6708221921405, alt: 50, seq: 1, command: 5,
      },
      {
        lat: -20.1752874953265, lng: 57.6713012158871, alt: 50, seq: 2, command: 3,
      },
      {
        lat: -20.1752572837194, lng: 57.6741336286068, alt: 50, seq: 3, command: 4,
      },
      {
        lat: -20.1752521774522, lng: 57.6746126523219, alt: 50, seq: 4, command: 5,
      },
      {
        lat: -20.1742703680029, lng: 57.6739029586315, alt: 50, seq: 5, command: 2,
      },
    ];

    const featureCollectionfromArray = convertWaypointArrayToGeoJSON(telArrayforTesting);
    const featureCollectionfromArrayNumbers = setWaypointWebNumbers(featureCollectionfromArray);
    this.setState({ readWPList: featureCollectionfromArrayNumbers });
  }

  editWayPointList(newWayPointList = {}) {
    Meteor.call('missions.editWayPointList', this.props.mission._id, newWayPointList, (error) => {
      if (error) {
        Bert.alert(error.reason, 'danger');
      } else if (newWayPointList) {
        Bert.alert('Mission Waypoints Updated', 'success');
      } else {
        Bert.alert('You should not get here ever', 'danger');
      }
    });
  }

  calculateElevation() {
    const doWaypointsExist = this.props.mission.flightPlan &&
     this.props.mission.flightPlan.missionCalculation &&
     this.props.mission.flightPlan.missionCalculation.waypointList;
    const isHeightDefined = this.props.mission.flightPlan &&
      this.props.mission.flightPlan.flightParameters &&
      this.props.mission.flightPlan.flightParameters.height;
    if (!doWaypointsExist) {
      Bert.alert('You need to draw the mission', 'danger');
      return;
    } else if (!isHeightDefined) {
      Bert.alert('You need to define the Flight Height', 'danger');
      return;
    }
    this.toogleButtonSwtich();
    getElevation(this.props.mission._id, isHeightDefined, doWaypointsExist);
  }

  toggleButtonSwitch(thisButton = '') {
    this.setState((prevState) => {
      const myButtons = Object.keys(prevState.buttonStates);
      const newButtonStates = prevState.buttonStates;
      for (let i = 0; i < myButtons.length; i += 1) {
        if (thisButton !== myButtons[i]) {
          if (prevState.buttonStates[myButtons[i]]) {
            newButtonStates[myButtons[i]] = false;
          }
        }
      }
      if (thisButton) {
        newButtonStates[thisButton] = !prevState.buttonStates[thisButton];
      }
      return { buttonStates: newButtonStates };
    });
  }

  checkLimit(newSegmentSize) {
    this.setState({ segmentSizeOverLimit: newSegmentSize > 500 });
  }

  changeDirection(newValue) {
    this.setState({ isClockWise: newValue });
  }

  editLandingBearing(newLandingBearing = {}) {
    this.toggleButtonSwitch();
    Meteor.call('missions.setLandingBearing', this.props.mission._id, newLandingBearing, (error) => {
      if (error) {
        Bert.alert(error.reason, 'danger');
      } else if (newLandingBearing !== {}) {
        Bert.alert('Mission Landing Bearing Updated', 'success');
      } else {
        Bert.alert('You should not get here ever', 'danger');
      }
    });
  }

  render() {
    const {
      mission, project, match, history,
    } = this.props;
    return (
      <div className="TOL">
        <Row>
          <h4>Fix Take Off and Landing Points</h4>
          <Col xs={12} sm={3} md={3} lg={3}>
            <Row>
              <Col xs={12} sm={12} md={12} lg={12} style={{ padding: '0px 2px' }}>
                <Button
                  onClick={() => this.setTakeOffPoint()}
                  block
                  bsStyle="primary"
                >
                    Set Take Off Point
                </Button>
              </Col>
            </Row>
            <br />
            <Row>
              <Col xs={12} sm={12} md={12} lg={12} style={{ padding: '0px 2px' }}>
                <Button
                  onClick={() => this.setLandingPoint()}
                  block
                  bsStyle="primary"
                >
                  Set Landing Point
                </Button>
              </Col>
            </Row>
            <hr />
            <Row>
              <h4>Set Landing Path</h4>
              <Col xs={12} sm={12} md={12} lg={12} style={{ padding: '0px 2px' }}>
                <FormGroup
                  validationState={this.state.segmentSizeOverLimit ? 'warning' : null}
                >
                  <ControlLabel>Max Distance From Pilot (m)</ControlLabel>
                  <input
                    type="number"
                    className="form-control"
                    name="segmentSize"
                    ref={segmentSize => (this.segmentSize = segmentSize)}
                    defaultValue={500}
                    onChange={() => this.checkLimit(Number(this.segmentSize.value))}
                  />
                  {this.state.segmentSizeOverLimit ?
                    <HelpBlock>Legal limit is 500 m</HelpBlock> : ''}
                </FormGroup>
              </Col>
            </Row>
            <Row style={{ verticalAlign: 'middle' }}>
              <Col xs={12} sm={12} md={12} lg={12} style={{ padding: '0px 2px' }}>
                <FormGroup>
                  <input
                    type="checkbox"
                    className="form-check-input large"
                    name="isClockWise"
                    ref={isClockWise => (this.isClockWise = isClockWise)}
                    checked={this.state.isClockWise}
                    onChange={() => this.changeDirection(this.isClockWise.checked)}
                  />
                  {' '}
                  <ControlLabel>ClockWise</ControlLabel>
                  {this.state.segmentSizeOverLimit ?
                    <HelpBlock>Legal limit is 500 m</HelpBlock> : ''}
                </FormGroup>
              </Col>
              <Col xs={12} sm={12} md={12} lg={12} style={{ padding: '0px 2px' }}>
                <Button
                  onClick={() => this.toggleButtonSwitch('getAngleActive')}
                  block
                  bsStyle="default"
                >
                    Set Landing Bearing
                </Button>
              </Col>
            </Row>
            <br />
            <Row>
              <Col xs={12} sm={6} md={6} lg={6} style={{ padding: '0px 2px' }}>
                <Button
                  onClick={this.setLandingPath}
                  block
                  bsStyle="primary"
                >
                  Set
                </Button>
              </Col>
              <Col xs={12} sm={6} md={6} lg={6} style={{ padding: '0px 2px' }}>
                <Button
                  onClick={this.removeLandingPath}
                  block
                  bsStyle="danger"
                >
                  Remove
                </Button>
              </Col>
            </Row>
            <hr />
            <Row>
              <Col xs={12} sm={12} md={12} lg={12} style={{ padding: '0px 2px' }}>
                <Button
                  block
                  bsStyle="info"
                >
                    Send Waypoints
                </Button>
              </Col>
            </Row>
            <br />
            <Row>
              <Col xs={12} sm={12} md={12} lg={12} style={{ padding: '0px 2px' }}>
                <Button
                  block
                  bsStyle="info"
                  onClick={this.readWPfromRPA}
                >
                    Read Waypoints
                </Button>
              </Col>
            </Row>
            <br />
            <Row>
              <Col xs={12} sm={12} md={12} lg={12} style={{ padding: '0px 2px' }}>
                <Button
                  bsStyle="success"
                  onClick={() => history.push(`/projects/${match.params.project_id}/${match.params.mission_id}/preflight/checklist`)}
                  block
                >
              Go to PreFlight<br /> Systems Check
                </Button>
              </Col>
            </Row>
          </Col>
          <Col xs={12} sm={9} md={9} lg={9}>
            <PreFlightMap
              location={project && project.mapLocation}
              mission={mission}
              height="70vh"
              getAngleActive={this.state.buttonStates.getAngleActive}
              updateLandingBearing={this.editLandingBearing}
              readWPList={this.state.readWPList}
            />
          </Col>
        </Row>
      </div>
    );
  }
}

PreFlightTOL.propTypes = {
  loading: PropTypes.bool.isRequired,
  mission: PropTypes.object.isRequired,
  project: PropTypes.object.isRequired,
  rpa: PropTypes.object,
  getPath: PropTypes.func.isRequired,
  match: PropTypes.object.isRequired,
  history: PropTypes.object.isRequired,
};

export default withTracker(({ mission }) => {
  const rpaId = mission.rpa;
  const subscription = Meteor.subscribe('rpas.view', rpaId);

  return {
    loading: !subscription.ready(),
    rpa: RPAs.findOne(rpaId),
  };
})(PreFlightTOL);
