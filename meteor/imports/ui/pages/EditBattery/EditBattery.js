import React from 'react';
import PropTypes from 'prop-types';
import { createContainer } from 'meteor/react-meteor-data';
import { Meteor } from 'meteor/meteor';
import Batteries from '../../../api/Batteries/Batteries';
import BatteryEditor from '../../components/BatteryEditor/BatteryEditor';
import NotFound from '../NotFound/NotFound';

const EditBattery = ({ battery, history, match }) => (battery ? (
  <div className="EditBattery">
    <h4 className="page-header">{`Editing "${battery.name}"`}</h4>
    <BatteryEditor battery={battery} history={history} match={match} />
  </div>
) : <NotFound />);

EditBattery.defaultProps = {
  battery: {},
};

EditBattery.propTypes = {
  battery: PropTypes.object,
  history: PropTypes.object.isRequired,
  match: PropTypes.object.isRequired,
};

export default createContainer(({ match }) => {
  const batteryId = match.params.battery_id;
  const subscription = Meteor.subscribe('batteries.view', batteryId);
  return {
    loading: !subscription.ready(),
    battery: Batteries.findOne(batteryId),
  };
}, EditBattery);
