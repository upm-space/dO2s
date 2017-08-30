import React from 'react';
import PropTypes from 'prop-types';
import BatteryEditor from '../../components/BatteryEditor/BatteryEditor';

const NewBattery = ({ history, match }) => (
  <div className="NewBattery">
    <h4 className="page-header">New Battery</h4>
    <BatteryEditor history={history} match={match} />
  </div>
);

NewBattery.propTypes = {
  history: PropTypes.object.isRequired,
  match: PropTypes.object.isRequired,
};

export default NewBattery;
