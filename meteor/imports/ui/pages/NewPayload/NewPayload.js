import React from 'react';
import PropTypes from 'prop-types';
import PayloadEditor from '../../components/PayloadEditor/PayloadEditor';

const NewPayload = ({ history, match }) => (
  <div className="NewPayload">
    <h4 className="page-header">New Payload</h4>
    <PayloadEditor history={history} match={match} />
  </div>
);

NewPayload.propTypes = {
  history: PropTypes.object.isRequired,
  match: PropTypes.object.isRequired,
};

export default NewPayload;
