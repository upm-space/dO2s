/* eslint-disable max-len, no-nested-ternary */
import React from 'react';
import PropTypes from 'prop-types';
import { ButtonToolbar, ButtonGroup, Button, Row, Col, Form, FormControl, ControlLabel, FormGroup } from 'react-bootstrap';
import { withTracker } from 'meteor/react-meteor-data';
import { monthDayYear } from '@cleverbeagle/dates';
import { Meteor } from 'meteor/meteor';
import { Bert } from 'meteor/themeteorchef:bert';
import RPAs from '../../../api/RPAs/RPAs';
import NotFound from '../NotFound/NotFound';
import Loading from '../../components/Loading/Loading';

const handleRemove = (rpaId, history) => {
  Meteor.call('rpas.softDelete', rpaId, (error) => {
    if (error) {
      Bert.alert(error.reason, 'danger');
    } else {
      Bert.alert('RPA deleted!', 'warning');
      history.push('/hangar/rpas');
    }
  });
};

const renderRPA = (rpa, match, history) => (rpa && rpa.deleted === 'no' ? (
  <div className="ViewRPA">
    <div className="page-header clearfix">
      <h4 className="pull-left">{ rpa && rpa.name }</h4>
      <ButtonToolbar className="pull-right">
        <ButtonGroup bsSize="small">
          <Button onClick={() => history.push(`${match.url}/edit`)}>Edit</Button>
          <Button onClick={() => handleRemove(rpa._id, history)} className="text-danger">
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
                {rpa && rpa.model}
              </FormControl.Static>
            </Col>
          </FormGroup>
          <FormGroup>
            <Col componentClass={ControlLabel} xs={12} sm={6} md={6} lg={6}>
            Registration Number
            </Col>
            <Col xs={12} sm={6} md={6} lg={6}>
              <FormControl.Static>
                {rpa && rpa.registrationNumber}
              </FormControl.Static>
            </Col>
          </FormGroup>
          <FormGroup>
            <Col componentClass={ControlLabel} xs={12} sm={6} md={6} lg={6}>
            Construction Date
            </Col>
            <Col xs={12} sm={6} md={6} lg={6}>
              <FormControl.Static>
                {monthDayYear(rpa && rpa.constructionDate)}
              </FormControl.Static>
            </Col>
          </FormGroup>
          <FormGroup>
            <Col componentClass={ControlLabel} xs={12} sm={6} md={6} lg={6}>
            Serial Number
            </Col>
            <Col xs={12} sm={6} md={6} lg={6}>
              <FormControl.Static>
                {rpa && rpa.serialNumber}
              </FormControl.Static>
            </Col>
          </FormGroup>
          <FormGroup>
            <Col componentClass={ControlLabel} xs={12} sm={6} md={6} lg={6}>
            Weight
            </Col>
            <Col xs={12} sm={6} md={6} lg={6}>
              <FormControl.Static>
                {(rpa && rpa.weight) !== undefined ? (rpa.weight === 0 ? '-' : rpa.weight) : ''} (g)
              </FormControl.Static>
            </Col>
          </FormGroup>
          <FormGroup>
            <Col componentClass={ControlLabel} xs={12} sm={6} md={6} lg={6}>
            RPA Type
            </Col>
            <Col xs={12} sm={6} md={6} lg={6}>
              <FormControl.Static>
                {rpa && rpa.rpaType}
              </FormControl.Static>
            </Col>
          </FormGroup>
        </Col>
        <Col xs={12} sm={6} md={4} lg={4} >
          <legend>Flight Parameters</legend>
          <FormGroup>
            <Col componentClass={ControlLabel} xs={12} sm={6} md={6} lg={6}>
            Max Descend Slope
            </Col>
            <Col xs={12} sm={6} md={6} lg={6}>
              <FormControl.Static>
                {(rpa && rpa.flightParameters.maxDescendSlope) !== undefined ? (rpa.flightParameters.maxDescendSlope === 0 ? '-' : rpa.flightParameters.maxDescendSlope) : ''} (%)
              </FormControl.Static>
            </Col>
          </FormGroup>
          <FormGroup>
            <Col componentClass={ControlLabel} xs={12} sm={6} md={6} lg={6}>
            Max Ascend Slope
            </Col>
            <Col xs={12} sm={6} md={6} lg={6}>
              <FormControl.Static>
                {(rpa && rpa.flightParameters.maxAscendSlope) !== undefined ? (rpa.flightParameters.maxAscendSlope === 0 ? '-' : rpa.flightParameters.maxAscendSlope) : ''} (%)
              </FormControl.Static>
            </Col>
          </FormGroup>
          <FormGroup>
            <Col componentClass={ControlLabel} xs={12} sm={6} md={6} lg={6}>
            Optimal Landing Slope
            </Col>
            <Col xs={12} sm={6} md={6} lg={6}>
              <FormControl.Static>
                {(rpa && rpa.flightParameters.optimalLandingSlope) !== undefined ? (rpa.flightParameters.optimalLandingSlope === 0 ? '-' : rpa.flightParameters.optimalLandingSlope) : ''} (%)
              </FormControl.Static>
            </Col>
          </FormGroup>
          <FormGroup>
            <Col componentClass={ControlLabel} xs={12} sm={6} md={6} lg={6}>
            Optimal Take Off Slope
            </Col>
            <Col xs={12} sm={6} md={6} lg={6}>
              <FormControl.Static>
                {(rpa && rpa.flightParameters.optimalTakeOffSlope) !== undefined ? (rpa.flightParameters.optimalTakeOffSlope === 0 ? '-' : rpa.flightParameters.optimalTakeOffSlope) : ''} (%)
              </FormControl.Static>
            </Col>
          </FormGroup>
          <FormGroup>
            <Col componentClass={ControlLabel} xs={12} sm={6} md={6} lg={6}>
            Max Landing Speed
            </Col>
            <Col xs={12} sm={6} md={6} lg={6}>
              <FormControl.Static>
                {(rpa && rpa.flightParameters.maxLandSpeed) !== undefined ? (rpa.flightParameters.maxLandSpeed === 0 ? '-' : rpa.flightParameters.maxLandSpeed) : ''} (cm/s)
              </FormControl.Static>
            </Col>
          </FormGroup>
        </Col>
      </Form>
    </Row>

  </div>
) : <NotFound />);

const ViewRPA = ({
  loading, rpa, match, history,
}) => (
  !loading ? renderRPA(rpa, match, history) : <Loading />
);

ViewRPA.propTypes = {
  loading: PropTypes.bool.isRequired,
  rpa: PropTypes.object,
  match: PropTypes.object.isRequired,
  history: PropTypes.object.isRequired,
};

export default withTracker(({ match }) => {
  const rpaId = match.params.rpa_id;
  const subscription = Meteor.subscribe('rpas.view', rpaId);

  return {
    loading: !subscription.ready(),
    rpa: RPAs.findOne(rpaId),
  };
})(ViewRPA);
