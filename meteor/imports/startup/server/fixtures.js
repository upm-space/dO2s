import { Meteor } from 'meteor/meteor';
import { Roles } from 'meteor/alanning:roles';
import { Accounts } from 'meteor/accounts-base';

if (!Meteor.isProduction) {
  const users = [{
    email: 'admin@admin.com',
    password: 'password',
    profile: {
      name: { first: 'Pili', last: 'Arr' },
    },
    roles: ['admin']
  }];

  users.forEach(({ email, password, profile, roles, deleted }) => {
    const userExists = Meteor.users.findOne({ 'emails.address': email });

    if (!userExists) {
      const userId = Accounts.createUser({ email, password, profile });
      Roles.addUsersToRoles(userId, roles);
      Meteor.users.update(
      { _id: userId },
      { $set: {
        'emails.0.verified': true
      } }
    )
    }
  });
}
