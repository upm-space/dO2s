import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { Grid } from 'react-bootstrap';
import AppNavigation from '../components/AppNavigation';

const App = (props) => (
    <div className="App">
        <AppNavigation {...props} />
        <Grid fluid>
            {props.children}
        </Grid>
    </div>
);

App.PropTypes = {
  authenticated: PropTypes.bool,
  children: PropTypes.node,
  isAdmin:  PropTypes.bool
};

export default App;
