import React from 'react';
import PropTypes from 'prop-types';
import { withTracker } from 'meteor/react-meteor-data';
import { Meteor } from 'meteor/meteor';
import Payloads from '../../../api/Payloads/Payloads';
import PayloadEditor from '../../components/PayloadEditor/PayloadEditor';
import NotFound from '../NotFound/NotFound';

const EditPayload = ({ payload, history, match }) => (payload ? (
  <div className="EditPayload">
    <h4 className="page-header">{`Editing "${payload.name}"`}</h4>
    <PayloadEditor payload={payload} history={history} match={match} />
  </div>
) : <NotFound />);

EditPayload.defaultProps = {
  payload: {},
};

EditPayload.propTypes = {
  payload: PropTypes.object,
  history: PropTypes.object.isRequired,
  match: PropTypes.object.isRequired,
};

export default withTracker(({ match }) => {
  const payloadId = match.params.payload_id;
  const subscription = Meteor.subscribe('payloads.view', payloadId);
  return {
    loading: !subscription.ready(),
    payload: Payloads.findOne(payloadId),
  };
})(EditPayload);
