import React from 'react';
import { render } from 'react-dom';
import { BrowserRouter as Router, Route, Switch } from 'react-router-dom';

import App from '../layouts/app';
import UserManagementRoutes from './user-mng-routes';

import Home from '../pages/home';
import One from '../pages/one';
import Two from '../pages/two';
import NotFound from '../pages/not-found'

const Routes = () => (
    <Router>
        <App>
            <Switch>
                <Route exact path="/" component={ Home }/>
                <Route path="/usrmng" component={ UserManagementRoutes } />
                <Route path="/one" component={ One } />
                <Route path="/two" component={ Two } />
                <Route component={ NotFound } />
            </Switch>
        </App>
    </Router>
);

export default Routes;
