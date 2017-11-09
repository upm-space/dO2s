import React from 'react';
import PropTypes from 'prop-types';
import { Button, Row, Col, ProgressBar, FormGroup, Form, ControlLabel, FormControl, ButtonGroup } from 'react-bootstrap';
import WebSocketTelemetry from '../../../modules/flight-telemetry';
import WidgetAirSpeed from '../FlightWidgets/WidgetAirSpeed.js';
import WidgetAltimeter from '../FlightWidgets/WidgetAltimeter.js';
import WidgetAttitude from '../FlightWidgets/WidgetAttitude.js';
import MissionMap from '../MissionMap/MissionMap';

import './MissionFlight.scss';

class MissionFlight extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      noData: true,
      connStatus: false,
      attitudeData: {
        pitchRead: 0,
        rollRead: 0,
        yawRead: 0,
      },
      GPSData: {
        altRead: 0,
        lonRead: 0,
        latRead: 0,
        signalType: 0,
        speedRead: 0,
      },
      VFRData: {
        airspeed: 0,
      },
      HeartBeat: {
        mode: 'disarmed',
      },
      BatStatus: {
        voltage: 0,
        remaining: 0,
        amper: 0,
      },
      currentWP: {
        lastWp: 0,
      },
      distToWp: {
        distToWp: 0,
      },
    };
    this.toggleArmed = this.toggleArmed.bind(this);
    this.toggleFlightMode = this.toggleFlightMode.bind(this);
  }

  componentDidMount() {
    const client = new WebSocketTelemetry();
    this.client = client;

    client.on('connStatus', (msg) => {
      this.setState({ connStatus: msg.status });
    });

    client.on('attitudeData', (attData) => {
      this.setState({ attitudeData: attData, noData: false });
    });

    client.on('GPSData', (gpsData) => {
      this.setState({ GPSData: gpsData, noData: false });
    });

    client.on('VFRData', (vfrData) => {
      this.setState({ VFRData: vfrData, noData: false });
    });

    client.on('HeartBeat', (hearbeatData) => {
      this.setState({ HeartBeat: hearbeatData, noData: false });
    });

    client.on('BatStatus', (batStatus) => {
      this.setState({ BatStatus: batStatus, noData: false });
    });

    client.on('currentWP', (wpData) => {
      this.setState({ currentWP: wpData, noData: false });
    });

    client.on('distToWp', (wpData) => {
      this.setState({ distToWp: wpData, noData: false });
    });

    client.on('noData', (value) => {
      this.setState({ noData: value });
    });

    client.on('webServiceClosed', (value) => {
      this.setState({ connStatus: value, noData: true });
    });
  }

  componentWillUnmount() {
    this.client.closeWebService();
  }

  toggleArmed() {
    if (this.state.HeartBeat.mode === 'disarmed') {
      this.client.arm();
    } else {
      this.client.disArm();
    }
  }

  toggleFlightMode(newFlightMode) {
    this.client.setFlighMode(newFlightMode);
  }

  renderFlightModes() {
    return (
      <ButtonGroup justified>
        <ButtonGroup>
          <Button
            bsStyle={this.state.HeartBeat.mode === 'auto' ? 'primary' : 'default'}
            onClick={() => this.toggleFlightMode('Auto')}
          >
        AUTO
          </Button>
        </ButtonGroup>
        <ButtonGroup>
          <Button
            bsStyle={this.state.HeartBeat.mode === 'stabilized' ? 'primary' : 'default'}
            onClick={() => this.toggleFlightMode('Stabilized')}
          >
        STABILIZED
          </Button>
        </ButtonGroup>
        <ButtonGroup>
          <Button
            bsStyle={this.state.HeartBeat.mode === 'manual' ? 'primary' : 'default'}
            onClick={() => this.toggleFlightMode('Manual')}
          >
          MANUAL
          </Button>
        </ButtonGroup>
        <ButtonGroup>
          <Button
            bsStyle={this.state.HeartBeat.mode === 'loiter' ? 'primary' : 'default'}
            onClick={() => this.toggleFlightMode('Loiter')}
          >
        LOITER
          </Button>
        </ButtonGroup>
        <ButtonGroup>
          <Button
            bsStyle={this.state.HeartBeat.mode === 'guided' ? 'primary' : 'default'}
            onClick={() => this.toggleFlightMode('Guided')}
          >
        GUIDED
          </Button>
        </ButtonGroup>
        <ButtonGroup>
          <Button
            bsStyle={this.state.HeartBeat.mode === 'rtl' ? 'primary' : 'default'}
            onClick={() => this.toggleFlightMode('RTL')}
          >
        RTL
          </Button>
        </ButtonGroup>
      </ButtonGroup>);
  }

  render() {
    const {
      mission, project,
    } = this.props;
    let takeOffElevation = 0;
    if (
      mission &&
      mission.flightPlan &&
      mission.flightPlan.missionCalculation &&
      mission.flightPlan.missionCalculation.waypointList.features &&
      mission.flightPlan.missionCalculation.waypointList.features[0] &&
      mission.flightPlan.missionCalculation.waypointList.features[0].properties
    ) {
      takeOffElevation =
        mission.flightPlan.missionCalculation.waypointList.features[0].properties.altGround;
    }
    const altimeterValue = this.state.GPSData.altRead - takeOffElevation;
    return (
      <div className="MissionFlight container-fluid">
        <Row>
          <Col xs={12} sm={6} md={6} lg={6}>
            <Row>
              <Col xs={12} sm={3} md={3} lg={3}>
                <Button
                  bsStyle={this.state.connStatus ? 'primary' : 'default'}
                  block
                  bsSize="large"
                  onClick={() => this.client.connectToServer()}
                >
                  {this.state.connStatus ? 'Connected' : 'No Conection'}
                </Button>
              </Col>
              <Col xs={12} sm={6} md={6} lg={6}>
                <Button
                  bsStyle={this.state.HeartBeat.mode === 'disarmed' ? 'success' : 'danger'}
                  block
                  bsSize="large"
                  onClick={this.toggleArmed}
                >
                  {this.state.HeartBeat.mode === 'disarmed' ? 'DISARMED' : 'ARMED'}
                </Button>
              </Col>
              <Col xs={12} sm={3} md={3} lg={3}>
                <Button
                  bsStyle={this.state.noData ? 'warning' : 'info'}
                  block
                  bsSize="large"
                >
                  {this.state.noData ? 'No Data' : 'Data ON'}
                </Button>
              </Col>
            </Row>
            <Row>
              <Col xs={12} sm={12} md={12} lg={12}>
                <h5>Flight Mode</h5>
                {this.state.HeartBeat.mode.startsWith('unknown') ? (
                  <Button
                    bsStyle="primary"
                    onClick={() => this.toggleFlightMode('Auto')}
                    block
                  >
                    {this.state.HeartBeat.mode}
                  </Button>) :
                  this.renderFlightModes()
                }
              </Col>
            </Row>
            <br />
            <Row>
              <Col xs={4} sm={4} md={4} lg={4} className="padding2">
                <WidgetAttitude
                  id="wAttitude"
                  pitchProp={this.state.attitudeData.pitchRead}
                  rollProp={this.state.attitudeData.rollRead}
                />
              </Col>
              <Col xs={4} sm={4} md={4} lg={4} className="padding2">
                <WidgetAirSpeed id="wAirSpeed" speedProp={this.state.VFRData.airspeed} />
              </Col>
              <Col xs={4} sm={4} md={4} lg={4} className="padding2">
                <WidgetAltimeter id="wAltimeter" altitudeProp={altimeterValue} />
              </Col>
            </Row>
            <Row>
              <Form horizontal>
                <Col xs={12} sm={12} md={4} lg={4}>
                  <FormGroup>
                    <Col componentClass={ControlLabel} xs={12} sm={8} md={8} lg={8}>
                      Current Waypoint
                    </Col>
                    <Col xs={12} sm={4} md={4} lg={4}>
                      <FormControl.Static>
                        <span className="fa-stack fa-2x">
                          <span className="fa fa-flag fa-2x" aria-hidden="true" />
                          <strong className="fa-stack-1x calendar-text">
                            {this.state.currentWP.lastWp}
                          </strong>
                        </span>
                      </FormControl.Static>
                    </Col>
                  </FormGroup>
                </Col>
                <Col xs={12} sm={12} md={4} lg={4}>
                  <FormGroup>
                    <Col componentClass={ControlLabel} xs={12} sm={8} md={8} lg={8}>
                      Distance to Next Waypoint
                    </Col>
                    <Col xs={12} sm={4} md={4} lg={4}>
                      <FormControl.Static>
                        {this.state.distToWp.distToWp} m
                      </FormControl.Static>
                    </Col>
                  </FormGroup>
                </Col>
                <Col xs={12} sm={12} md={4} lg={4}>
                  <FormGroup>
                    <Col componentClass={ControlLabel} xs={12} sm={8} md={8} lg={8}>
                      Flight Mode
                    </Col>
                    <Col xs={12} sm={4} md={4} lg={4}>
                      <FormControl.Static>
                        {this.state.HeartBeat.mode}
                      </FormControl.Static>
                    </Col>
                  </FormGroup>
                </Col>
              </Form>
            </Row>
            <Row>
              <Form horizontal>
                <Col xs={6} sm={6} md={4} lg={4}>
                  <FormGroup>
                    <Col componentClass={ControlLabel} xs={12} sm={8} md={8} lg={8}>
                      Voltage{'  '}<span className="fa fa-battery fa-lg" aria-hidden="true" />
                    </Col>
                    <Col xs={12} sm={4} md={4} lg={4}>
                      <FormControl.Static>
                        {this.state.BatStatus.voltage} V
                      </FormControl.Static>
                    </Col>
                  </FormGroup>
                </Col>
                <Col xs={6} sm={6} md={4} lg={4}>
                  <FormGroup>
                    <Col componentClass={ControlLabel} xs={12} sm={8} md={8} lg={8}>
                      <div>
                        <span style={{ verticalAlign: 'middle' }}>Current </span>
                        <span style={{ verticalAlign: 'middle' }} className="fa fa-flash fa-lg" aria-hidden="true" />
                      </div>
                    </Col>
                    <Col xs={12} sm={4} md={4} lg={4}>
                      <FormControl.Static>
                        {this.state.BatStatus.amper} A/h
                      </FormControl.Static>
                    </Col>
                  </FormGroup>
                </Col>
              </Form>
            </Row>
            <Row>
              <Col xs={12} sm={12} md={12} lg={12}>
                <h5>Remaining Battery</h5>
                <ProgressBar bsStyle="success" now={this.state.BatStatus.remaining} />
              </Col>
            </Row>
          </Col>
          <Col xs={12} sm={6} md={6} lg={6}>
            <MissionMap
              location={this.props.project && this.props.project.mapLocation}
              mission={this.props.mission}
              height="80vh"
            />
          </Col>
        </Row>
      </div>);
  }
}


MissionFlight.propTypes = {
  mission: PropTypes.object.isRequired,
  project: PropTypes.object.isRequired,
};

export default MissionFlight;
