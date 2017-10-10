/* eslint-disable no-nested-ternary */
import React, { Component } from 'react';
import { Meteor } from 'meteor/meteor';
import PropTypes from 'prop-types';
import { Button, Row, Col } from 'react-bootstrap';
import { Bert } from 'meteor/themeteorchef:bert';
import { withTracker } from 'meteor/react-meteor-data';

import Payloads from '../../../api/Payloads/Payloads';
import Loading from '../../components/Loading/Loading';
import MissionMap from '../MissionMap/MissionMap';
import WayPointList from '../WayPointList/WayPointList';
import MissionFlightParameters from '../MissionFlightParameters/MissionFlightParameters';
import MissionPayloadParameters from '../MissionPayloadParameters/MissionPayloadParameters';
import MissionPictureGrid from '../MissionPictureGrid/MissionPictureGrid';
import MissionData from '../MissionData/MissionData';
import MissionBuilderDO2sParser from '../../../modules/mission-planning/MissionBuilderDO2sParser';
import { createRPAPath, setWaypointNumbers } from '../../../modules/waypoint-utilities';

import './MissionPlan.scss';

class MissionPlan extends Component {
  constructor(props) {
    super(props);
    this.toogleButtonSwtich = this.toggleButtonSwitch.bind(this);
    this.setTakeOffPoint = this.setTakeOffPoint.bind(this);
    this.setLandingPoint = this.setLandingPoint.bind(this);
    this.setMissionGeometry = this.setMissionGeometry.bind(this);
    this.setMissionAxisBuffer = this.setMissionAxisBuffer.bind(this);
    this.editWayPointList = this.editWayPointList.bind(this);
    this.clearWayPoints = this.clearWayPoints.bind(this);
    this.buttonGeometryName = this.buttonGeometryName.bind(this);
    this.getNumberOfSides = this.getNumberOfSides.bind(this);
    this.drawMission = this.drawMission.bind(this);

    this.state = {
      showWayPoints: false,
      missionDirection: 1,
      buttonStates: {
        takeOffButtonActive: false,
        landingButtonActive: false,
        defineAreaButtonActive: false,
        flightParametersButtonActive: false,
        payloadParamsButtonActive: false,
        pictureGridButtonActive: false,
        showWayPointsButtonActive: false,
        showMissionDataButtonActive: false,
      },
    };
  }

  setTakeOffPoint(takeOffPoint) {
    Meteor.call('missions.setTakeOffPoint', this.props.mission._id, takeOffPoint, (error) => {
      if (error) {
        Bert.alert(error.reason, 'danger');
      } else {
        Bert.alert('Take Off Point Set', 'success');
      }
    });
  }

  setLandingPoint(landingPoint) {
    Meteor.call('missions.setLandingPoint', this.props.mission._id, landingPoint, (error) => {
      if (error) {
        Bert.alert(error.reason, 'danger');
      } else {
        Bert.alert('Landing Point Set', 'success');
      }
    });
  }

  setMissionGeometry(missionGeometry = '') {
    Meteor.call('missions.setMissionGeometry', this.props.mission._id, missionGeometry, (error) => {
      if (error) {
        Bert.alert(error.reason, 'danger');
      } else if (missionGeometry) {
        Bert.alert('Mission Geometry Set', 'success');
      } else {
        Bert.alert('Mission Geometry Deleted', 'warning');
      }
    });
  }

  setMissionAxisBuffer(axisBuffer) {
    Meteor.call('missions.setMissionAxisBuffer', this.props.mission._id, axisBuffer, (error) => {
      if (error) {
        Bert.alert(error.reason, 'danger');
      } else {
        Bert.alert('Mission Axis Buffer Set', 'success');
      }
    });
  }

  getNumberOfSides() {
    if (this.props.mission.flightPlan.missionArea) {
      return this.props.mission.flightPlan.missionArea.geometry.coordinates[0].length - 1;
    }
    return 1;
  }

  editWayPointList(newWayPointList = {}, newRPAPath = {}) {
    Meteor.call('missions.editWayPointList', this.props.mission._id, newWayPointList, newRPAPath, (error) => {
      if (error) {
        Bert.alert(error.reason, 'danger');
      } else if (newWayPointList && newRPAPath) {
        Bert.alert('Mission Waypoints Updated', 'success');
      } else {
        Bert.alert('You should not get here ever', 'danger');
      }
    });
  }

  buttonGeometryName(mission) {
    if (mission && mission.missionType && mission.missionType === 'Surface Area') {
      return 'Area';
    } else if (mission && mission.missionType && mission.missionType === 'Linear Area') {
      return 'Axis';
    }
    return '??';
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

  drawMission(isChangeDirection) {
    if (!this.props.mission.flightPlan.flightParameters) {
      Bert.alert('You need to define the Flight Parameters', 'danger');
      return;
    } else if (!this.props.mission.flightPlan.pictureGrid) {
      Bert.alert('You need to define the Picture Grid', 'danger');
      return;
    } else if (!this.props.mission.flightPlan.takeOffPoint) {
      Bert.alert('You need to define the Take Off Point', 'danger');
      return;
    } else if (!this.props.mission.flightPlan.landingPoint) {
      Bert.alert('You need to define the Landing Point', 'danger');
      return;
    } else if (this.props.mission.missionType === 'Surface Area' && !this.props.mission.flightPlan.missionArea) {
      Bert.alert('You need to define the Mission Area', 'danger');
      return;
    } else if (this.props.mission.missionType === 'Linear Area' && !this.props.mission.flightPlan.missionAxis) {
      Bert.alert('You need to define the Mission Axis', 'danger');
      return;
    }

    this.toogleButtonSwtich();
    const dO2sBuilder = new MissionBuilderDO2sParser(this.props.mission, this.props.payload);
    dO2sBuilder.setInitialSegment(1);
    if (isChangeDirection) {
      const sides = this.getNumberOfSides();
      let missionDirection = this.state.missionDirection;
      if (missionDirection === sides) {
        missionDirection = 1;
        this.setState({ missionDirection: 1 });
      } else {
        missionDirection += 1;
        this.setState(prevState => ({ missionDirection: prevState.missionDirection + 1 }));
      }
      dO2sBuilder.setInitialSegment(missionDirection);
    }
    dO2sBuilder.calculateMission();
    const mData = dO2sBuilder.getMission();
    mData.waypointLine = createRPAPath(mData.waypoints);
    const waypointListNoNumbers = {
      type: 'FeatureCollection',
      features: mData.waypoints,
    };
    mData.waypointList = setWaypointNumbers(waypointListNoNumbers);
    Meteor.call('missions.setMissionCalculations', this.props.mission._id, mData, (error) => {
      if (error) {
        Bert.alert(error.reason, 'danger');
      } else {
        Bert.alert('Calculation of Waypoints Saved', 'success');
      }
    });
  }

  clearWayPoints() {
    this.toogleButtonSwtich();
    Meteor.call('missions.clearWayPoints', this.props.mission._id, (error) => {
      if (error) {
        Bert.alert(error.reason, 'danger');
      } else {
        Bert.alert('Mission Cleared', 'warning');
      }
    });
  }

  render() {
    const { project, mission, history, payload, loading } = this.props;
    let waypointList = [];
    if (mission &&
      mission.flightPlan &&
      mission.flightPlan.missionCalculation &&
      mission.flightPlan.missionCalculation.waypointList &&
      mission.flightPlan.missionCalculation.waypointList.features) {
      waypointList = mission.flightPlan.missionCalculation.waypointList.features;
    }
    return (!loading ? (
      <div className="MissionPlan container-fluid">
        <Row>
          <Col xs={12} sm={3} md={3} lg={3}>
            <Row>
              <Col xs={12} sm={12} md={12} lg={4} className="padding2 margin-bottom">
                <Button
                  bsStyle="primary"
                  onClick={() => this.toogleButtonSwtich('takeOffButtonActive')}
                  active={this.state.buttonStates.takeOffButtonActive}
                  block
                >
                  <div><i className="fa fa-arrow-circle-up fa-lg" aria-hidden="true" /></div>
                  <div>Set<br />Take Off</div>
                </Button>
              </Col>
              <Col xs={12} sm={12} md={12} lg={4} className="padding2 margin-bottom">
                <Button
                  bsStyle="primary"
                  onClick={() => this.toogleButtonSwtich('landingButtonActive')}
                  active={this.state.buttonStates.landingButtonActive}
                  block
                >
                  <div><i className="fa fa-arrow-circle-down fa-lg" aria-hidden="true" /></div>
                  <div>Set<br />Landing</div>
                </Button>
              </Col>
              <Col xs={12} sm={12} md={12} lg={4} className="padding2 margin-bottom">
                <Button
                  bsStyle="primary"
                  onClick={() => this.toogleButtonSwtich('defineAreaButtonActive')}
                  active={this.state.buttonStates.defineAreaButtonActive}
                  block
                >
                  <div><i className="fa fa-paint-brush fa-lg" aria-hidden="true" /></div>
                  <div>Define<br />{this.buttonGeometryName(mission)}</div>
                </Button>
              </Col>

            </Row>
            <br />
            <Row>
              <Col xs={12} sm={6} md={6} lg={6} className="padding2 margin-bottom">
                <Button
                  bsStyle="success"
                  onClick={() => this.drawMission(false)}
                  block
                >
                  <div><i className="fa fa-superpowers fa-lg" aria-hidden="true" /></div>
                  <div>Draw<br />Mission</div>
                </Button>
              </Col>
              <Col xs={12} sm={6} md={6} lg={6} className="padding2 margin-bottom">
                <Button
                  bsStyle="success"
                  onClick={() => this.toogleButtonSwtich()}
                  block
                >
                  <div><i className="fa fa-long-arrow-up fa-lg" aria-hidden="true" /></div>
                  <div>Get WPS<br />Altitude<br /></div>
                </Button>
              </Col>
              <Col xs={12} sm={12} md={12} lg={12} className="padding2 margin-bottom">
                <Button
                  bsStyle="success"
                  onClick={() => this.drawMission(true)}
                  disabled={mission.missionType !== 'Surface Area'}
                  block
                >
                  <div><i className="fa fa-rotate-right fa-lg" aria-hidden="true" /></div>
                  <div>Change Mission Direction</div>
                </Button>
              </Col>
            </Row>
            <br />
            <Row>
              <Col xs={12} sm={12} md={12} lg={4} className="padding2 margin-bottom">
                <Button
                  bsStyle="info"
                  onClick={() => this.toogleButtonSwtich('flightParametersButtonActive')}
                  active={this.state.buttonStates.flightParametersButtonActive}
                  block
                >
                  <div><i className="fa fa-paper-plane fa-lg" aria-hidden="true" /></div>
                  <div>Flight<br />Params</div></Button>
              </Col>
              <Col xs={12} sm={12} md={12} lg={4} className="padding2 margin-bottom">
                <Button
                  bsStyle="info"
                  onClick={() => this.toogleButtonSwtich('payloadParamsButtonActive')}
                  active={this.state.buttonStates.payloadParamsButtonActive}
                  block
                >
                  <div><i className="fa fa-camera fa-lg" aria-hidden="true" /></div>
                  <div>Payload<br />Params</div></Button>
              </Col>
              <Col xs={12} sm={12} md={12} lg={4} className="padding2 margin-bottom">
                <Button
                  bsStyle="info"
                  onClick={() => this.toogleButtonSwtich('pictureGridButtonActive')}
                  active={this.state.buttonStates.pictureGridButtonActive}
                  block
                >
                  <div><i className="fa fa-picture-o fa-lg" aria-hidden="true" /></div>
                  <div>Picture<br />Grid</div></Button>
              </Col>
            </Row>
            <br />
            <Row>
              <Col xs={12} sm={6} md={6} lg={6} className="padding2 margin-bottom">
                <Button
                  bsStyle="primary"
                  onClick={() => this.toogleButtonSwtich('showWayPointsButtonActive')}
                  active={this.state.buttonStates.showWayPointsButtonActive}
                  block
                >
                  <div><i className="fa fa-map-marker fa-lg" aria-hidden="true" /></div>
                  <div>Show<br />WayPoints</div></Button>
              </Col>
              <Col xs={12} sm={6} md={6} lg={6} className="padding2 margin-bottom">
                <Button
                  bsStyle="primary"
                  onClick={() => this.toogleButtonSwtich('showMissionDataButtonActive')}
                  active={this.state.buttonStates.showMissionDataButtonActive}
                  block
                >
                  <div><i className="fa fa-bullseye fa-lg" aria-hidden="true" /></div>
                  <div>Show<br />Mission Data</div></Button>
              </Col>
            </Row>
            <br />
            <Row>
              <Col xs={12} sm={12} md={12} lg={12} className="padding2 margin-bottom">
                <Button
                  bsStyle="danger"
                  block
                  onClick={() => this.clearWayPoints()}
                >
                  <div><i className="fa fa-trash fa-lg" aria-hidden="true" /></div>
                  <div>Clear WayPoints</div></Button>
              </Col>
            </Row>
            <br />
            <Row>
              <Col xs={12} sm={6} md={6} lg={6} className="padding2 margin-bottom">
                <Button
                  bsStyle="default"
                  onClick={() => this.toogleButtonSwtich()}
                  block
                >
                  <div><i className="fa fa-square-o fa-lg" aria-hidden="true" /></div>
                  <div>Perimeter<br /> KML</div></Button>
              </Col>
              <Col xs={12} sm={6} md={6} lg={6} className="padding2 margin-bottom">
                <Button
                  bsStyle="default"
                  onClick={() => this.toogleButtonSwtich()}
                  block
                >
                  <div><i className="fa fa-map fa-lg" aria-hidden="true" /></div>
                  <div>Mission<br /> KML</div></Button>
              </Col>
            </Row>
          </Col>
          <Col xs={12} sm={9} md={9} lg={9}>
            {this.state.buttonStates.flightParametersButtonActive ?
              <MissionFlightParameters mission={mission} /> :
              (this.state.buttonStates.payloadParamsButtonActive ?
                <MissionPayloadParameters history={history} payload={payload} /> :
                (this.state.buttonStates.pictureGridButtonActive ?
                  <MissionPictureGrid mission={mission} /> :
                  <MissionMap
                    location={project && project.mapLocation}
                    mission={mission}
                    height="80vh"
                    onLocationChange={() => {}}
                    takeOffPointActive={this.state.buttonStates.takeOffButtonActive}
                    landingPointActive={this.state.buttonStates.landingButtonActive}
                    defineAreaActive={this.state.buttonStates.defineAreaButtonActive}
                    setTakeOffPoint={this.setTakeOffPoint}
                    setLandingPoint={this.setLandingPoint}
                    setMissionGeometry={this.setMissionGeometry}
                    editWayPointsActive={this.state.buttonStates.showWayPointsButtonActive}
                    editWayPoints={this.editWayPointList}
                  />
                ))}
            {this.state.buttonStates.showWayPointsButtonActive ? <WayPointList missionId={mission._id} waypointList={waypointList} /> : ''}
            {this.state.buttonStates.showMissionDataButtonActive ? <MissionData mission={mission} /> : ''}
          </Col>
        </Row>
      </div>) : <Loading />);
  }
}

MissionPlan.propTypes = {
  loading: PropTypes.bool.isRequired,
  mission: PropTypes.object,
  project: PropTypes.object,
  payload: PropTypes.object,
  history: PropTypes.object.isRequired,
};

export default withTracker(({ mission }) => {
  const payloadsSub = Meteor.subscribe('payloads.view', mission.payload);
  return {
    loading: !payloadsSub.ready(),
    payload: Payloads.findOne(mission.payload),
  };
})(MissionPlan);
