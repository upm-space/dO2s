import { Accounts } from 'meteor/accounts-base';

Accounts.onCreateUser((options, user) => {
    const userToCreate = user;

    if (!userToCreate.roles) {
        userToCreate.roles = ["free-user"];
    } else {
        userToCreate.roles.push("free-user");
    }
    if (options.profile) userToCreate.profile = options.profile;
    userToCreate.deleted = "no";

    return userToCreate;
    const cleanUserToCreate = Meteor.users.schema.clean(userToCreate);
    return cleanUserToCreate;
});
