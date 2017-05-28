import { Mongo } from 'meteor/mongo';
import SimpleSchema from 'simpl-schema';

const UserSchema = new SimpleSchema({
_id: String,
emails: { type: Array },
'emails.$': Object,
'emails.$.address': String,
'emails.$.verified': Boolean,
createdAt: Date,
services: { type: Object, blackbox: true },
deleted: SimpleSchema.oneOf( Date, String )
});

Accounts.onCreateUser((options, user) => {
    user.roles = ['user'];
    user.deleted = "";

    if ( Accounts.validateNewUser((user) => {
            UserSchema.validate(user);
            // Return true to allow user creation to proceed
            return true;
            })
        )
        {
            return user;
        } else {
            console.log('Oops! User info not right');
        }
});
