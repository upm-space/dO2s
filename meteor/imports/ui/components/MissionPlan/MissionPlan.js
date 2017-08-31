import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { Button, Row, Col, ButtonToolbar } from 'react-bootstrap';
import MapComponent from '../MapComponent/MapComponent';
import WayPointList from '../WayPointList/WayPointList';

import './MissionPlan.scss';

class MissionPlan extends Component {
  constructor(props) {
    super(props);
    this.state = {
      showWayPoints: false,
    };
  }


  render() {
    const { project, mission } = this.props;
    return (
      <div className="MissionPlan">
        <Row>
          <Col xs={12} sm={3} md={3} lg={3}>
            <ButtonToolbar>
              <Button bsStyle="primary" >
                <div><i className="fa fa-arrow-circle-up fa-lg" aria-hidden="true" /></div>
                <div>Take Off <br /> Point</div>
              </Button>
              <Button bsStyle="primary" >
                <div><i className="fa fa-arrow-circle-down fa-lg" aria-hidden="true" /></div>
                <div>Landing <br /> Point</div>
              </Button>
              <Button bsStyle="primary" >
                <div><i className="fa fa-paint-brush fa-lg" aria-hidden="true" /></div>
                <div>Define <br />Area</div>
              </Button>
            </ButtonToolbar>
            <br />
            <ButtonToolbar>
              <Button bsStyle="success" >
                <div><i className="fa fa-superpowers fa-lg" aria-hidden="true" /></div>
                <div>Draw Mission</div>
              </Button>
              <Button bsStyle="success" >
                <div><i className="fa fa-rotate-right fa-lg" aria-hidden="true" /></div>
                <div>Change Mission Direction</div>
              </Button>
              <Button bsStyle="success" >
                <div><i className="fa fa-long-arrow-up fa-lg" aria-hidden="true" /></div>
                <div>Get WPS Altitude</div>
              </Button>
            </ButtonToolbar>
            <br />
            <ButtonToolbar>
              <Button bsStyle="info" >
                <div><i className="fa fa-paper-plane fa-lg" aria-hidden="true" /></div>
                <div>Flight Parameters</div>
              </Button>
              <Button bsStyle="info" >
                <div><i className="fa fa-camera fa-lg" aria-hidden="true" /></div>
                <div>Payload Parameters</div></Button>
              <Button bsStyle="info" >
                <div><i className="fa fa-picture-o fa-lg" aria-hidden="true" /></div>
                <div>Picture Grid</div></Button>
            </ButtonToolbar>
            <br />
            <ButtonToolbar>
              <Button
                bsStyle="primary"
                onClick={() => this.setState({ showWayPoints: !this.state.showWayPoints })}
                active={this.state.showWayPoints}
              >
                <div><i className="fa fa-map-marker fa-lg" aria-hidden="true" /></div>
                <div>Show WayPoints</div></Button>
              <Button bsStyle="primary" >
                <div><i className="fa fa-bullseye fa-lg" aria-hidden="true" /></div>
                <div>Show Mission Data</div></Button>
            </ButtonToolbar>
            <br />
            <ButtonToolbar>
              <Button bsStyle="danger" >
                <div><i className="fa fa-trash fa-lg" aria-hidden="true" /></div>
                <div>Clear WayPoints</div></Button>
            </ButtonToolbar>
            <br />
            <ButtonToolbar>
              <Button bsStyle="default" >
                <div><i className="fa fa-download fa-lg" aria-hidden="true" /></div>
                <div>Export Mission</div></Button>
              <Button bsStyle="default" >
                <div><i className="fa fa-upload fa-lg" aria-hidden="true" /></div>
                <div>Import Mission</div></Button>

            </ButtonToolbar>
            <br />
            <ButtonToolbar>
              <Button bsStyle="default" >
                <div><i className="fa fa-square-o fa-lg" aria-hidden="true" /></div>
                <div>Perimeter KML</div></Button>
              <Button bsStyle="default" >
                <div><i className="fa fa-map fa-lg" aria-hidden="true" /></div>
                <div>Mission KML</div></Button>
            </ButtonToolbar>
          </Col>
          <Col xs={12} sm={9} md={9} lg={9}>
            <MapComponent
              location={project && project.mapLocation}
              height="80vh"
              onLocationChange={() => {}}
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
