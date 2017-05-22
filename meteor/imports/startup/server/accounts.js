Accounts.onCreateUser((options, user) => {
    if (options.email === "pili@me.com"){
        user.roles = ['admin'];
    }
    return user;
});
