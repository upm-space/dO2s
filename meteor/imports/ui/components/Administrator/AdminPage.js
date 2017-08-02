import React from 'react';
import PropTypes from 'prop-types';
import { Route, Redirect } from 'react-router-dom';
import { Alert, Button } from 'react-bootstrap';
import { Meteor } from 'meteor/meteor';
import { Bert } from 'meteor/themeteorchef:bert';

const sendVerificationEmail = (emailAddress) => {
    Meteor.call( 'users.sendVerificationEmail', (error) => {
        if (error) {
            Bert.alert(error.reason, 'danger');
        } else {
            Bert.alert( `Verification sent to ${ emailAddress }!`, 'success' );
        }
    });
};

const AdminPage = ({loggingIn, authenticated, isAdmin, component, userId, emailAddress, emailVerified, ...rest }) => (
  <Route {...rest} render={props => {
    if (authenticated){
        if (userId && !emailVerified) {
            return (
            <Alert bsStyle="warning"><p>Hey friend! Can you <strong>verify your email address</strong> ({emailAddress}) for us? <Button bsStyle="link" onClick={() => sendVerificationEmail(emailAddress)} href="#">Re-send verification email</Button></p>
        </Alert>);
        } else if (userId && emailVerified) {
            if (isAdmin) {
                return React.createElement(component, { ...props, loggingIn, authenticated, isAdmin});
            } else {
                return <Redirect to="/projects"/>;
            }
        }
    } else {
        return <Redirect to="/logout" />;
    }
    }}
     />
);

AdminPage.PropTypes = {
  loggingIn: PropTypes.bool,
  authenticated: PropTypes.bool,
  isAdmin: PropTypes.bool,
  component: PropTypes.func,
  userId: PropTypes.func.isRequired,
  emailAddress: PropTypes.bool.isRequired,
  emailVerified: PropTypes.bool.isRequired,
};

export default AdminPage;
