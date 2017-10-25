import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { Button, Row, Col, ProgressBar } from 'react-bootstrap';
import WidgetAltimeter from '../FlightWidgets/WidgetAltimeter';
import WidgetAttitude from '../FlightWidgets/WidgetAttitude';
import WidgetAirSpeed from '../FlightWidgets/WidgetAirSpeed';

class PreFlightConnection extends Component {
  componentDidMount() {
    this.props.getPath(this.props.match.path.split('/').pop());
  }

  render() {
    const {
      mission, project, match, history,
    } = this.props;
    return (
      <div className="Connection">
        <h4>Establish the Connection with the RPA</h4>
        <Row>
          <Col xs={12} sm={12} md={12} lg={12}>
            <Button bsStyle="primary">
          Connect
            </Button>
          </Col>
        </Row>
        <Row>
          <Col xs={4} sm={4} md={4} lg={4}>
            <WidgetAttitude instSize="200" id="wAltimeter" pitchProp={10} rollProp={45} />
          </Col>
          <Col xs={4} sm={4} md={4} lg={4}>
            <WidgetAirSpeed instSize="200" id="wAirSpeed" speedProp={10} />
          </Col>
          <Col xs={4} sm={4} md={4} lg={4}>
            <WidgetAltimeter instSize="200" id="wAltimeter" altitudeProp={50} />
          </Col>
        </Row>
        <Row>
          <h5>Battery</h5>
          <Col xs={12} sm={12} md={12} lg={12}>
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
