import React, { Component } from 'react';
import { Session } from 'meteor/session';
import PropTypes from 'prop-types';
import { Button, Row, Col, ProgressBar } from 'react-bootstrap';

import WebSocketTelemetry from '../../../modules/flight-telemetry';
import WidgetAltimeter from '../FlightWidgets/WidgetAltimeter';
import WidgetAttitude from '../FlightWidgets/WidgetAttitude';
import WidgetAirSpeed from '../FlightWidgets/WidgetAirSpeed';

class PreFlightConnection extends Component {
  constructor(props) {
    super(props);
    this.state = {
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
        mode: 0,
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
    if (!Session.get('client')) {
      const client = new WebSocketTelemetry();
      Session.set('client', client);

      client.on('connStatus', (msg) => {
        this.setState({ connStatus: msg.status });
      });

      client.on('attitudeData', (attData) => {
        console.log('emited event');
        console.log(attData);
        this.setState({ attitudeData: attData });
      });

      client.on('GPSData', (gpsData) => {
        this.setState({ GPSData: gpsData });
      });

      client.on('VFRData', (vfrData) => {
        this.setState({ VFRData: vfrData });
      });

      client.on('HeartBeat', (hearbeatData) => {
        this.setState({ HeartBeat: hearbeatData });
      });

      client.on('BatStatus', (batStatus) => {
        this.setState({ BatStatus: batStatus });
      });

      client.on('currentWP', (wpData) => {
        this.setState({ currentWP: wpData });
      });

      client.on('distToWp', (wpData) => {
        this.setState({ distToWp: wpData });
      });
    }
  }

  render() {
    const {
      mission, project, match, history,
    } = this.props;
    console.log('state data');
    console.log(this.state.attitudeData);
    return (
      <div className="PreFlightConnection">
        <h4>Establish the Connection with the RPA</h4>
        <Row>
          <Col xsOffset={0} xs={12} smOffset={3} sm={6} mdOffset={3} md={6} lgOffset={3} lg={6}>
            <Button
              bsStyle={this.state.connStatus ? 'success' : 'danger'}
              block
              bsSize="large"
            >
              {this.state.connStatus ? 'Connected' : 'No Conection'}
            </Button>
          </Col>
        </Row>
        <br />
        <Row>
          <Col xs={4} sm={4} md={4} lg={4}>
            <WidgetAttitude
              id="wAttitude"
              pitchProp={this.state.attitudeData.pitchRead}
              rollProp={this.state.attitudeData.pitchRead}
            />
          </Col>
          <Col xs={4} sm={4} md={4} lg={4}>
            <WidgetAirSpeed id="wAirSpeed" speedProp={this.state.VFRData.airspeed} />
          </Col>
          <Col xs={4} sm={4} md={4} lg={4}>
            <WidgetAltimeter id="wAltimeter" altitudeProp={this.state.GPSData.altRead} />
          </Col>
        </Row>
        <Row>
          <Col xs={12} sm={6} md={6} lg={6}>
            <h5>Current Waypoint</h5>
            <p>{this.state.currentWP.lastWp}</p>
          </Col>
          <Col xs={12} sm={6} md={6} lg={6}>
            <h5>Distance to Next Waypoint</h5>
            <p>{this.state.distToWp.distToWp}</p>
          </Col>
        </Row>
        <Row>
          <Col xs={12} sm={6} md={6} lg={6}>
            <h5>Mode ?? Que es esto ??</h5>
            <p>{this.state.HeartBeat.mode}</p>
          </Col>
        </Row>
        <Row>
          <Col xs={12} sm={12} md={12} lg={12}>
            <h5>Battery</h5>
            <ProgressBar bsStyle="success" now={this.state.BatStatus.voltage} />
          </Col>
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
