import React from 'react';
import PropTypes from 'prop-types';
import { Route, Redirect } from 'react-router-dom';

const Public = ({
  authenticated, component, path, ...rest
}) => (
  <Route
    path={path}
    render={props => (
      !authenticated ?
        (React.createElement(component, { ...props, ...rest, authenticated })) :
        (<Redirect to="/projects" />)
    )}
  />
);

Public.propTypes = {
  path: PropTypes.string.isRequired,
  authenticated: PropTypes.bool.isRequired,
  component: PropTypes.func.isRequired,
};

export default Public;
