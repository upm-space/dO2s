import React from 'react';
import PropTypes from 'prop-types';
import RPASEditor from '../../components/RPASEditor/RPASEditor';

const NewRPAS = ({ history, match }) => (
  <div className="NewRPAS">
    <h4 className="page-header">New RPAS</h4>
    <RPASEditor history={history} match={match} />
  </div>
);

NewRPAS.propTypes = {
  history: PropTypes.object.isRequired,
  match: PropTypes.object.isRequired,
};

export default NewRPAS;
