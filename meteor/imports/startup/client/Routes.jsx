import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { createContainer } from 'meteor/react-meteor-data';
import { render } from 'react-dom';
import { BrowserRouter as Router, Route, Switch } from 'react-router-dom';

import App from '../../ui/layouts/App';

import Index from '../../ui/pages/Index';
import One from '../../ui/pages/One';
import Two from '../../ui/pages/Two';
import NotFound from '../../ui/pages/NotFound';
import Users from '../../ui/pages/Users';
import SignUp from '../../ui/pages/SignUp';
import Login from '../../ui/pages/Login';
import RecoverPassword from '../../ui/pages/RecoverPassword';
import ResetPassword from '../../ui/pages/ResetPassword';
import VerifyEmail from '../../ui/pages/VerifyEmail';

import Public from '../../ui/pages/Public';
import Authenticated from '../../ui/pages/Authenticated';
import AdminPage from '../../ui/pages/AdminPage';

import UserCouta from '../../ui/forms/UserCuota';
import UserManagementLayout from '../../ui/layouts/UserMngLayout';

const Routes = (routesProps) => (
    <Router>
        <App {...routesProps}>
            <Switch>
                <Route exact path="/" component={Index}/>
                <AdminPage exact path="/usrmng" component={UserManagementLayout} {...routesProps} />
                <Authenticated exact path="/one" component={One} {...routesProps} />
                <Authenticated exact path="/two" component={Two} {...routesProps} />

                <Public path="/signup" component={SignUp} {...routesProps} />
                <Public path="/login" component={Login} {...routesProps} />

                <Route path="/verify-email/:token" component={ VerifyEmail }/>
                <Route path="/recover-password" component={ RecoverPassword } />
                <Route path="/reset-password/:token" component={ ResetPassword } />
                <Route component={ NotFound } />
            </Switch>
        </App>
    </Router>
);


Routes.PropTypes = {
    loggingIn: PropTypes.bool.isRequired,
    authenticated: PropTypes.bool.isRequired,
    isAdmin: PropTypes.bool.isRequired
}

export default createContainer(({match}) => {
    const loggingIn = Meteor.loggingIn();
    return {
        loggingIn: loggingIn,
        authenticated: !loggingIn && !!Meteor.userId(),
        isAdmin: Roles.userIsInRole(Meteor.userId(), "admin"),
    }
}, Routes);
