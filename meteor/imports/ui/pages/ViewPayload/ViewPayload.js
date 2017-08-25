import React from 'react';
import PropTypes from 'prop-types';
import { ButtonToolbar, ButtonGroup, Button, Row, Col } from 'react-bootstrap';
import { createContainer } from 'meteor/react-meteor-data';
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
      <Col xs={12} sm={3}>
        { payload && payload.description }
      </Col>
      <Col xs={12} sm={9} />
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

export default createContainer(({ match }) => {
  const payloadId = match.params.payload_id;
  const subscription = Meteor.subscribe('payloads.view', payloadId);

  return {
    loading: !subscription.ready(),
    payload: Payloads.findOne(payloadId),
  };
}, ViewPayload);
