
import React from 'react';
import PropTypes from 'prop-types';
import { NavDropdown, MenuItem, NavItem, Nav } from 'react-bootstrap';
import { LinkContainer } from 'react-router-bootstrap';
import { matchPath, withRouter } from 'react-router-dom';

const isProject = (location) => {
  const match = matchPath(location.pathname, {
    path: '/projects/:project_id',
  });

  if (match && match.params && match.params.project_id && match.params.project_id !== 'new') {
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
      <NavItem eventKey={5} href={`/projects/${match.params.project_id}`}><i className="fa fa-map-marker fa-lg" aria-hidden="true" /> Current Project</NavItem>
    </LinkContainer> : null);
};

const UserMngButton = (
  <LinkContainer to="/users">
    <NavItem eventKey={3} href="/users">
      <span className="fa fa-users" aria-hidden="true" /> User Manager
    </NavItem>
  </LinkContainer>);

const hangarDropdownTitle = (
  <div className="pull-left">
    <span className="fa fa-paper-plane" aria-hidden="true" /> Hangar
  </div>
);

const AuthenticatedNavigation = ({
  isAdmin, name, location, history,
}) => (
  <div>
    <Nav>
      <LinkContainer to="/projects">
        <NavItem eventKey={1} href="/projects">
          <span className="fa fa-map" aria-hidden="true" /> Projects
        </NavItem>
      </LinkContainer>
      {isProject(location) ? ProjectButton(location) : ''}

      <NavDropdown
        eventKey={2}
        title={hangarDropdownTitle}
        id="hangar-dropdown"
      >
        <LinkContainer to="/hangar/rpas">
          <NavItem eventKey={2.1} href="/hangar/rpas">RPAs</NavItem>
        </LinkContainer>
        <LinkContainer to="/hangar/payloads">
          <NavItem eventKey={2.2} href="/hangar/payloads">Payloads</NavItem>
        </LinkContainer>
        <LinkContainer to="/hangar/batteries">
          <NavItem eventKey={2.3} href="/hangar/batteries">Batteries</NavItem>
        </LinkContainer>
      </NavDropdown>
      {isAdmin ? UserMngButton : ''}
    </Nav>
    <Nav pullRight>
      <NavDropdown eventKey={4} title={name} id="user-nav-dropdown">
        <LinkContainer to="/profile">
          <NavItem eventKey={4.1} href="/profile">Profile</NavItem>
        </LinkContainer>
        <MenuItem divider />
        <MenuItem eventKey={4.2} onClick={() => history.push('/logout')}>Logout</MenuItem>
      </NavDropdown>
    </Nav>
  </div>
);

AuthenticatedNavigation.propTypes = {
  name: PropTypes.string.isRequired,
  isAdmin: PropTypes.bool.isRequired,
  location: PropTypes.object.isRequired,
  history: PropTypes.object.isRequired,
};

export default withRouter(AuthenticatedNavigation);
