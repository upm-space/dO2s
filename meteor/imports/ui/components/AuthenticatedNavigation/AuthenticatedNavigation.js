import React from 'react';
import PropTypes from 'prop-types';
import { NavDropdown, MenuItem, NavItem, Glyphicon, Nav } from 'react-bootstrap';
import { LinkContainer } from 'react-router-bootstrap';
import { Meteor } from 'meteor/meteor';

const handleLogout = () => Meteor.logout();

const UserMngButton = (isAdmin) => {
  if (isAdmin) {
    return (
      <LinkContainer to="/usrmng">
        <NavItem eventKey={3} href="/usrmng"><Glyphicon glyph="user" />User Manager</NavItem>
      </LinkContainer>
    );
  }
};

const AuthenticatedNavigation = ({ isAdmin, name }) => (
  <div>
    <Nav>
      <LinkContainer to="/projects">
        <NavItem eventKey={1} href="/projects">Projects</NavItem>
      </LinkContainer>
      <LinkContainer to="/hangar">
        <NavItem eventKey={2} href="/hangar">Hangar</NavItem>
      </LinkContainer>
      {UserMngButton(isAdmin)}
    </Nav>
    <Nav pullRight>
      <NavDropdown eventKey={4} title={name} id="user-nav-dropdown">
        <LinkContainer to="/profile">
          <NavItem eventKey={4.1} href="/profile">Profile</NavItem>
        </LinkContainer>
        <MenuItem divider />
        <MenuItem eventKey={4.2} onClick={handleLogout}>Logout</MenuItem>
      </NavDropdown>
    </Nav>
  </div>
);

AuthenticatedNavigation.propTypes = {
  name: PropTypes.string.isRequired,
  isAdmin: PropTypes.bool.isRequired,
};

export default AuthenticatedNavigation;
