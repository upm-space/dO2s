import { Meteor } from 'meteor/meteor';
import { Roles } from 'meteor/alanning:roles';

Meteor.publish('users', function users() {
  if (Roles.userIsInRole(this.userId, ['admin'])) {
    return [
      Meteor.users.find({}, { fields: { emails: 1, roles: 1, profile: 1 } }),
      Roles.getAllRoles(),
    ];
  }
  return this.ready();
});

Meteor.publish('users.roles', () => Roles.getAllRoles());

Meteor.publish('users.editProfile', function usersProfile() {
  return Meteor.users.find(this.userId, {
    fields: {
      emails: 1,
      profile: 1,
      services: 1,
    },
  });
});
