import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { LinkContainer } from 'react-router-bootstrap';
import { Navbar, Button, NavItem, Nav } from 'react-bootstrap';

const PublicNavigation = () => (
    <Navbar collapseOnSelect fluid>
        <Navbar.Header>
            <Navbar.Brand>
                <LinkContainer to="/">
                    <Button bsStyle="link">dO2s</Button>
                </LinkContainer>
            </Navbar.Brand>
            <Navbar.Toggle />
        </Navbar.Header>
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
    </Navbar>
);


export default PublicNavigation;
