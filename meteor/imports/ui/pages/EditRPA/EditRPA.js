import React from 'react';
import PropTypes from 'prop-types';
import { createContainer } from 'meteor/react-meteor-data';
import { Meteor } from 'meteor/meteor';
import RPAs from '../../../api/RPAs/RPAs';
import RPAEditor from '../../components/RPAEditor/RPAEditor';
import NotFound from '../NotFound/NotFound';

const EditRPA = ({ rpa, history, match }) => (rpa ? (
  <div className="EditRPA">
    <h4 className="page-header">{`Editing "${rpa.name}"`}</h4>
    <RPAEditor rpa={rpa} history={history} match={match} />
  </div>
) : <NotFound />);

EditRPA.defaultProps = {
  rpa: {},
};

EditRPA.propTypes = {
  rpa: PropTypes.object,
  history: PropTypes.object.isRequired,
  match: PropTypes.object.isRequired,
};

export default createContainer(({ match }) => {
  const rpaId = match.params.rpa_id;
  const subscription = Meteor.subscribe('rpas.view', rpaId);
  return {
    loading: !subscription.ready(),
    rpa: RPAs.findOne(rpaId),
  };
}, EditRPA);
