import React from 'react';
import PropTypes from 'prop-types';
import { Route, Redirect } from 'react-router-dom';

const EmailNotVerified = ({
  authenticated, component, path, exact, ...rest
}) => (
  <Route
    path={path}
    exact={exact}
    render={props => (
      authenticated ?
        (React.createElement(component, { ...props, ...rest, authenticated })) :
        (<Redirect to="/login" />)
    )}
  />
);

EmailNotVerified.propTypes = {
  path: PropTypes.string.isRequired,
  exact: PropTypes.bool.isRequired,
  authenticated: PropTypes.bool.isRequired,
  component: PropTypes.func.isRequired,
};

export default EmailNotVerified;
