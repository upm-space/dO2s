import React from 'react';
import PropTypes from 'prop-types';
import { Navbar } from 'react-bootstrap';
import { Link, withRouter } from 'react-router-dom';


import AuthenticatedNavigation from '../AuthenticatedNavigation/AuthenticatedNavigation';
import PublicNavigation from '../PublicNavigation/PublicNavigation';

const Navigation = props => (
  <Navbar collapseOnSelect fluid>
    <Navbar.Header>
      <Navbar.Brand>
        <Link to="/">dO2s</Link>
      </Navbar.Brand>
      <Navbar.Toggle />
    </Navbar.Header>
    <Navbar.Collapse>
      {props.authenticated ?
        <AuthenticatedNavigation isAdmin={props.isAdmin} {...props} /> :
        <PublicNavigation />}
    </Navbar.Collapse>
  </Navbar>
);

Navigation.defaultProps = {
  name: '',
};

Navigation.propTypes = {
  authenticated: PropTypes.bool.isRequired,
  isAdmin: PropTypes.bool.isRequired,
};

export default withRouter(Navigation);
