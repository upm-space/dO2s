import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { Button, Row, Col } from 'react-bootstrap';

class PreFlightChecks extends Component {
  componentDidMount() {
    this.props.getPath(this.props.match.path.split('/').pop());
  }

  render() {
    const {
      mission, project, match, history,
    } = this.props;
    return (
      <div className="PreFlight">
        <h4>Check all Systems before Flight</h4>
        <Row>
          <Col xs={12} sm={12} md={12} lg={12}>
            <Button bsStyle="primary">
          Pitot
            </Button>
          </Col>
        </Row>
        <br />
        <Row>
          <Col xs={12} sm={12} md={12} lg={12}>
            <Button bsStyle="primary">
          Ailrons
            </Button>
          </Col>
        </Row>
        <br />
        <Row>
          <Col xs={12} sm={12} md={12} lg={12}>
            <Button bsStyle="primary">
          IMU
            </Button>
          </Col>
        </Row>
        <br />
        <Row>
          <Col xs={12} sm={12} md={12} lg={12}>
            <Button bsStyle="primary">
          Compass
            </Button>
          </Col>
        </Row>
        <br />
        <Row>
          <Col xs={12} sm={12} md={12} lg={12}>
            <Button bsStyle="primary">
          Battery Voltage and Amperes
            </Button>
          </Col>
        </Row>
        <br />
        <Row>
          <Col xs={12} sm={12} md={12} lg={12}>
            <Button bsStyle="danger">
          ARM
            </Button>
          </Col>
        </Row>
        <br />
        <Row>
          <Col xs={12} sm={12} md={12} lg={12}>
            <Button
              bsStyle="success"
              onClick={() => history.push(`/projects/${match.params.project_id}/${match.params.mission_id}/flight`)}
            >
          Go to Flight
            </Button>
          </Col>
        </Row>
      </div>
    );
  }
}

PreFlightChecks.propTypes = {
  mission: PropTypes.object.isRequired,
  project: PropTypes.object.isRequired,
  match: PropTypes.object.isRequired,
  history: PropTypes.object.isRequired,
  getPath: PropTypes.func.isRequired,
};

export default PreFlightChecks;
