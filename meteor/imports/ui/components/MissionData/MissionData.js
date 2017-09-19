import React from 'react';
import PropTypes from 'prop-types';
import { Row, Col, Form, FormGroup, FormControl, ControlLabel } from 'react-bootstrap';

import './MissionData.scss';

const renderMissionData = (mission, misionData) => ((mission &&
  mission.flightPlan &&
  mission.flightPlan.missionCalculation &&
  mission.flightPlan.missionCalculation.missionCalculatedData &&
  mission.flightPlan.missionCalculation.missionCalculatedData[misionData]) ? mission.flightPlan.missionCalculation.missionCalculatedData[misionData] : '-');

const MissionData = ({ mission }) => (
  <div className="MissionData" >
    <Row>
      <Form horizontal>
        <Col xs={12} sm={4} md={4} lg={4}>
          <FormGroup>
            <Col componentClass={ControlLabel} xs={12} sm={8} md={8} lg={8}>
            Total Path Length
            </Col>
            <Col xs={12} sm={4} md={4} lg={4}>
              <FormControl.Static>
                {renderMissionData(mission, 'pathLength')} m
              </FormControl.Static>
            </Col>
          </FormGroup>
          <FormGroup>
            <Col componentClass={ControlLabel} xs={12} sm={8} md={8} lg={8}>
            Mission Area
            </Col>
            <Col xs={12} sm={4} md={4} lg={4}>
              <FormControl.Static>
                {renderMissionData(mission, 'totalArea')} ha
              </FormControl.Static>
            </Col>
          </FormGroup>
          <FormGroup>
            <Col componentClass={ControlLabel} xs={12} sm={8} md={8} lg={8}>
            Ground Resolution
            </Col>
            <Col xs={12} sm={4} md={4} lg={4}>
              <FormControl.Static>
                {renderMissionData(mission, 'resolution')} cm/px
              </FormControl.Static>
            </Col>
          </FormGroup>
        </Col>
        <Col xs={12} sm={4} md={4} lg={4} >
          <FormGroup>
            <Col componentClass={ControlLabel} xs={12} sm={8} md={8} lg={8}>
            Flight Speed
            </Col>
            <Col xs={12} sm={4} md={4} lg={4}>
              <FormControl.Static>
                {(mission && mission.flightPlan &&
                 mission.flightPlan.flightParameters &&
                 mission.flightPlan.flightParameters.speed) ? mission.flightPlan.flightParameters.speed : '-'} (m/s)
              </FormControl.Static>
            </Col>
          </FormGroup>
          <FormGroup>
            <Col componentClass={ControlLabel} xs={12} sm={8} md={8} lg={8}>
            Altitude
            </Col>
            <Col xs={12} sm={4} md={4} lg={4}>
              <FormControl.Static>
                {(mission && mission.flightPlan &&
                 mission.flightPlan.flightParameters &&
                 mission.flightPlan.flightParameters.altitude) ? mission.flightPlan.flightParameters.altitude : '-'} (m)
              </FormControl.Static>
            </Col>
          </FormGroup>
          <FormGroup>
            <Col componentClass={ControlLabel} xs={12} sm={8} md={8} lg={8}>
            Flight Time
            </Col>
            <Col xs={12} sm={4} md={4} lg={4}>
              <FormControl.Static>
                {renderMissionData(mission, 'flightTime')} (min)
              </FormControl.Static>
            </Col>
          </FormGroup>
        </Col>
        <Col xs={12} sm={4} md={4} lg={4} >
          <FormGroup>
            <Col componentClass={ControlLabel} xs={12} sm={8} md={8} lg={8}>
            Distance betweem Photos
            </Col>
            <Col xs={12} sm={4} md={4} lg={4}>
              <FormControl.Static>
                ?? (m)
              </FormControl.Static>
            </Col>
          </FormGroup>
          <FormGroup>
            <Col componentClass={ControlLabel} xs={12} sm={8} md={8} lg={8}>
            Time Between Photos
            </Col>
            <Col xs={12} sm={4} md={4} lg={4}>
              <FormControl.Static>
                {renderMissionData(mission, 'shootTime')} (s)
              </FormControl.Static>
            </Col>
          </FormGroup>
        </Col>
      </Form>
    </Row>
  </div>
);

MissionData.propTypes = {
  mission: PropTypes.object.isRequired,
};

export default MissionData;
