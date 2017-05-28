import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { createContainer } from 'meteor/react-meteor-data';
import Navigation from '../components/Navigation';
import { Grid } from 'react-bootstrap';


const App = ( {children} ) => (
    <div className="App">
        <Navigation />
        <Grid fluid>
            {children}
        </Grid>
    </div>
);

export default App;

//
// App.propTypes = {
//   loggingIn: PropTypes.bool,
//   authenticated: PropTypes.bool,
//   children: PropTypes.node,
// };
//
// export default createContainer((props) => {
//     const loggingIn = Meteor.loggingIn();
//     const authenticated = !loggingIn && !!Meteor.userId();
//     return {
//         loggingIn: loggingIn,
//         authenticated: authenticated,
//         children: props.children,
//     };
// }, App);
