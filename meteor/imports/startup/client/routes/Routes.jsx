import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { render } from 'react-dom';
import { BrowserRouter as Router, Route, Switch } from 'react-router-dom';

import App from '../../../ui/layouts/App';

import Index from '../../../ui/pages/Index';
import One from '../../../ui/pages/One';
import Two from '../../../ui/pages/Two';
import NotFound from '../../../ui/pages/NotFound';
import Users from '../../../ui/pages/Users';
import SignUp from '../../../ui/pages/SignUp';
import Login from '../../../ui/pages/Login';

import UserCouta from '../../../ui/forms/UserCuota';
import UserManagementLayout from '../../../ui/layouts/UserMngLayout';

const Routes = () => (
    <Router>
        <App>
            <Switch>
                <Route exact path="/" component={ Index  }/>
                <Route path="/usrmng" component={ UserManagementLayout } />
                <Route path="/one" component={ One } />
                <Route path="/two" component={ Two } />
                <Route path="/singup" component={ SignUp } />
                <Route path="/login" component={ Login } />
                <Route component={ NotFound } />
            </Switch>
        </App>
    </Router>
);



export default Routes;
