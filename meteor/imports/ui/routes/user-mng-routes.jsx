import React from 'react';
import { render } from 'react-dom';
import { BrowserRouter as Router, Route, Switch } from 'react-router-dom';

import UserCouta from '../forms/user-cuota'
import { UserManagementLayout } from '../layouts/user-mng-layout';

const UserManagementRoutes = () => (
    <UserManagementLayout>
        <Route path="/usrmng/user-cuota" component={UserCouta} />
    </UserManagementLayout>
);

export default UserManagementRoutes;
