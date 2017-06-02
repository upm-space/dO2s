import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { Navbar, Button } from 'react-bootstrap';
import { LinkContainer } from 'react-router-bootstrap';
import Navigation from './Navigation';
import PublicNavigation from './PublicNavigation';

const renderNavigation = (authenticated, isAdmin) =>
(authenticated ? <Navigation isAdmin={isAdmin} /> : <PublicNavigation />);

const AppNavigation = ({authenticated, isAdmin}) => (
    <Navbar collapseOnSelect fluid>
        <Navbar.Header>
            <Navbar.Brand>
                <LinkContainer to="/" exact>
                    <Button bsStyle="link">dO2s</Button>
                </LinkContainer>
            </Navbar.Brand>
            <Navbar.Toggle />
        </Navbar.Header>
        { renderNavigation(authenticated, isAdmin) }
    </Navbar>
);

export default AppNavigation;
