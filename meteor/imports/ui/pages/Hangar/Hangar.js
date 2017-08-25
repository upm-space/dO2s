import React from 'react';
import PropTypes from 'prop-types';
import { NavItem, Nav } from 'react-bootstrap';
import { LinkContainer } from 'react-router-bootstrap';
import { Redirect } from 'react-router-dom';

import RPAs from '../../components/RPAs/RPAs';
import Payloads from '../../components/Payloads/Payloads';
import Batteries from '../../components/Batteries/Batteries';
import NotFound from '../NotFound/NotFound';

import NewRPA from '../NewRPA/NewRPA';
import ViewRPA from '../ViewRPA/ViewRPA';
import EditRPA from '../EditRPA/EditRPA';
import NewPayload from '../NewPayload/NewPayload';
import ViewPayload from '../ViewPayload/ViewPayload';
import EditPayload from '../EditPayload/EditPayload';
import NewBattery from '../NewBattery/NewBattery';
import ViewBattery from '../ViewBattery/ViewBattery';
import EditBattery from '../EditBattery/EditBattery';

const handleHangarNav = (match, history) => {
  console.log(match.path);
  if (match.path === '/hangar/rpas') {
    return <RPAs match={match} history={history} />;
  } else if (match.path === '/hangar/rpas/new') {
    return <NewRPA match={match} history={history} />;
  } else if (match.path === '/hangar/rpas/:rpa_id') {
    return <ViewRPA match={match} history={history} />;
  } else if (match.path === '/hangar/rpas/:rpa_id/edit') {
    return <EditRPA match={match} history={history} />;
  } else if (match.path === '/hangar/payloads') {
    return <Payloads match={match} history={history} />;
  } else if (match.path === '/hangar/payloads/new') {
    return <NewPayload match={match} history={history} />;
  } else if (match.path === '/hangar/payloads/:payload_id') {
    return <ViewPayload match={match} history={history} />;
  } else if (match.path === '/hangar/payloads:payload_id/edit') {
    return <EditPayload match={match} history={history} />;
  } else if (match.path === '/hangar/batteries') {
    return <Batteries match={match} history={history} />;
  } else if (match.path === '/hangar/batteries/new') {
    return <NewBattery match={match} history={history} />;
  } else if (match.path === '/hangar/batteries/:battery_id') {
    return <ViewBattery match={match} history={history} />;
  } else if (match.path === '/hangar/batteries/:battery_id/edit') {
    return <EditBattery match={match} history={history} />;
  } else if (match.path === '/hangar') {
    return <Redirect to={'/hangar/rpas'} />;
  }
  return <NotFound />;
};


const Hangar = ({ match, history }) => (
  <div className="Hangar">
    <div className="page-header clearfix">
      <Nav bsStyle="pills" justified activeKey={1}>
        <LinkContainer to="/hangar/rpas">
          <NavItem eventKey={1} href="/hangar/rpas">RPAs</NavItem>
        </LinkContainer>
        <LinkContainer to="/hangar/payloads">
          <NavItem eventKey={2} title="/hangar/payloads">Payloads</NavItem>
        </LinkContainer>
        <LinkContainer to="/hangar/batteries">
          <NavItem eventKey={3} href="/hangar/batteries">Batteries</NavItem>
        </LinkContainer>
      </Nav>
    </div>
    {handleHangarNav(match, history)}
  </div>
);

Hangar.propTypes = {
  match: PropTypes.object.isRequired,
  history: PropTypes.object.isRequired,
};

export default Hangar;
