import React from 'react';
import PropTypes from 'prop-types';
import { ButtonToolbar, ButtonGroup, Button, Row, Col, Form, FormGroup, FormControl, ControlLabel } from 'react-bootstrap';
import NotFound from '../../pages/NotFound/NotFound';

const MissionPayloadParameters = (payload, history) => (payload && payload.deleted === 'no' ? (
  <div className="Payload Parameters">
    <div className="page-header clearfix">
      <h4 className="pull-left">
        { payload && payload.name } ({ payload && payload.model }) Parameters
      </h4>
      <ButtonToolbar className="pull-right">
        <ButtonGroup bsSize="small">
          <Button onClick={() => history.push(`/hangar/payloads/${payload._id}/edit`)}>Edit</Button>
        </ButtonGroup>
      </ButtonToolbar>
    </div>
    <Row>
      <Form horizontal>
        <Col xs={12} sm={6} mdOffset={2} md={4} lgOffset={2} lg={4}>
          <legend>General Data</legend>
          <FormGroup>
            <Col componentClass={ControlLabel} xs={12} sm={6} md={6} lg={6}>
            Model
            </Col>
            <Col xs={12} sm={6} md={6} lg={6}>
              <FormControl.Static>
                {payload && payload.model}
              </FormControl.Static>
            </Col>
          </FormGroup>
          <FormGroup>
            <Col componentClass={ControlLabel} xs={12} sm={6} md={6} lg={6}>
            Registration Number
            </Col>
            <Col xs={12} sm={6} md={6} lg={6}>
              <FormControl.Static>
                {payload && payload.registrationNumber}
              </FormControl.Static>
            </Col>
          </FormGroup>
          <FormGroup>
            <Col componentClass={ControlLabel} xs={12} sm={6} md={6} lg={6}>
            Payload Type
            </Col>
            <Col xs={12} sm={6} md={6} lg={6}>
              <FormControl.Static>
                {payload && payload.payloadType}
              </FormControl.Static>
            </Col>
          </FormGroup>
          <FormGroup>
            <Col componentClass={ControlLabel} xs={12} sm={6} md={6} lg={6}>
            Weight
            </Col>
            <Col xs={12} sm={6} md={6} lg={6}>
              <FormControl.Static>
                {(payload && payload.weight) !== undefined ? (payload.weight === 0 ? '-' : payload.weight) : ''} (g)
              </FormControl.Static>
            </Col>
          </FormGroup>
        </Col>
        <Col xs={12} sm={6} md={4} lg={4} >
          <legend>Sensor Parameters</legend>
          <FormGroup>
            <Col componentClass={ControlLabel} xs={12} sm={6} md={6} lg={6}>
            Focal Length
            </Col>
            <Col xs={12} sm={6} md={6} lg={6}>
              <FormControl.Static>
                {payload && payload.sensorParameters.focalLength} (mm)
              </FormControl.Static>
            </Col>
          </FormGroup>
          <FormGroup>
            <Col componentClass={ControlLabel} xs={12} sm={6} md={6} lg={6}>
            Sensor Width
            </Col>
            <Col xs={12} sm={6} md={6} lg={6}>
              <FormControl.Static>
                {payload && payload.sensorParameters.sensorWidth} (mm)
              </FormControl.Static>
            </Col>
          </FormGroup>
          <FormGroup>
            <Col componentClass={ControlLabel} xs={12} sm={6} md={6} lg={6}>
            Sensor Height
            </Col>
            <Col xs={12} sm={6} md={6} lg={6}>
              <FormControl.Static>
                {payload && payload.sensorParameters.sensorHeight} (mm)
              </FormControl.Static>
            </Col>
          </FormGroup>
          <FormGroup>
            <Col componentClass={ControlLabel} xs={12} sm={6} md={6} lg={6}>
            Image Height
            </Col>
            <Col xs={12} sm={6} md={6} lg={6}>
              <FormControl.Static>
                {payload && payload.sensorParameters.imageHeight} (px)
              </FormControl.Static>
            </Col>
          </FormGroup>
          <FormGroup>
            <Col componentClass={ControlLabel} xs={12} sm={6} md={6} lg={6}>
            Image Width
            </Col>
            <Col xs={12} sm={6} md={6} lg={6}>
              <FormControl.Static>
                {payload && payload.sensorParameters.imageWidth} (px)
              </FormControl.Static>
            </Col>
          </FormGroup>
        </Col>
      </Form>
    </Row>
  </div>
) : <NotFound />);

MissionPayloadParameters.propTypes = {
  payload: PropTypes.object,
  history: PropTypes.object.isRequired,
  mission: PropTypes.object.isRequired,
};

export default MissionPayloadParameters;
