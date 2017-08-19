
import { Meteor } from 'meteor/meteor';
import { check } from 'meteor/check';
import { Roles } from 'meteor/alanning:roles';

Meteor.publish('users.management', function users(userId) {
  check(userId, String);
  if (Roles.userIsInRole(userId, ['admin'])) {
    return [
      Meteor.users.find({}, { fields: { emails: 1, roles: 1, profile: 1, services: 1, deleted: 1, createdAt: 1 } }),
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
