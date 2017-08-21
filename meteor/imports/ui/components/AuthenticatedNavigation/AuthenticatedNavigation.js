
import React from 'react';
import PropTypes from 'prop-types';
import { NavDropdown, MenuItem, NavItem, Nav } from 'react-bootstrap';
import { LinkContainer } from 'react-router-bootstrap';
import { Meteor } from 'meteor/meteor';
import { matchPath } from 'react-router-dom';

const handleLogout = () => Meteor.logout();

const isProject = (location) => {
  const match = matchPath(location.pathname, {
    path: '/projects/:project_id',
  });

  if (match && match.params && match.params.hasOwnProperty('project_id') && match.params.project_id !== 'new') {
    return true;
  }
  return false;
};

const ProjectButton = (location) => {
  const match = matchPath(location.pathname, {
    path: '/projects/:project_id',
  });
  return (match.params.project_id ?
    <LinkContainer to={`/projects/${match.params.project_id}`}>
      <NavItem eventKey={5} href={`/projects/${match.params.project_id}`}> Current Project</NavItem>
    </LinkContainer> : null);
};

const UserMngButton = (<LinkContainer to="/users">
  <NavItem eventKey={3} href="/users">
    <i className="fa fa-users" aria-hidden="true" /> User Manager
  </NavItem>
</LinkContainer>);

const AuthenticatedNavigation = ({ isAdmin, name, location }) => (
  <div>
    <Nav>
      <LinkContainer to="/projects">
        <NavItem eventKey={1} href="/projects">
          <i className="fa fa-map" aria-hidden="true" /> Projects</NavItem>
      </LinkContainer>
      {isProject(location) ? ProjectButton(location) : ''}
      <LinkContainer to="/hangar">
        <NavItem eventKey={2} href="/hangar">
          <i className="fa fa-paper-plane" aria-hidden="true" /> Hangar</NavItem>
      </LinkContainer>
      {isAdmin ? UserMngButton : ''}
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
  location: PropTypes.object.isRequired,
};

export default AuthenticatedNavigation;
