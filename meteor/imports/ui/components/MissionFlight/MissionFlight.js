import React from 'react';
import PropTypes from 'prop-types';
import { Button, Row, Col, ProgressBar, ButtonGroup } from 'react-bootstrap';
import WidgetAirSpeed from '../FlightWidgets/WidgetAirSpeed.js';
import WidgetAltimeter from '../FlightWidgets/WidgetAltimeter.js';
import WidgetAttitude from '../FlightWidgets/WidgetAttitude.js';
import MissionMap from '../MissionMap/MissionMap';

class MissionFlight extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      speed: 10,
    };
  }

  render() {
    return (
      <div className="MissionFlight container-fluid">
        <Row>
          <Col xs={12} sm={6} md={4} lg={4}>
            <Row>
              <Col xs={12} sm={12} md={6} lg={6}>
                <Button bsStyle="primary">Connected</Button>
                {' '}
                <Button bsStyle="danger">Armed</Button>
              </Col>
            </Row>
            <Row>
              <Col xs={12} sm={12} md={12} lg={12}>
                <h5>Modos de Vuelo</h5>
                <ButtonGroup>
                  <Button>AUTO</Button>
                  <Button>MANUAL</Button>
                  <Button>LOITER</Button>
                </ButtonGroup>
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
              <Col xs={12} sm={12} md={12} lg={12}>
                <h5>Battery</h5>
                <ProgressBar bsStyle="success" now={10} />
              </Col>
            </Row>
          </Col>
          <Col xs={12} sm={6} md={8} lg={8}>
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
