import React from 'react';
import PropTypes from 'prop-types';
import RPAEditor from '../../components/RPAEditor/RPAEditor';

const NewRPA = ({ history, match }) => (
  <div className="NewRPA">
    <h4 className="page-header">New RPA</h4>
    <RPAEditor history={history} match={match} />
  </div>
);

NewRPA.propTypes = {
  history: PropTypes.object.isRequired,
  match: PropTypes.object.isRequired,
};

export default NewRPA;
