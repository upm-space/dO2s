import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { NavLink } from 'react-router-dom';
import { Navbar, Button, Nav, NavItem, NavDropdown, MenuItem, Image, Glyphicon } from 'react-bootstrap';
import { LinkContainer } from 'react-router-bootstrap';
import { LoginButtons } from 'meteor/okgrow:accounts-ui-react';

const Navigation = () => (
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
        <Nav>
            <LinkContainer to="/" exact>
                  <NavItem eventKey={1}><Glyphicon glyph="home"/> <b>HOME</b></NavItem>
            </LinkContainer>
            <LinkContainer to="/usrmng">
                  <NavItem eventKey={2}><Glyphicon glyph="user"/><b>USER MNG</b></NavItem>
            </LinkContainer>
            <LinkContainer to="/one">
                  <NavItem eventKey={3}><b>ONE</b></NavItem>
            </LinkContainer>
            <LinkContainer to="/two">
                  <NavItem eventKey={4}><b>TWO</b></NavItem>
            </LinkContainer>
            <NavItem><LoginButtons /></NavItem>
            <NavDropdown eventKey={5} title="Dropdown" id="basic-nav-dropdown">
                <MenuItem eventKey={5.1}>Action</MenuItem>
                <MenuItem eventKey={5.2}>Another action</MenuItem>
                <MenuItem eventKey={5.3}>Something else here</MenuItem>
                <MenuItem divider />
                <MenuItem eventKey={5.3}>Separated link</MenuItem>
            </NavDropdown>
        </Nav>
        {/* <Nav pullRight>
            <div className="centerBlock">
                FIXME error when passing down active prop to div
                <LinkContainer to="/" exact>
                    <NavItem eventKey={1}>
                        <Image bsClass="logo img" src="/img/svg/ipsilum-light.svg" responsive/>
                    </NavItem>
                </LinkContainer>
            </div>
        </Nav> */}
        </Navbar.Collapse>
    </Navbar>
);


export default Navigation;