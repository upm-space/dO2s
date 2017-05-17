import React from 'react';
import { render } from 'react-dom';
import { BrowserRouter as Router, Route, Switch } from 'react-router-dom';

import App from '../../../ui/layouts/app';

import Home from '../../../ui/pages/home';
import One from '../../../ui/pages/one';
import Two from '../../../ui/pages/two';
import NotFound from '../../../ui/pages/not-found';

import UserCouta from '../../../ui/forms/user-cuota';
import { UserManagementLayout } from '../../../ui/layouts/user-mng-layout';


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

const UserManagementRoutes = () => (
    <UserManagementLayout>
        <Route path="/usrmng/user-cuota" component={UserCouta} />
    </UserManagementLayout>
);


export default Routes;
