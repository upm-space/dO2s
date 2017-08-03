/* eslint-disable max-len, consistent-return */
import React from 'react';
import PropTypes from 'prop-types';
import { Route, Redirect } from 'react-router-dom';
import { Alert, Button } from 'react-bootstrap';
import { Meteor } from 'meteor/meteor';
import { Bert } from 'meteor/themeteorchef:bert';

const sendVerificationEmail = (emailAddress) => {
  Meteor.call('users.sendVerificationEmail', (error) => {
    if (error) {
      Bert.alert(error.reason, 'danger');
    } else {
      Bert.alert(`Verification sent to ${emailAddress}!`, 'success');
    }
  });
};

const verifyEmailAlert = emailAddress => (<Alert bsStyle="warning">
  <p>Hey friend! Can you <strong>verify your email address</strong> ({emailAddress}) for us?
    <Button
      bsStyle="link"
      onClick={() => sendVerificationEmail(emailAddress)}
      href="#"
    >
    Re-send verification email
  </Button>
  </p>
</Alert>);

const Authenticated = ({ loggingIn, authenticated, component, userId, emailVerified, emailAddress, ...rest }) => (
  <Route
    {...rest}
    render={(props) => {
      if (authenticated) {
        if (userId && !emailVerified) {
          return verifyEmailAlert(emailAddress);
        } else if (userId && emailVerified) {
          return React.createElement(component, { ...props, loggingIn, authenticated });
        }
      } else {
        return <Redirect to="/logout" />;
      }
    }}
  />
);

Authenticated.propTypes = {
  loggingIn: PropTypes.bool.isRequired,
  authenticated: PropTypes.bool.isRequired,
  isAdmin: PropTypes.bool.isRequired,
  userId: PropTypes.string,
  emailAddress: PropTypes.string,
  emailVerified: PropTypes.bool.isRequired,
  component: PropTypes.func.isRequired,
};

export default Authenticated;
