import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { Route, Redirect } from 'react-router-dom';

const Authenticated = ({ loggingIn, authenticated, isAdmin, component, ...rest }) => (
  <Route {...rest} render={(props) => {
    if (loggingIn) return <div></div>;
    return authenticated ?
    (React.createElement(component, { ...props, loggingIn, authenticated, isAdmin})) :
    (<Redirect to="/login" />);
  }} />
);

Authenticated.PropTypes = {
  loggingIn: PropTypes.bool,
  authenticated: PropTypes.bool,
  isAdmin: PropTypes.bool,
  component: PropTypes.func,
};

export default Authenticated;
