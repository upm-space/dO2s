/* eslint-disable no-nested-ternary */
import React from 'react';
import PropTypes from 'prop-types';
import { Grid } from 'react-bootstrap';
import { Meteor } from 'meteor/meteor';
import { createContainer } from 'meteor/react-meteor-data';
import { BrowserRouter as Router, Route, Switch } from 'react-router-dom';
import { Roles } from 'meteor/alanning:roles';

import Navigation from '../../components/Navigation/Navigation';
import Index from '../../pages/Index/Index';
import Two from '../../pages/Two/Two';
import NotFound from '../../pages/NotFound/NotFound';
import SignUp from '../../pages/Signup/SignUp';
import Login from '../../pages/Login/Login';
import Logout from '../../pages/Logout/Logout';
import RecoverPassword from '../../pages/RecoverPassword/RecoverPassword';
import ResetPassword from '../../pages/ResetPassword/ResetPassword';
import Profile from '../../pages/Profile/Profile';
import VerifyEmail from '../../pages/VerifyEmail/VerifyEmail';
import Footer from '../../components/Footer/Footer';
import Terms from '../../pages/Terms/Terms';
import Privacy from '../../pages/Privacy/Privacy';
import ExamplePage from '../../pages/ExamplePage/ExamplePage';

import Projects from '../../pages/Projects/Projects';
import NewProject from '../../pages/NewProject/NewProject';
import ViewProject from '../../pages/ViewProject/ViewProject';
import EditProject from '../../pages/EditProject/EditProject';

import NewMission from '../../pages/NewMission/NewMission';
import ViewMission from '../../pages/ViewMission/ViewMission';
import EditMission from '../../pages/EditMission/EditMission';

import Public from '../../components/Public/Public';
import Authenticated from '../../components/Authenticated/Authenticated';
import AdminPage from '../../components/Administrator/AdminPage';
import EmailNotVerified from '../../components/EmailNotVerified/EmailNotVerified';

import UserManagement from '../../pages/UserManagement/UserManagement';
import NewUser from '../../pages/NewUser/NewUser';
import EditUser from '../../pages/EditUser/EditUser';

const App = props => (
  <Router>
    {!props.loading ? <div className="App">
      <Navigation {...props} />
      <Grid fluid>
        <Switch>
          <Route exact name="index" path="/" component={Index} />
          <AdminPage exact path="/users" component={UserManagement} {...props} />
          <AdminPage exact path="/users/new" component={NewUser} {...props} />
          <AdminPage exact path="/users/:user_id/edit" component={EditUser} {...props} />
          <Authenticated exact path="/projects" component={Projects} {...props} />
          <Authenticated exact path="/projects/new" component={NewProject} {...props} />
          <Authenticated exact path="/projects/:project_id" component={ViewProject} {...props} />
          <Authenticated
            exact
            path="/projects/:project_id/edit"
            component={EditProject}
            {...props}
          />
          <Authenticated
            exact
            path="/projects/:project_id/newMission"
            component={NewMission}
            {...props}
          />
          <Authenticated
            exact
            path="/projects/:project_id/:mission_id/edit"
            component={EditMission}
            {...props}
          />
          <Authenticated
            exact
            path="/projects/:project_id/:mission_id"
            component={ViewMission}
            {...props}
          />
          <Authenticated
            exact
            path="/projects/:project_id/:mission_id/plan"
            component={ViewMission}
            {...props}
          />
          <Authenticated
            exact
            path="/projects/:project_id/:mission_id/flight"
            component={ViewMission}
            {...props}
          />
          <Authenticated
            exact
            path="/projects/:project_id/:mission_id/analysis"
            component={ViewMission}
            {...props}
          />
          <Authenticated exact path="/hangar" component={Two} {...props} />
          <EmailNotVerified exact path="/profile" component={Profile} {...props} />
          <Public path="/signup" component={SignUp} {...props} />
          <Public path="/login" component={Login} {...props} />
          <Public path="/logout" component={Logout} {...props} />
          <Route name="verify-email" path="/verify-email/:token" component={VerifyEmail} />
          <Route name="recover-password" path="/recover-password" component={RecoverPassword} />
          <Route name="reset-password" path="/reset-password/:token" component={ResetPassword} />
          <Route name="terms" path="/terms" component={Terms} />
          <Route name="privacy" path="/privacy" component={Privacy} />
          <Route name="examplePage" path="/example-page" component={ExamplePage} />
          <Route component={NotFound} />
        </Switch>
      </Grid>
      <Footer />
    </div> : ''}
  </Router>
);

App.defaultProps = {
  userId: '',
  emailAddress: '',
};

App.propTypes = {
  loading: PropTypes.bool.isRequired,
};

const getUserName = name => ({
  string: name,
  object: `${name.first} ${name.last}`,
}[typeof name]);

export default createContainer(() => {
  const loggingIn = Meteor.loggingIn();
  const user = Meteor.user();
  const userId = Meteor.userId();
  const loading = !Roles.subscription.ready();
  const name = user && user.profile && user.profile.name && getUserName(user.profile.name);
  const emailAddress = user && user.emails && user.emails[0].address;
  const userType = user ? (user.emails ? 'password' : 'oauth') : '';
  const passwordUserEmailVerified = userType === 'password' ? (user && user.emails && user.emails[0].verified) : true;
  const emailVerified = user ? passwordUserEmailVerified : false;

  return {
    loading,
    loggingIn,
    authenticated: !loggingIn && !!userId,
    name: name || emailAddress,
    roles: !loading && Roles.getRolesForUser(userId),
    isAdmin: Roles.userIsInRole(Meteor.userId(), 'admin'),
    userType,
    userId,
    emailAddress,
    emailVerified,
  };
}, App);
