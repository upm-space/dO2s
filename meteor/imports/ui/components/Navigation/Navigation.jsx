import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { Navbar, NavDropdown, MenuItem, NavItem, Glyphicon, Nav } from 'react-bootstrap';
import { LinkContainer } from 'react-router-bootstrap';

const handleLogout = () => Meteor.logout();

const userName = () => {
    const user = Meteor.user();
    const name = user && user.profile ? user.profile.name : '';
    if (typeof name === "string"){
        return user ? `${name}` : '';
    } else {
        return user ? `${name.first} ${name.last}` : '';
    }
};

const UserMngButton = (isAdmin) => {
    if (isAdmin) {
        return (
            <LinkContainer to="/usrmng">
                  <NavItem eventKey={3}><Glyphicon glyph="user"/> User Manager</NavItem>
            </LinkContainer>
        )
    }
}

const Navigation = ({isAdmin}) => (
    <Navbar.Collapse>
        <Nav>
            <LinkContainer to="/one">
                  <NavItem eventKey={1}>Projects</NavItem>
            </LinkContainer>
            <LinkContainer to="/two">
                  <NavItem eventKey={2}>Missions</NavItem>
            </LinkContainer>
            {UserMngButton(isAdmin)}
        </Nav>
        <Nav pullRight>
            <NavDropdown eventKey={ 6 } title={ userName() } id="basic-nav-dropdown">
                <MenuItem eventKey={ 6.1 }>Change Password</MenuItem>
                <MenuItem eventKey={ 6.2 } onClick={ handleLogout }>Logout</MenuItem>
            </NavDropdown>
        </Nav>
    </Navbar.Collapse>
);

export default Navigation;
