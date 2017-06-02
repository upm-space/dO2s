import { Meteor } from 'meteor/meteor';
import { Roles } from 'meteor/alanning:roles';
import { _ } from 'meteor/underscore';

// This reocnciles the Roles collection in MongoDB to ensure we've recorded all of the possible
// user roles. We do this because we're manually adding roles to users and the alanning:roles
// package doesn't detect this.

const reconcileRoles = () => {
  const users = Meteor.users.find({}, { roles: 1 }).fetch();
  let roles = [];
  users.forEach(user => (roles = _.uniq(roles.concat(user.roles))));
  roles.map(name => (!Meteor.roles.findOne({ name }) ? Roles.createRole(name) : null));
};

reconcileRoles();

Meteor.users.find({}).observe({
  added() { reconcileRoles(); },
});
