import React from 'react';
import PropTypes from 'prop-types';
import { Route, Switch } from 'react-router-dom';

import PreFlightCheckList from '../../components/PreFlightCheckList/PreFlightCheckList';
import MissionFlightComp from '../../components/MissionFlight/MissionFlight';
import NotFound from '../NotFound/NotFound';

const MissionFlight = ({ mission, project }) => (
  <div className="MissionFlight">
    <Switch>
      <Route
        exact
        path="/projects/:project_id/:mission_id/flight"
        render={props => (<MissionFlightComp mission={mission} project={project} {...props} />)}
      />
      <Route
        path="/projects/:project_id/:mission_id/preflight"
        render={props => (<PreFlightCheckList mission={mission} project={project} {...props} />)}
      />
      <Route component={NotFound} />
    </Switch>
  </div>
);

MissionFlight.propTypes = {
  mission: PropTypes.object.isRequired,
  project: PropTypes.object.isRequired,
};

export default MissionFlight;
