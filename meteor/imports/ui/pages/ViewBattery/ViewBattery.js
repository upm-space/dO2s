import React from 'react';
import PropTypes from 'prop-types';
import { ButtonToolbar, ButtonGroup, Button, Row, Col, FormGroup, Form, ControlLabel, FormControl } from 'react-bootstrap';
import { withTracker } from 'meteor/react-meteor-data';
import { Meteor } from 'meteor/meteor';
import { Bert } from 'meteor/themeteorchef:bert';
import Batteries from '../../../api/Batteries/Batteries';
import NotFound from '../NotFound/NotFound';
import Loading from '../../components/Loading/Loading';

const handleRemove = (batteryId, history) => {
  if (confirm('Move to Trash?')) {
    Meteor.call('batteries.softDelete', batteryId, (error) => {
      if (error) {
        Bert.alert(error.reason, 'danger');
      } else {
        Bert.alert('Battery deleted!', 'warning');
        history.push('/batteries');
      }
    });
  }
};

const renderBattery = (battery, match, history) => (battery && battery.deleted === 'no' ? (
  <div className="ViewBattery">
    <div className="page-header clearfix">
      <h4 className="pull-left">{ battery && battery.name }</h4>
      <ButtonToolbar className="pull-right">
        <ButtonGroup bsSize="small">
          <Button onClick={() => history.push(`${match.url}/edit`)}>Edit</Button>
          <Button onClick={() => handleRemove(battery._id, history)} className="text-danger">
            Delete
          </Button>
        </ButtonGroup>
      </ButtonToolbar>
    </div>
    <Row>
      <Form horizontal>
        <Col xs={12} sm={6} mdOffset={2} md={4} lgOffset={3} lg={3}>
          <FormGroup>
            <Col componentClass={ControlLabel} xs={12} sm={6} md={6} lg={6}>
            Model
            </Col>
            <Col xs={12} sm={6} md={6} lg={6}>
              <FormControl.Static>
                {battery && battery.model}
              </FormControl.Static>
            </Col>
          </FormGroup>
          <FormGroup>
            <Col componentClass={ControlLabel} xs={12} sm={6} md={6} lg={6}>
            Registration Number
            </Col>
            <Col xs={12} sm={6} md={6} lg={6}>
              <FormControl.Static>
                {battery && battery.registrationNumber}
              </FormControl.Static>
            </Col>
          </FormGroup>
          <FormGroup>
            <Col componentClass={ControlLabel} xs={12} sm={6} md={6} lg={6}>
            Amperes
            </Col>
            <Col xs={12} sm={6} md={6} lg={6}>
              <FormControl.Static>
                {battery && battery.amperes} (A)
              </FormControl.Static>
            </Col>
          </FormGroup>
          <FormGroup>
            <Col componentClass={ControlLabel} xs={12} sm={6} md={6} lg={6}>
            Cell Number
            </Col>
            <Col xs={12} sm={6} md={6} lg={6}>
              <FormControl.Static>
                {battery && battery.cellNumber}
              </FormControl.Static>
            </Col>
          </FormGroup>
          <FormGroup>
            <Col componentClass={ControlLabel} xs={12} sm={6} md={6} lg={6}>
            Weight
            </Col>
            <Col xs={12} sm={6} md={6} lg={6}>
              <FormControl.Static>
                {(battery && battery.weight) !== undefined ? (battery.weight === 0 ? '-' : battery.weight) : ''} (g)
              </FormControl.Static>
            </Col>
          </FormGroup>
        </Col>
      </Form>
      <form>
        <Col xs={12} sm={6} md={4} lg={3} >
          <FormGroup>
            <ControlLabel>Log Data Here</ControlLabel>
            <FormControl.Static>
                Lorem ipsum dolor sit amet, consectetur adipisicing elit. Quis repellendus ipsum,
                nisi fuga impedit unde nobis itaque dicta autem quod alias illo veritatis commodi
                possimus earum, hic iusto repudiandae nulla?
            </FormControl.Static>
          </FormGroup>
        </Col>
      </form>
    </Row>
  </div>
) : <NotFound />);

const ViewBattery = ({ loading, battery, match, history }) => (
  !loading ? renderBattery(battery, match, history) : <Loading />
);

ViewBattery.propTypes = {
  loading: PropTypes.bool.isRequired,
  battery: PropTypes.object,
  match: PropTypes.object.isRequired,
  history: PropTypes.object.isRequired,
};

export default withTracker(({ match }) => {
  const batteryId = match.params.battery_id;
  const subscription = Meteor.subscribe('batteries.view', batteryId);

  return {
    loading: !subscription.ready(),
    battery: Batteries.findOne(batteryId),
  };
})(ViewBattery);
