import React, { Component } from 'react';
import PropTypes from 'prop-types';
import Navigation from '../components/Navigation';
import PublicNavigation from '../components/PublicNavigation';
import { Grid } from 'react-bootstrap';

const renderNavigation = (authenticated, isAdmin) =>
(authenticated ? <Navigation isAdmin={isAdmin} /> : <PublicNavigation />);


const App = ( {children, authenticated, isAdmin} ) => (
    <div className="App">
        { renderNavigation(authenticated, isAdmin) }
        <Grid fluid>
            {children}
        </Grid>
    </div>
);

App.PropTypes = {
  authenticated: PropTypes.bool,
  children: PropTypes.node,
  isAdmin:  PropTypes.bool
};

export default App;
