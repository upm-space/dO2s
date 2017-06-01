import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { Route, Redirect } from 'react-router-dom';

const AdminPage = ({ loggingIn, authenticated, isAdmin, component, ...rest }) => (
  <Route {...rest} render={(props) => {
    if (loggingIn) return <div></div>;
    if (authenticated){
        if (isAdmin) {
            return React.createElement(component, { ...props, loggingIn, authenticated, isAdmin});
        } else {
            return <Redirect to="/one" />;
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
