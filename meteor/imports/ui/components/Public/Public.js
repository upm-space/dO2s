import React from 'react';
import PropTypes from 'prop-types';
import { Route, Redirect } from 'react-router-dom';

const Public = ({ authenticated, component, path, exact, ...rest }) => (
  <Route
    path={path}
    exact={exact}
    render={props => (
      !authenticated ?
        (React.createElement(component, { ...props, ...rest, authenticated })) :
        (<Redirect to="/projects" />)
    )}
  />
);

Public.propTypes = {
  path: PropTypes.string.isRequired,
  exact: PropTypes.bool,
  authenticated: PropTypes.bool.isRequired,
  component: PropTypes.func.isRequired,
};

export default Public;
