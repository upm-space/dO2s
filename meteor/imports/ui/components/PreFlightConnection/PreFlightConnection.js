import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { Button, Row, Col, ProgressBar, FormGroup, Form, ControlLabel, FormControl } from 'react-bootstrap';

import WebSocketTelemetry from '../../../modules/flight-telemetry';
import WidgetAltimeter from '../FlightWidgets/WidgetAltimeter';
import WidgetAttitude from '../FlightWidgets/WidgetAttitude';
import WidgetAirSpeed from '../FlightWidgets/WidgetAirSpeed';

class PreFlightConnection extends Component {
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
  }

  componentDidMount() {
    this.props.getPath(this.props.match.path.split('/').pop());
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
  }

  componentWillUnmount() {
    this.client.closeWebService();
  }

  render() {
    const {
      mission, project, match, history,
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
      <div className="PreFlightConnection">
        <h4>Establish the Connection with the RPA</h4>
        <Row>
          <Col xs={12} sm={8} md={8} lg={8}>
            <Button
              bsStyle={this.state.connStatus ? 'primary' : 'default'}
              block
              bsSize="large"
              onClick={() => this.client.connectToServer()}
            >
              {this.state.connStatus ? 'Connected' : 'No Conection'}
            </Button>
          </Col>
          <Col xs={12} sm={4} md={4} lg={4}>
            <Button
              bsStyle={this.state.noData ? 'warning' : 'info'}
              block
              bsSize="large"
            >
              {this.state.noData ? 'No Data' : 'Data ON'}
            </Button>
          </Col>
        </Row>
        <br />
        <Row>
          <Col xs={4} sm={4} md={3} lg={3}>
            <WidgetAttitude
              id="wAttitude"
              pitchProp={this.state.attitudeData.pitchRead}
              rollProp={this.state.attitudeData.rollRead}
            />
          </Col>
          <Col xs={4} sm={4} md={3} lg={3}>
            <WidgetAirSpeed id="wAirSpeed" speedProp={this.state.VFRData.airspeed} />
          </Col>
          <Col xs={4} sm={4} md={3} lg={3}>
            <WidgetAltimeter id="wAltimeter" altitudeProp={altimeterValue} />
          </Col>
          <Col xs={12} sm={12} md={3} lg={3}>
            <Form horizontal>
              <Col xs={4} sm={4} md={12} lg={12}>
                <FormGroup>
                  <Col componentClass={ControlLabel} xs={12} sm={8} md={8} lg={8}>
                    Current Waypoint
                  </Col>
                  <Col xs={12} sm={4} md={4} lg={4}>
                    <FormControl.Static>
                      {this.state.currentWP.lastWp}
                    </FormControl.Static>
                  </Col>
                </FormGroup>
              </Col>
              <Col xs={4} sm={4} md={12} lg={12}>
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
              <Col xs={4} sm={4} md={12} lg={12}>
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
          </Col>
        </Row>
        <Row>
          <Col xs={12} sm={12} md={12} lg={12}>
            <h5>Remaining Battery</h5>
            <ProgressBar bsStyle="success" now={this.state.BatStatus.remaining} />
          </Col>
        </Row>
        <Row>
          <Form horizontal>
            <Col xs={6} sm={6} md={4} lg={4}>
              <FormGroup>
                <Col componentClass={ControlLabel} xs={12} sm={8} md={8} lg={8}>
                  Voltage
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
                  Current
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
            <Button
              bsStyle="success"
              onClick={() => history.push(`/projects/${match.params.project_id}/${match.params.mission_id}/preflight/tol`)}
            >
          To Path Preflight
            </Button>
          </Col>
        </Row>
      </div>
    );
  }
}

PreFlightConnection.propTypes = {
  mission: PropTypes.object.isRequired,
  project: PropTypes.object.isRequired,
  match: PropTypes.object.isRequired,
  history: PropTypes.object.isRequired,
  getPath: PropTypes.func.isRequired,
};

export default PreFlightConnection;
