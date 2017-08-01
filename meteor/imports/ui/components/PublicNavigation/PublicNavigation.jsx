import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { LinkContainer } from 'react-router-bootstrap';
import { Navbar, NavItem, Nav } from 'react-bootstrap';

const PublicNavigation = () => (
    <Navbar.Collapse>
        <Nav pullRight>
            <LinkContainer to="/signup">
            <NavItem eventKey={1}>Sign Up</NavItem>
            </LinkContainer>
            <LinkContainer to="/login">
            <NavItem eventKey={2}>Log In</NavItem>
            </LinkContainer>
        </Nav>
    </Navbar.Collapse>
);

export default PublicNavigation;
