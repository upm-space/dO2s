import React from 'react';
import PropTypes from 'prop-types';
import { Row, Col, Form, FormGroup, FormControl, ControlLabel } from 'react-bootstrap';

import './MissionData.scss';

const MissionData = () => (
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
                10 m
              </FormControl.Static>
            </Col>
          </FormGroup>
          <FormGroup>
            <Col componentClass={ControlLabel} xs={12} sm={8} md={8} lg={8}>
            Mission Area
            </Col>
            <Col xs={12} sm={4} md={4} lg={4}>
              <FormControl.Static>
                10 ha
              </FormControl.Static>
            </Col>
          </FormGroup>
          <FormGroup>
            <Col componentClass={ControlLabel} xs={12} sm={8} md={8} lg={8}>
            Ground Resolution
            </Col>
            <Col xs={12} sm={4} md={4} lg={4}>
              <FormControl.Static>
                2.94 cm/px
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
                20 (m/s)
              </FormControl.Static>
            </Col>
          </FormGroup>
          <FormGroup>
            <Col componentClass={ControlLabel} xs={12} sm={8} md={8} lg={8}>
            Altitude
            </Col>
            <Col xs={12} sm={4} md={4} lg={4}>
              <FormControl.Static>
                120 (m)
              </FormControl.Static>
            </Col>
          </FormGroup>
          <FormGroup>
            <Col componentClass={ControlLabel} xs={12} sm={8} md={8} lg={8}>
            Flight Time
            </Col>
            <Col xs={12} sm={4} md={4} lg={4}>
              <FormControl.Static>
                 00: 41 (min)
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
                23.34 (m)
              </FormControl.Static>
            </Col>
          </FormGroup>
          <FormGroup>
            <Col componentClass={ControlLabel} xs={12} sm={8} md={8} lg={8}>
            Time Between Photos
            </Col>
            <Col xs={12} sm={4} md={4} lg={4}>
              <FormControl.Static>
                1.223 (s)
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
