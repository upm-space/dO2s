import React from 'react';
import PropTypes from 'prop-types';
import { ButtonToolbar, ButtonGroup, Button, Row, Col, Form, FormGroup, FormControl, ControlLabel } from 'react-bootstrap';
import { withTracker } from 'meteor/react-meteor-data';
import { Meteor } from 'meteor/meteor';
import { Bert } from 'meteor/themeteorchef:bert';
import Payloads from '../../../api/Payloads/Payloads';
import NotFound from '../NotFound/NotFound';
import Loading from '../../components/Loading/Loading';

const handleRemove = (payloadId, history) => {
  if (confirm('Move to Trash?')) {
    Meteor.call('payloads.softDelete', payloadId, (error) => {
      if (error) {
        Bert.alert(error.reason, 'danger');
      } else {
        Bert.alert('Payload deleted!', 'warning');
        history.push('/payloads');
      }
    });
  }
};

const renderPayload = (payload, match, history) => (payload && payload.deleted === 'no' ? (
  <div className="ViewPayload">
    <div className="page-header clearfix">
      <h4 className="pull-left">{ payload && payload.name }</h4>
      <ButtonToolbar className="pull-right">
        <ButtonGroup bsSize="small">
          <Button onClick={() => history.push(`${match.url}/edit`)}>Edit</Button>
          <Button onClick={() => handleRemove(payload._id, history)} className="text-danger">
            Delete
          </Button>
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

const ViewPayload = ({ loading, payload, match, history }) => (
  !loading ? renderPayload(payload, match, history) : <Loading />
);

ViewPayload.propTypes = {
  loading: PropTypes.bool.isRequired,
  payload: PropTypes.object,
  match: PropTypes.object.isRequired,
  history: PropTypes.object.isRequired,
};

export default withTracker(({ match }) => {
  const payloadId = match.params.payload_id;
  const subscription = Meteor.subscribe('payloads.view', payloadId);

  return {
    loading: !subscription.ready(),
    payload: Payloads.findOne(payloadId),
  };
})(ViewPayload);
