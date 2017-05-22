import React from 'react';
import { LinkContainer } from 'react-router-bootstrap';
import { Nav, NavItem } from 'react-bootstrap';

const PublicNavigation = () => (
  <Nav pullRight>
    <LinkContainer to="/signup">
      <NavItem eventKey={ 1 }>Sign Up</NavItem>
    </LinkContainer>
    <LinkContainer to="/login">
      <NavItem eventKey={ 2 }>Log In</NavItem>
    </LinkContainer>
  </Nav>
);

export default PublicNavigation;
