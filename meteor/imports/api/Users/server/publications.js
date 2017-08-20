
import { Meteor } from 'meteor/meteor';
import { check } from 'meteor/check';
import { Roles } from 'meteor/alanning:roles';

Meteor.publish('users.management', function usersManagement() {
  if (Roles.userIsInRole(this.userId, ['admin'])) {
    return Meteor.users.find({}, { fields: {
      emails: 1,
      roles: 1,
      profile: 1,
      services: 1,
      deleted: 1,
      createdAt: 1 },
    });
  }
});

Meteor.publish('users.editProfile', function usersProfile() {
  return Meteor.users.find({ _id: this.userId }, {
    fields: {
      emails: 1,
      profile: 1,
      services: 1,
    },
  });
});

Meteor.publish('users.view', (userId) => {
  check(userId, String);
  return Meteor.users.find({ _id: userId }, {
    fields: {
      emails: 1,
      profile: 1,
      services: 1,
      createdAt: 1,
      roles: 1,
      deleted: 1,
    },
  });
});
