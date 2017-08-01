import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { Route, Redirect } from 'react-router-dom';

const handleClick = () => {
    Meteor.call( 'sendVerificationLink', ( error, response ) => {
      if ( error ) {
        Bert.alert( error.reason, 'danger' );
      } else {
        let email = Meteor.user().emails[ 0 ].address;
        Bert.alert( `Verification sent to ${ email }!`, 'success' );
      }
    });
}

const AdminPage = ({ loggingIn, authenticated, isAdmin, component, ...rest }) => (
  <Route {...rest} render={(props) => {
    if (loggingIn) return <div></div>;
    if (authenticated){
        if (Meteor.user().emails[0].verified){
            if (isAdmin) {
                return React.createElement(component, { ...props, loggingIn, authenticated, isAdmin});
            } else {
                return <Redirect to="/one" />;
            }
        } else {
            return (
                <Alert bsStyle="warning">
                    <p>You need to verify your email address before using dO2s.</p>
                    <Button bsStyle="link" onClick={() => handleClick()}>Resend Verification Link</Button>
                </Alert>);
            }
    } else {
        return <Redirect to="/login" />;
    }
    }}
     />
);

AdminPage.PropTypes = {
  loggingIn: PropTypes.bool,
  authenticated: PropTypes.bool,
  isAdmin: PropTypes.bool,
  component: PropTypes.func,
};

export default AdminPage;
