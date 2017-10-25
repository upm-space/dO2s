import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { Button, Row, Col } from 'react-bootstrap';
import MissionMap from '../MissionMap/MissionMap';

class PreFlightTOL extends Component {
  componentDidMount() {
    this.props.getPath(this.props.match.path.split('/').pop());
  }

  render() {
    const {
      mission, project, match, history,
    } = this.props;
    return (
      <div className="TOL">
        <h4>Fix Take Off and Landing Points. Set Landing path.</h4>
        <Row>
          <Col xs={12} sm={3} md={3} lg={3}>
            <Row>
              <Col xs={12} sm={12} md={12} lg={12}>
                <Button block>Set Take Off Point</Button>
              </Col>
            </Row>
            <br />
            <Row>
              <Col xs={12} sm={12} md={12} lg={12}>
                <Button block>Set Landing Point</Button>
              </Col>
            </Row>
            <br />
            <Row>
              <Col xs={12} sm={12} md={12} lg={12}>
                <Button block>Set Landing Path</Button>
              </Col>
            </Row>
            <br />
            <Row>
              <Col xs={12} sm={12} md={12} lg={12}>
                <Button block>Send Waypoints</Button>
              </Col>
            </Row>
            <br />
            <Row>
              <Col xs={12} sm={12} md={12} lg={12}>
                <Button block>Read Waypoints</Button>
              </Col>
            </Row>
            <br />
            <Row>
              <Col xs={12} sm={12} md={12} lg={12}>
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
            <MissionMap
              location={project && project.mapLocation}
              mission={mission}
              height="70vh"
            />
          </Col>
        </Row>
      </div>
    );
  }
}
PreFlightTOL.propTypes = {
  mission: PropTypes.object.isRequired,
  project: PropTypes.object.isRequired,
  match: PropTypes.object.isRequired,
  history: PropTypes.object.isRequired,
  getPath: PropTypes.func.isRequired,
};

export default PreFlightTOL;
