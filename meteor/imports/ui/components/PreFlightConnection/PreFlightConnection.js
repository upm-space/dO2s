import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { Button, Row, Col, ProgressBar } from 'react-bootstrap';
import WidgetAltimeter from '../FlightWidgets/WidgetAltimeter';
import WidgetAttitude from '../FlightWidgets/WidgetAttitude';
import WidgetAirSpeed from '../FlightWidgets/WidgetAirSpeed';

class PreFlightConnection extends Component {
  componentDidMount() {
    const myMatch = this.props.match.path;
    console.log(myMatch.split('/').pop());
    this.props.getPath(this.props.match.path.split('/').pop());
  }

  render() {
    const {
      mission, project, match, history,
    } = this.props;
    return (
      <div className="PreFlightConnection">
        <h4>Establish the Connection with the RPA</h4>
        <Row>
          <Col xsOffset={0} xs={12} smOffset={3} sm={6} mdOffset={3} md={6} lgOffset={3} lg={6}>
            <Button
              bsStyle="primary"
              block
              bsSize="large"
              >
          Connect
            </Button>
          </Col>
        </Row>
        <br/>
        <Row>
          <Col xs={4} sm={4} md={4} lg={4}>
            <WidgetAttitude id="wAltimeter" pitchProp={30} rollProp={45} />
          </Col>
          <Col xs={4} sm={4} md={4} lg={4}>
            <WidgetAirSpeed id="wAirSpeed" speedProp={10} />
          </Col>
          <Col xs={4} sm={4} md={4} lg={4}>
            <WidgetAltimeter id="wAltimeter" altitudeProp={50} />
          </Col>
        </Row>
        <Row>
          <Col xs={12} sm={12} md={12} lg={12}>
            <h5>Battery</h5>
            <ProgressBar bsStyle="success" now={10} />
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
