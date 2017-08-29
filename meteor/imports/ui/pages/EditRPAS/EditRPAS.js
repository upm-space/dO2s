import React from 'react';
import PropTypes from 'prop-types';
import { createContainer } from 'meteor/react-meteor-data';
import { Meteor } from 'meteor/meteor';
import RPAS from '../../../api/RPAS/RPAS';
import RPASEditor from '../../components/RPASEditor/RPASEditor';
import NotFound from '../NotFound/NotFound';

const EditRPAS = ({ rpas, history, match }) => (rpas ? (
  <div className="EditRPAS">
    <h4 className="page-header">{`Editing "${rpas.name}"`}</h4>
    <RPASEditor rpas={rpas} history={history} match={match} />
  </div>
) : <NotFound />);

EditRPAS.defaultProps = {
  rpas: {},
};

EditRPAS.propTypes = {
  rpas: PropTypes.object,
  history: PropTypes.object.isRequired,
  match: PropTypes.object.isRequired,
};

export default createContainer(({ match }) => {
  const rpasId = match.params.rpas_id;
  const subscription = Meteor.subscribe('rpas.view', rpasId);
  return {
    loading: !subscription.ready(),
    rpas: RPAS.findOne(rpasId),
  };
}, EditRPAS);
