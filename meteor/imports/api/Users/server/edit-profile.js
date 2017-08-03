/* eslint-disable consistent-return */
import { Meteor } from 'meteor/meteor';

let action;

const updateUser = (userId, { emailAddress, profile }) => {
  try {
    if (emailAddress === Meteor.user().emails[0].address) {
      Meteor.users.update(userId, {
        $set: { profile },
      });
    } else {
      Meteor.users.update(userId, {
        $set: {
          'emails.0.address': emailAddress,
          'emails.0.verified': false,
          profile,
        },
      });
    }
  } catch (exception) {
    action.reject(`[editProfile.updateUser] ${exception}`);
  }
};

const editProfile = ({ userId, profile }, promise) => {
  try {
    action = promise;
    updateUser(userId, profile);
    action.resolve();
  } catch (exception) {
    action.reject(`[editProfile.handler] ${exception}`);
  }
};

export default options =>
new Promise((resolve, reject) =>
editProfile(options, { resolve, reject }));
