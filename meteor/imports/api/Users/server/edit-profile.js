/* eslint-disable consistent-return */
import { Meteor } from 'meteor/meteor';
import { Accounts } from 'meteor/accounts-base';


let action;

const updateUser = (userId, { emailAddress, profile }) => {
  console.log(userId, emailAddress, JSON.stringify(profile));
  try {
    const currentEmail = Meteor.users.find(
      { _id: userId },
      {
        fields: {
          emails: 1,
        },
      },
    ).fetch()[0].emails[0].address;
    if (emailAddress === currentEmail) {
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
      }, (error) => {
        if (error) {
          throw new Meteor.Error('500', error.reason);
        } else {
          Accounts.sendVerificationEmail(userId);
        }
      });
    }
  } catch (exception) {
    action.reject(`[editProfile.updateUser] ${exception}`);
  }
};

const editProfile = ({ userId, profile }, promise) => {
  console.log('calls inside edit-profile');
  console.log(userId, JSON.stringify(profile));
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
