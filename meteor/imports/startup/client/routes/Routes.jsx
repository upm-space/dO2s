import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { render } from 'react-dom';
import { BrowserRouter as Router, Route, Switch } from 'react-router-dom';
import { Grid } from 'react-bootstrap';

import App from '../../../ui/layouts/App';

import Index from '../../../ui/pages/Index';
import One from '../../../ui/pages/One';
import Two from '../../../ui/pages/Two';
import NotFound from '../../../ui/pages/NotFound';
import Users from '../../../ui/pages/Users';

import UserCouta from '../../../ui/forms/UserCuota';
import { UserManagementLayout } from '../../../ui/layouts/UserMngLayout';


const UserManagementRoutes = () => (
    <UserManagementLayout>
        <Switch>
            <Route path="/usrmng/user-cuota" component={UserCouta} />
            <Route component={ NotFound } />
        </Switch>

    </UserManagementLayout>
);

const Routes = () => (
    <Router>
        <App>
            <Grid>
                <Switch>
                    <Route exact path="/" component={ Index  }/>
                    <Route path="/usrmng" component={ Users } />
                    <Route path="/one" component={ One } />
                    <Route path="/two" component={ Two } />
                    <Route component={ NotFound } />
                </Switch>
            </Grid>
        </App>
    </Router>
);



export default Routes;
