import { Meteor } from 'meteor/meteor';
import { check } from 'meteor/check';
import { Roles } from 'meteor/alanning:roles';

Meteor.methods({
  'users.changeRole': function usersChangeRole(update) {
    check(update, { _id: String, role: String });

    if (Roles.userIsInRole(this.userId, ['admin'])) {
      Roles.setUserRoles(update._id, update.role);
    } else {
      throw new Meteor.Error('500', 'Ha! Nice try, slick.');
    }
  },
});
