import React from 'react';
import PropTypes from 'prop-types';
import { ButtonToolbar, ButtonGroup, Button, Row, Col } from 'react-bootstrap';
import { createContainer } from 'meteor/react-meteor-data';
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
      <Col xs={12} sm={3}>
        { battery && battery.description }
      </Col>
      <Col xs={12} sm={9} />
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

export default createContainer(({ match }) => {
  const batteryId = match.params.battery_id;
  const subscription = Meteor.subscribe('batteries.view', batteryId);

  return {
    loading: !subscription.ready(),
    battery: Batteries.findOne(batteryId),
  };
}, ViewBattery);
