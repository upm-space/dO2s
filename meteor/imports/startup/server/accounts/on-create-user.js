import { Accounts } from 'meteor/accounts-base';
import sendWelcomeEmail from '../../../api/Users/server/send-welcome-email';

Accounts.onCreateUser((options, user) => {
  const userToCreate = user;

  if (!userToCreate.roles) {
    userToCreate.roles = ['free-user'];
  } else {
    userToCreate.roles.push('free-user');
  }
  if (options.profile) userToCreate.profile = options.profile;
  userToCreate.deleted = 'no';

  sendWelcomeEmail(options, user);
  return userToCreate;
});
