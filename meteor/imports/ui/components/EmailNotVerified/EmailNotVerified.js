/* eslint-disable max-len, consistent-return */
import React from 'react';
import PropTypes from 'prop-types';
import { Route, Redirect } from 'react-router-dom';

const EmailNotVerified = ({ loggingIn, authenticated, component, ...rest }) => (
  <Route
    {...rest}
    render={props => (
      authenticated ?
        (React.createElement(component, { ...props, ...rest, loggingIn, authenticated })) :
        (<Redirect to="/logout" />)
    )}
  />
);

EmailNotVerified.propTypes = {
  loggingIn: PropTypes.bool.isRequired,
  authenticated: PropTypes.bool.isRequired,
  component: PropTypes.func.isRequired,
};

export default EmailNotVerified;
