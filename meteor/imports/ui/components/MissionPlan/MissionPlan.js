import React, { Component } from 'react';
import { Meteor } from 'meteor/meteor';
import PropTypes from 'prop-types';
import { Button, Row, Col, ButtonToolbar } from 'react-bootstrap';
import { Bert } from 'meteor/themeteorchef:bert';

import MissionMap from '../MissionMap/MissionMap';
import WayPointList from '../WayPointList/WayPointList';

import './MissionPlan.scss';

class MissionPlan extends Component {
  constructor(props) {
    super(props);
    this.toogleButtonSwtich = this.toggleButtonSwitch.bind(this);
    this.setTakeOffPoint = this.setTakeOffPoint.bind(this);
    this.setLandingPoint = this.setLandingPoint.bind(this);
    this.setMissionGeometry = this.setMissionGeometry.bind(this);
    this.setMissionAxisBuffer = this.setMissionAxisBuffer.bind(this);
    this.buttonGeometryName = this.buttonGeometryName.bind(this);
    this.state = {
      showWayPoints: false,
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

  buttonGeometryName(mission) {
    if (mission && mission.missionType && mission.missionType === 'Surface Area') {
      return 'Area';
    } else if (mission && mission.missionType && mission.missionType === 'Linear Area') {
      return 'Axis';
    }
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

  render() {
    const { project, mission } = this.props;
    return (
      <div className="MissionPlan">
        <Row>
          <Col xs={12} sm={3} md={3} lg={3}>
            <ButtonToolbar>
              <Button
                bsStyle="primary"
                onClick={() => this.toogleButtonSwtich('takeOffButtonActive')}
                active={this.state.buttonStates.takeOffButtonActive}
                className="btn-xs-block"
              >
                <div><i className="fa fa-arrow-circle-up fa-lg" aria-hidden="true" /></div>
                <div>Take Off <br /> Point</div>
              </Button>
              <Button
                bsStyle="primary"
                onClick={() => this.toogleButtonSwtich('landingButtonActive')}
                active={this.state.buttonStates.landingButtonActive}
              >
                <div><i className="fa fa-arrow-circle-down fa-lg" aria-hidden="true" /></div>
                <div>Landing <br /> Point</div>
              </Button>
              <Button
                bsStyle="primary"
                onClick={() => this.toogleButtonSwtich('defineAreaButtonActive')}
                active={this.state.buttonStates.defineAreaButtonActive}
              >
                <div><i className="fa fa-paint-brush fa-lg" aria-hidden="true" /></div>
                <div>Define <br />
                  {this.buttonGeometryName(mission)}
                </div>
              </Button>
            </ButtonToolbar>
            <br />
            <ButtonToolbar>
              <Button
                bsStyle="success"
                onClick={() => this.toogleButtonSwtich()}
              >
                <div><i className="fa fa-superpowers fa-lg" aria-hidden="true" /></div>
                <div>Draw Mission</div>
              </Button>
              <Button
                bsStyle="success"
                onClick={() => this.toogleButtonSwtich()}
              >
                <div><i className="fa fa-rotate-right fa-lg" aria-hidden="true" /></div>
                <div>Change Mission Direction</div>
              </Button>
              <Button
                bsStyle="success"
                onClick={() => this.toogleButtonSwtich()}
              >
                <div><i className="fa fa-long-arrow-up fa-lg" aria-hidden="true" /></div>
                <div>Get WPS Altitude</div>
              </Button>
            </ButtonToolbar>
            <br />
            <ButtonToolbar>
              <Button
                bsStyle="info"
                onClick={() => this.toogleButtonSwtich('flightParametersButtonActive')}
                active={this.state.buttonStates.flightParametersButtonActive}
              >
                <div><i className="fa fa-paper-plane fa-lg" aria-hidden="true" /></div>
                <div>Flight Parameters</div>
              </Button>
              <Button
                bsStyle="info"
                onClick={() => this.toogleButtonSwtich('payloadParamsButtonActive')}
                active={this.state.buttonStates.payloadParamsButtonActive}
              >
                <div><i className="fa fa-camera fa-lg" aria-hidden="true" /></div>
                <div>Payload Parameters</div></Button>
              <Button
                bsStyle="info"
                onClick={() => this.toogleButtonSwtich('pictureGridButtonActive')}
                active={this.state.buttonStates.pictureGridButtonActive}
              >
                <div><i className="fa fa-picture-o fa-lg" aria-hidden="true" /></div>
                <div>Picture Grid</div></Button>
            </ButtonToolbar>
            <br />
            <ButtonToolbar>
              <Button
                bsStyle="primary"
                onClick={() => this.toogleButtonSwtich('showWayPointsButtonActive')}
                active={this.state.buttonStates.showWayPointsButtonActive}
              >
                <div><i className="fa fa-map-marker fa-lg" aria-hidden="true" /></div>
                <div>Show WayPoints</div></Button>
              <Button
                bsStyle="primary"
                onClick={() => this.toogleButtonSwtich('showMissionDataButtonActive')}
                active={this.state.buttonStates.showMissionDataButtonActive}
              >
                <div><i className="fa fa-bullseye fa-lg" aria-hidden="true" /></div>
                <div>Show Mission Data</div></Button>
            </ButtonToolbar>
            <br />
            <ButtonToolbar>
              <Button
                bsStyle="danger"
                block
                onClick={() => this.toogleButtonSwtich()}
              >
                <div><i className="fa fa-trash fa-lg" aria-hidden="true" /></div>
                <div>Clear WayPoints</div></Button>
            </ButtonToolbar>
            <br />
            <ButtonToolbar>
              <Button
                bsStyle="default"
                onClick={() => this.toogleButtonSwtich()}
              >
                <div><i className="fa fa-download fa-lg" aria-hidden="true" /></div>
                <div>Export Mission</div></Button>
              <Button
                bsStyle="default"
                onClick={() => this.toogleButtonSwtich()}
              >
                <div><i className="fa fa-upload fa-lg" aria-hidden="true" /></div>
                <div>Import Mission</div></Button>

            </ButtonToolbar>
            <br />
            <ButtonToolbar>
              <Button
                bsStyle="default"
                onClick={() => this.toogleButtonSwtich()}
              >
                <div><i className="fa fa-square-o fa-lg" aria-hidden="true" /></div>
                <div>Perimeter KML</div></Button>
              <Button
                bsStyle="default"
                onClick={() => this.toogleButtonSwtich()}
              >
                <div><i className="fa fa-map fa-lg" aria-hidden="true" /></div>
                <div>Mission KML</div></Button>
            </ButtonToolbar>
          </Col>
          <Col xs={12} sm={9} md={9} lg={9}>
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
            />
            {this.state.showWayPoints ? <WayPointList /> : ''}
          </Col>
        </Row>
      </div>
    );
  }
}

MissionPlan.propTypes = {
  mission: PropTypes.object,
  project: PropTypes.object,
};

export default MissionPlan;
