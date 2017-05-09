import React from 'react';
import { render } from 'react-dom';
import { Router, Route, IndexRoute, browserHistory } from 'react-router';

import { App } from '../../ui/layouts/app.jsx';
import { UserManagementLayout} from '../../ui/layouts/user-mng-layout.jsx';

import { Home } from '../../ui/pages/home.jsx';
import { One } from '../../ui/pages/one.jsx';
import { Two } from '../../ui/pages/two.jsx';
import { NotFound} from '../../ui/pages/not-found.jsx'

import {UserCouta} from '../../ui/forms/user-cuota.jsx'

Meteor.startup( () => {
    render(
        <Router history={ browserHistory }>
            <Route path="/" component={ App }>
                <IndexRoute component={ Home } />
                <Route path="/usrmng" component={ UserManagementLayout }>
                    <Route path="/user-cuota" component={ UserCouta } />
                </Route>
                <Route path="/one" component={ One } />
                <Route path="/two" component={ Two } />
            </Route>
            <Route path="*" component={ NotFound } />
        </Router>,
        document.getElementById( 'react-root' )
    );
});