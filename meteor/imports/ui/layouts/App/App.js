/* eslint-disable no-nested-ternary */
import React from 'react';
import PropTypes from 'prop-types';
import { Grid } from 'react-bootstrap';
import { Meteor } from 'meteor/meteor';
import { withTracker } from 'meteor/react-meteor-data';
import { BrowserRouter as Router, Route, Switch } from 'react-router-dom';
import { Roles } from 'meteor/alanning:roles';

import Navigation from '../../components/Navigation/Navigation';
import Index from '../../pages/Index/Index';
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

import RPAs from '../../pages/RPAs/RPAs';
import Payloads from '../../pages/Payloads/Payloads';
import Batteries from '../../pages/Batteries/Batteries';
import NewRPA from '../../pages/NewRPA/NewRPA';
import ViewRPA from '../../pages/ViewRPA/ViewRPA';
import EditRPA from '../../pages/EditRPA/EditRPA';
import NewPayload from '../../pages/NewPayload/NewPayload';
import ViewPayload from '../../pages/ViewPayload/ViewPayload';
import EditPayload from '../../pages/EditPayload/EditPayload';
import NewBattery from '../../pages/NewBattery/NewBattery';
import ViewBattery from '../../pages/ViewBattery/ViewBattery';
import EditBattery from '../../pages/EditBattery/EditBattery';

import Public from '../../components/Public/Public';
import Authenticated from '../../components/Authenticated/Authenticated';
import AdminPage from '../../components/Administrator/AdminPage';
import EmailNotVerified from '../../components/EmailNotVerified/EmailNotVerified';

import UserManagement from '../../pages/UserManagement/UserManagement';
import NewUser from '../../pages/NewUser/NewUser';
import EditUser from '../../pages/EditUser/EditUser';
import Hector from '../../pages/Hector/Hector';
// import MissionVideo from '../../components/MissionVideo/MissionVideo';

const App = props => (
  <Router>
    {!props.loading ?
      <div className="App">
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
            <Authenticated exact path="/hangar" component={RPAs} {...props} />
            <Authenticated exact path="/hangar/rpas" component={RPAs} {...props} />
            <Authenticated exact path="/hangar/rpas/new" component={NewRPA} {...props} />
            <Authenticated exact path="/hangar/rpas/:rpa_id" component={ViewRPA} {...props} />
            <Authenticated exact path="/hangar/rpas/:rpa_id/edit" component={EditRPA} {...props} />
            <Authenticated exact path="/hangar/payloads" component={Payloads} {...props} />
            <Authenticated exact path="/hangar/payloads/new" component={NewPayload} {...props} />
            <Authenticated
              exact
              path="/hangar/payloads/:payload_id"
              component={ViewPayload}
              {...props}
            />
            <Authenticated
              exact
              path="/hangar/payloads/:payload_id/edit"
              component={EditPayload}
              {...props}
            />
            <Authenticated exact path="/hangar/batteries" component={Batteries} {...props} />
            <Authenticated exact path="/hangar/batteries/new" component={NewBattery} {...props} />
            <Authenticated
              exact
              path="/hangar/batteries/:battery_id"
              component={ViewBattery}
              {...props}
            />
            <Authenticated
              exact
              path="/hangar/batteries/:battery_id/edit"
              component={EditBattery}
              {...props}
            />
            <Authenticated
              exact
              path="/hector"
              component={Hector}
              {...props}
            />
            <EmailNotVerified exact path="/profile" component={Profile} {...props} />
            <Public path="/signup" component={SignUp} {...props} />
            <Public path="/login" component={Login} {...props} />
            <Route path="/logout" component={Logout} {...props} />
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
  userId: PropTypes.string,
  emailAddress: PropTypes.string,
  loading: PropTypes.bool.isRequired,
};

const getUserName = name => ({
  string: name,
  object: `${name.first} ${name.last}`,
}[typeof name]);

export default withTracker(() => {
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
})(App);
