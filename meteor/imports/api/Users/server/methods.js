/* eslint-disable meteor/audit-argument-checks */
import { Meteor } from 'meteor/meteor';
import { check } from 'meteor/check';
import { Accounts } from 'meteor/accounts-base';
import { Roles } from 'meteor/alanning:roles';
import SimpleSchema from 'simpl-schema';

import editProfile from './edit-profile';
import rateLimit from '../../../modules/rate-limit';

const newUserSchema = new SimpleSchema({
  profile: {
    type: Object,
  },
  'profile.name': {
    type: Object,
  },
  'profile.name.first': {
    type: String,
  },
  'profile.name.last': {
    type: String,
  },
  email: {
    type: String,
    regEx: SimpleSchema.RegEx.Email,
  },
  password: {
    type: String,
    min: 6,
  },
});

const editUserSchema = new SimpleSchema({
  profile: {
    type: Object,
  },
  'profile.name': {
    type: Object,
  },
  'profile.name.first': {
    type: String,
  },
  'profile.name.last': {
    type: String,
  },
  email: {
    type: String,
    regEx: SimpleSchema.RegEx.Email,
  },
  _id: String,
});


Meteor.methods({
  'users.changeRole': function usersChangeRole(userId, newRole) {
    check(userId, String);
    check(newRole, String);

    if (Roles.userIsInRole(this.userId, ['admin'])) {
      Roles.setUserRoles(userId, newRole);
    } else if (Roles.userIsInRole(userId, ['admin'])) {
      throw new Meteor.Error('500', 'No way Jose');
    } else {
      throw new Meteor.Error('500', 'Ha! Nice try, slick.');
    }
  },

  'users.sendVerificationEmail': function sendVerificationEmail(userId) {
    return Accounts.sendVerificationEmail(userId);
  },

  'users.setPassword': function usersSetPassword(userId) {
    try {
      return Accounts.setPassword(userId, 'password');
    } catch (exception) {
      throw new Meteor.Error('500', exception);
    }
  },

  'users.editProfile': function usersEditProfile(profile) {
    check(profile, {
      emailAddress: String,
      profile: {
        name: {
          first: String,
          last: String,
        },
      },
    });
    return editProfile({ userId: this.userId, profile })
    .then(response => response)
    .catch((exception) => {
      throw new Meteor.Error('500', exception);
    });
  },
  'users.softDelete': function usersSoftDelete(userId) {
    check(userId, String);
    try {
      if (Roles.userIsInRole(this.userId, ['admin'])) {
        Meteor.users.update(userId, { $set: { deleted: (new Date()).toISOString() } });
      } else if (Roles.userIsInRole(userId, ['admin'])) {
        throw new Meteor.Error('500', 'No way Jose');
      } else {
        throw new Meteor.Error('500', 'Ha! Nice try, slick.');
      }
    } catch (exception) {
      throw new Meteor.Error('500', exception);
    }
  },
  'users.restore': function projectsRestore(userId) {
    check(userId, String);
    try {
      if (Roles.userIsInRole(this.userId, ['admin'])) {
        Meteor.users.update(userId, { $set: { deleted: 'no' } });
      } else {
        throw new Meteor.Error('500', 'Ha! Nice try, slick.');
      }
    } catch (exception) {
      throw new Meteor.Error('500', exception);
    }
  },
  'users.hardDelete': function usersHardDelete(userId) {
    check(userId, String);
    try {
      if (Roles.userIsInRole(this.userId, ['admin'])) {
        Meteor.users.remove(userId);
      } else if (Roles.userIsInRole(userId, ['admin'])) {
        throw new Meteor.Error('500', 'No way Jose');
      } else {
        throw new Meteor.Error('500', 'Ha! Nice try, slick.');
      }
    } catch (exception) {
      throw new Meteor.Error('500', exception);
    }
  },
  'users.insert': function usersInsert(user) {
    try {
      newUserSchema.validate(user);
      return Accounts.createUser(user);
    } catch (exception) {
      if (exception.error === 'validation-error') {
        throw new Meteor.Error(500, exception.message);
      }
      throw new Meteor.Error('500', exception);
    }
  },
  'users.update': function usersUpdate(user) {
    console.log('calling users.update');
    console.log(JSON.stringify(user));
    try {
      editUserSchema.validate(user);
      const userProfile = {
        emailAddress: user.email,
        profile: {
          name: {
            first: user.profile.name.first,
            last: user.profile.name.last,
          },
        },
      };
      console.log(`userProfile ${JSON.stringify(userProfile)}`);
      return editProfile({ userId: user._id, userProfile })
      .then(response => response)
      .catch((exception) => {
        throw new Meteor.Error('500', exception);
      });
    } catch (exception) {
      if (exception.error === 'validation-error') {
        throw new Meteor.Error(500, exception.message);
      }
      throw new Meteor.Error('500', exception);
    }
  },
});
rateLimit({
  methods: [
    'users.editProfile',
    'users.sendVerificationEmail',
    'users.changeRole',
    'users.softDelete',
    'users.restore',
    'users.hardDelete',
    'users.insert',
  ],
  limit: 5,
  timeRange: 1000,
});
