/* eslint-disable max-len, consistent-return */
import React from 'react';
import PropTypes from 'prop-types';
import { Route, Redirect } from 'react-router-dom';
import { Alert, Button } from 'react-bootstrap';
import { Meteor } from 'meteor/meteor';
import { Bert } from 'meteor/themeteorchef:bert';

const sendVerificationEmail = (emailAddress) => {
  Meteor.call('users.sendVerificationEmail', Meteor.userId(), (error) => {
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

const AdminPage = ({ loggingIn, authenticated, isAdmin, component, emailVerified, emailAddress, ...rest }) => (
  <Route
    {...rest}
    render={(props) => {
      const adminComponent = isAdmin ? React.createElement(component, { ...props, ...rest, loggingIn, authenticated, isAdmin, emailVerified, emailAddress }) : <Redirect to="/projects" />;
      const emailVerifiedComponent = emailVerified ? adminComponent : verifyEmailAlert(emailAddress);
      return authenticated ? emailVerifiedComponent : <Redirect to="/logout" />;
    }}
  />
);


AdminPage.propTypes = {
  loggingIn: PropTypes.bool.isRequired,
  authenticated: PropTypes.bool.isRequired,
  isAdmin: PropTypes.bool.isRequired,
  component: PropTypes.func.isRequired,
  emailAddress: PropTypes.string,
  emailVerified: PropTypes.bool.isRequired,
};

export default AdminPage;
