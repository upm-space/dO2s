# Rolling your own Authentication
Source:

-   [Roll Your Own Authentication](https://themeteorchef.com/tutorials/roll-your-own-authentication)


Additional knowledge:

-   [What is ES2015](https://themeteorchef.com/blog/what-is-es2015/)
-   [Common Meteor patterns in ES2015](https://themeteorchef.com/snippets/common-meteor-patterns-in-es2015/)
-   [Using the Module Pattern](https://themeteorchef.com/tutorials/using-the-module-pattern)
-   [Using the Email Package](https://themeteorchef.com/tutorials/using-the-email-package)

## Prep

### Packages

```
accounts-password
accounts-facebook
accounts-twitter
accounts-google
email
```

### OAuth Configuration

You need to go into each of the services you want to add to your login to get your secret codes. This is very confusing to do, steps not added.

Something about not using your personal Facebook account but Facebook doesn't like someone having two accounts. You can set up a company when you create your developer account.

After you get all your codes you store them in your `settings.json` file.

After this you need to let the application know about these keys, now we'll create a module that will run when meteor starts up. This will store all the OAuth logins in a MongoDB Collection called `meteor_accounts_loginServiceConfiguration`. We'll later call this from our server at startup.

> Be sure to start Meteor with the settings file like this `meteor --settings settings.json`

This will be the module `imports/modules/configure-services.js`

```javascript
import { Meteor } from 'meteor/meteor';
const services = Meteor.settings.private.oAuth;

const configure = () => {
  if ( services ) {
    for ( let service in services ) {
      ServiceConfiguration.configurations.upsert(
          { service: service },
          { $set: services[ service ] }
      );
    }
  }
};
configure();
```

## Wiring up the buttons

Add the themes for the buttons from [Bootstrap Social](https://lipis.github.io/bootstrap-social/).
