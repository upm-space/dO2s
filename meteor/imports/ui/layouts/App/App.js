import React from 'react';
import PropTypes from 'prop-types';
import { Grid } from 'react-bootstrap';
import { Meteor } from 'meteor/meteor';
import { createContainer } from 'meteor/react-meteor-data';
import { BrowserRouter as Router, Route, Switch } from 'react-router-dom';
import { Roles } from 'meteor/alanning:roles';

import Navigation from '../../components/Navigation/Navigation';
import Index from '../../pages/Index/Index';
import One from '../../pages/One/One';
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

import Public from '../../components/Public/Public';
import Authenticated from '../../components/Authenticated/Authenticated';
import AdminPage from '../../components/Administrator/AdminPage';

import UserManagementLayout from '../../pages/UserManagement/UserMngLayout';

const App = props => (
  <Router>
    {!props.loading ? <div className="App">
      <Navigation {...props} />
      <Grid fluid>
        <Switch>
          <Route exact name="index" path="/" component={Index} />
          <AdminPage exact path="/usrmng" component={UserManagementLayout} {...props} />
          <Authenticated exact path="/projects" component={One} {...props} />
          <Authenticated exact path="/hangar" component={Two} {...props} />
          <Authenticated exact path="/profile" component={Profile} {...props} />
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
  const getUserType = (user) => {
    if (!user) {
      return '';
    }
    if ('emails' in user) {
      return 'password';
    }
    return 'oauth';
  };
  const emailAddress = user && user.emails && user.emails[0].address;
  const userType = getUserType(Meteor.user());
  const getEmailIsVerified = (user) => {
    if (!user) {
      return false;
    }
    if (userType === 'password') {
      return user && user.emails && user.emails[0].verified;
    } else if (userType === 'oauth') {
      return true;
    }
  };

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
    emailVerified: getEmailIsVerified(Meteor.user()),
  };
}, App);
