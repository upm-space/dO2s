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
accounts-google
email
```

### OAuth Configuration

You need to go into each of the services you want to add to your login to get your secret codes. This is very confusing to do, steps not added. [Link to Instructions](http://cleverbeagle.com/pup/v1/accounts/oauth-setup)

Something about not using your personal Facebook account but Facebook doesn't like someone having two accounts. You can set up a company when you create your developer account.

After you get all your codes you store them in your `settings.json` file.

After this you need to let the application know about these keys, now we'll create a module that will run when meteor starts up. This will store all the OAuth logins in a MongoDB Collection called `meteor_accounts_loginServiceConfiguration`. We'll later call this from our server at startup.

> Be sure to start Meteor with the settings file like this `meteor --settings settings.json`

This will be the module `imports/startup/accounts/oauth.js`

```javascript
import { Meteor } from 'meteor/meteor';
import { ServiceConfiguration } from 'meteor/service-configuration';

const OAuthSettings = Meteor.settings.private.OAuth;

if (OAuthSettings) {
  Object.keys(OAuthSettings).forEach((service) => {
    ServiceConfiguration.configurations.upsert(
      { service },
      { $set: OAuthSettings[service] },
    );
  });
}

```

## Wiring up the buttons

We create a component for each button with its own stylesheet.
```javascript
const handleLogin = (service, callback) => {
  const options = {
    facebook: {
      requestPermissions: ['email'],
      loginStyle: 'popup',
    },
    google: {
      requestPermissions: ['email'],
      requestOfflineToken: true,
      loginStyle: 'popup',
    },
  }[service];

  return {
    facebook: Meteor.loginWithFacebook,
    google: Meteor.loginWithGoogle,
  }[service](options, callback);
};

const serviceLabel = {
  facebook: <span><Icon icon="facebook-official" /> Log In with Facebook</span>,
  google: <span><Icon icon="google" /> Log In with Google</span>,
};

const OAuthLoginButton = ({ service, callback }) => (
  <button
    className={`OAuthLoginButton OAuthLoginButton-${service}`}
    type="button"
    onClick={() => handleLogin(service, callback)}
  >
    {serviceLabel[service]}
  </button>
);

OAuthLoginButton.defaultProps = {
  callback: (error) => {
    if (error) Bert.alert(error.message, 'danger');
  },
};

OAuthLoginButton.propTypes = {
  service: PropTypes.string.isRequired,
  callback: PropTypes.func,
};

export default OAuthLoginButton;
```

This will be the style sheet:
```css
@import '../../stylesheets/colors';

.OAuthLoginButton {
  display: block;
  width: 100%;
  padding: 10px 15px;
  border: none;
  background: $gray-lighter;
  border-radius: 3px;

  i {
    margin-right: 3px;
    font-size: 18px;
    position: relative;
    top: 1px;
  }

  &.OAuthLoginButton-facebook {
    background: $facebook;
    color: #fff;

    &:hover { background: darken($facebook, 5%); }
  }

  &.OAuthLoginButton-google {
    background: $google;
    color: #fff;

    &:hover { background: darken($google, 5%); }
  }

  &:active {
    position: relative;
    top: 1px;
  }

  &:active,
  &:focus {
    outline: 0;
  }
}

.OAuthLoginButton + .OAuthLoginButton {
  margin-top: 10px;
}
```

This call the appropriate `Meteor.loginWith<Service>` function to log in the user. We deleted the twitter service since it does not offer the users email.

## The SingUp / LogIn Social Buttons React Component

After doing this we can create our components to make the sign up and log in pages. We'll be using the oauth buttons we just imported.

The LogIn and SingUp pages are fairly similar, only changes the function they call when the form is submitted. But the external services use the same function to log in and sign up, so we'll use the same component on both pages.

This would be the LogIn page.

```html
class Login extends Component {
  constructor(props) {
    super(props);
    this.handleSubmit = this.handleSubmit.bind(this);
  }

    <!-- handleSubmit and Form Verification -->

  render() {
    return (<div className="Login">
      <Row>
        <Col xs={12} smOffset={3} sm={6} mdOffset={4} md={4}>
          <h4 className="page-header">Log In</h4>
          <Row><Col xs={12}>
            <OAuthLoginButtons
              services={['facebook', 'google']}
              emailMessage={{
                offset: 100,
                text: 'Log In with an Email Address',
              }}
            />
          </Col></Row>
          <!-- Form -->
        </Col>
      </Row>
    </div>
    );
  }
}

Login.propTypes = {
  history: PropTypes.object.isRequired,
};

export default Login;
```

Now let's look at the OAuthLoginButtons component:
```javascript
const OAuthLoginButtons = ({ services, emailMessage }) => (services.length ? (
  <div className={`OAuthLoginButtons ${emailMessage ? 'WithEmailMessage' : ''}`}>
    {services.map(service => <OAuthLoginButton key={service} service={service} />)}
    {emailMessage ? <p className="EmailMessage" style={{ marginLeft: `-${emailMessage.offset}px` }}>
      {emailMessage.text}
    </p> : ''}
  </div>
) : <div />);

OAuthLoginButtons.propTypes = {
  services: PropTypes.array.isRequired,
  emailMessage: PropTypes.object.isRequired,
};

const verificationComplete = new ReactiveVar(false);
const verifiedServices = new ReactiveVar([]);

export default createContainer(({ services }) => {
  if (!verificationComplete.get()) {
    Meteor.call('oauth.verifyConfiguration', services, (error, response) => {
      if (error) {
        console.warn(error);
      } else {
        verifiedServices.set(response);
        verificationComplete.set(true);
      }
    });
  }

  return {
    services: verifiedServices.get(),
  };
}, OAuthLoginButtons);
```

With it's own stylesheet:
```css
@import '../../stylesheets/colors';

.OAuthLoginButtons {
  margin-bottom: 25px;

  &.WithEmailMessage {
    position: relative;
    border-bottom: 1px solid $gray-lighter;
    padding-bottom: 30px;

    .EmailMessage {
      display: inline-block;
      background: #fff;
      padding: 0 10px;
      position: absolute;
      bottom: -19px;
      left: 50%;
    }
  }
}
```

This component will only load the social login button if the secret keys are set up in the database.

## User Collection Schema

We defined a new schema for the users collection. Following the instructions in [`aldeed:collection2-core`](https://github.com/aldeed/meteor-collection2-core#aldeedcollection2-core) we install the following packages. Note that we use this version of the collection package because [`aldeed:collection2`](https://github.com/aldeed/meteor-collection2#important-note-the-version-in-this-repo-is-deprecated) is deprecated.

```
meteor add aldeed:collection2-core
meteor npm install --save simpl-schema
```

Using a schema ensures that only acceptable properties and values can be set within that document from the client. Thus, client side inserts and updates can be allowed without compromising security or data integrity.

This Schema is a modified standard Schema from the `collection` package [documentation](https://github.com/aldeed/meteor-collection2-core#attach-a-schema-to-meteorusers). Comments removed for clarity.

```javascript
const UserSchema = new SimpleSchema({
    _id: String,
    username: {
        type: String,
        optional: true
    },
    emails: {
        type: Array,
        optional: true
    },
    "emails.$": {
        type: Object
    },
    "emails.$.address": {
        type: String,
        regEx: SimpleSchema.RegEx.Email
    },
    "emails.$.verified": {
        type: Boolean
    },
    createdAt: {
        type: Date
    },
    profile: {
        type: Object,
        optional: true,
        blackbox: true
    },
    services: {
        type: Object,
        optional: true,
        blackbox: true
    },
    roles: {
        type: Array,
    },
    "roles.$": {
        type: String,
    },
    deleted: {
        type: SimpleSchema.oneOf(String, Date)
    }
});

Meteor.users.attachSchema(UserSchema);
```

Now we have to make sure that when we create the user the fields are the ones the Schema requires. We do this with the function `onCreateUser` like this.

```javascript
Accounts.onCreateUser((options, user) => {
  const userToCreate = user;

  if (!userToCreate.roles) {
    userToCreate.roles = ['free-user'];
  } else {
    userToCreate.roles.push('free-user');
  }
  if (options.profile) userToCreate.profile = options.profile;
  userToCreate.deleted = 'no';

  return userToCreate;
});

```

With this we make sure that every new user has a `free-user` role when created and a `deleted` field for recycle bin purposes. This `deleted` field would either be the string `"no"` or the date it was deleted. The Schema does not work with `null` plus it's use is not recommended. The empty String also gives an error when creating the user, the schema says `deleted` is a required field, changing this to a non-empty String fixed the error.

## Setting up the LogIn/SignUp with `accounts-password`

For this part we will need to create the forms for signing in and logging in for the user in the respective pages. We'll also need the scripts to handle log in and signup plus we will use [jQuery validation](https://themeteorchef.com/tutorials/validating-forms-with-jquery-validation) to validate the forms. After that we also need a way to handle password recovery for the user.

### Setting up the forms

We have to use two forms to get user or info when logging in and signing up. These forms are very similar for logging in and signing up. Here is the sign up form.
The forms do the verification and call the log in and sign up functions from within then corresponding component.

```html
class SignUp extends Component {
  constructor(props) {
    super(props);
    this.handleSubmit = this.handleSubmit.bind(this);
  }

  componentDidMount() {
    const component = this;

    validate(component.form, {
      ...
    });
  }

  handleSubmit() {
    ...
  }

  render() {
    return (<div className="SignUp">
      <Row>
        <Col xs={12} smOffset={3} sm={6} mdOffset={4} md={4}>
          <h4 className="page-header">Sign Up</h4>
          <Row><Col xs={12}>
            <OAuthLoginButtons
              services={['facebook', 'google']}
              emailMessage={{
                offset: 97,
                text: 'Sign Up with an Email Address',
              }}
            />
          </Col></Row>
          <form
            ref={form => (this.form = form)}
            onSubmit={event => event.preventDefault()}
          >
            <Row>
              <Col xs={6} sm={6}>
                <FormGroup>
                  <ControlLabel>First Name</ControlLabel>
                  <input
                    type="text"
                    ref={firstName => (this.firstName = firstName)}
                    name="firstName"
                    className="form-control"
                  />
                </FormGroup>
              </Col>
              <Col xs={6} sm={6}>
                <FormGroup>
                  <ControlLabel>Last Name</ControlLabel>
                  <input
                    type="text"
                    ref={lastName => (this.lastName = lastName)}
                    className="form-control"
                    name="lastName"
                  />
                </FormGroup>
              </Col>
            </Row>
            <FormGroup>
              <ControlLabel>Email Address</ControlLabel>
              <input
                type="text"
                name="emailAddress"
                ref={emailAddress => (this.emailAddress = emailAddress)}
                className="form-control"
              />
            </FormGroup>
            <FormGroup>
              <ControlLabel>Password</ControlLabel>
              <input
                type="password"
                name="password"
                ref={password => (this.password = password)}
                className="form-control"
              />
              <InputHint>Use at least six characters.</InputHint>
            </FormGroup>
            <FormGroup>
              <ControlLabel>Repeat Password</ControlLabel>
              <input
                type="password"
                className="form-control"
                ref={repeatPassword => (this.repeatPassword = repeatPassword)}
                name="repeatPassword"
              />
            </FormGroup>
            <Button type="submit" bsStyle="success" block>Sign Up</Button>
            <AccountPageFooter>
              <p>Already have an account? <Link to="/login">Log In</Link>.</p>
            </AccountPageFooter>
          </form>
        </Col>
      </Row>
    </div>);
  }
}

SignUp.propTypes = {
  history: PropTypes.object.isRequired,
};

export default SignUp;
```


## The `handleSignup` function

With this script we handle the log in and sign up of the user and also the form validation with jQuery. The log in script will be similar but we will call the `Meteor.loginWithPassword` function.

```javascript
import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import { Row, Col, FormGroup, ControlLabel, Button } from 'react-bootstrap';
import PropTypes from 'prop-types';
import { Meteor } from 'meteor/meteor';
import { Accounts } from 'meteor/accounts-base';
import { Bert } from 'meteor/themeteorchef:bert';


import OAuthLoginButtons from '../../components/OAuthLoginButtons/OAuthLoginButtons';
import InputHint from '../../components/InputHint/InputHint';
import AccountPageFooter from '../../components/AccountPageFooter/AccountPageFooter';
import validate from '../../../modules/validate';

class SignUp extends Component {
  constructor(props) {
    super(props);
    this.handleSubmit = this.handleSubmit.bind(this);
  }

  componentDidMount() {
    const component = this;

    validate(component.form, {
      rules: {
        firstName: {
          required: true,
        },
        lastName: {
          required: true,
        },
        emailAddress: {
          required: true,
          email: true,
        },
        password: {
          required: true,
          minlength: 6,
        },
        repeatPassword: {
          required: true,
          minlength: 6,
          equalTo: '[name="password"]',
        },
      },
      messages: {
        firstName: {
          required: 'What\'s your first name?',
        },
        lastName: {
          required: 'What\'s your last name?',
        },
        emailAddress: {
          required: 'Need an email address here.',
          email: 'Is this email address correct?',
        },
        password: {
          required: 'Need a password here.',
          minlength: 'Please use at least six characters.',
        },
        repeatPassword: {
          required: 'Repeat your password, please.',
          equalTo: 'Hmm, your passwords don\'t match. Try again?',
        },
      },
      submitHandler() { component.handleSubmit(); },
    });
  }

  handleSubmit() {
    const { history } = this.props;

    Accounts.createUser({
      email: this.emailAddress.value,
      password: this.password.value,
      profile: {
        name: {
          first: this.firstName.value,
          last: this.lastName.value,
        },
      },
    }, (error) => {
      if (error) {
        Bert.alert(error.reason, 'danger');
      } else {
        Meteor.call('users.sendVerificationEmail');
        Bert.alert('Welcome!', 'success');
        history.push('/projects');
      }
    });
  }

  render() {
    return (<div className="SignUp">
    </div>);
  }
}

SignUp.propTypes = {
  history: PropTypes.object.isRequired,
};

export default SignUp;
```
### Password Recovery

#### Using the Email Package
To do the password recovery we have to set up sending emails first. As explained in the guide from The Meteor Chef to [set up the email package](https://themeteorchef.com/tutorials/using-the-email-package).

We need to install the `email` package from meteor, then we have to set up an email provider like [Mailgun](https://mailgun.com/), there are other providers, we'll use this.

Get an account, by default we get a sandbox URL from Mailgun, but we can create a custom domain, too. For the sandbox URL you can only send emails to 5 authenticated emails, this is to prevent spam. I think that if you set up your domain you don't have this limitation.

After getting the accounts you have to set up the `MAIL_URL` environment variable in meteor. We will set this up on our `settings.json` file, and then call it on the server on startup.
```javascript
if (Meteor.isDevelopment) process.env.MAIL_URL = Meteor.settings.private.env.MAIL_URL;
```
```json
{
    "public": {},
    "private": {
        "OAuth": {
        },
        "env": {
            "MAIL_URL": "smtp://postmaster%40<your-mailgun-address>.mailgun.org:password@smtp.mailgun.org:587"
        }
    }
}
```

Here, notice that we've taken our Default SMTP address and put it after a call to `smtp://`. After that we write a colon : and then pass our Default Password. Finally, we append `@smtp.mailgun.org:587`. All together, this string tells Meteor to route all SMTP requests to this URL. Notice that for our Default SMTP address, we've used the URL encoded value for the `@` symbol `%40`. This has to do with how the URL is parsed by Meteor internally where the first `@` and the second @ get confused. Using the URL encoded version for the first `@` fixes this issue.

This would be a sample email sent with the `email` package, you would run this code on the server.

```javascript
Email.send({
  to: "to.address@email.com",
  from: "from.address@email.com",
  subject: "Example Email",
  html: "<p><strong>This will render as bold text</strong>, but this will not.</p>",
});
```

#### Password Recovery and Reset

First we set up a Recovery Password page that will call a `recover-password` function. The component for password recovery is a simple form that asks for the user email. The script then validates the form and calls the `Accounts.forgotPassword` method that sends an email to the one provided.

You can set the email template that this method is going to send by using the helper methods in the `accounts-base` package. This would be the code for that, to be run in the server at startup.

```javascript
import { Meteor } from 'meteor/meteor';
import { Accounts } from 'meteor/accounts-base';

const name = 'dO2s';
const email = '<dO2s.app@gmail.com>';
const from = `${name} ${email}`;
const emailTemplates = Accounts.emailTemplates;

emailTemplates.siteName = name;
emailTemplates.from = from;

emailTemplates.resetPassword = {
  subject() {
    return `[${name}] Reset Your Password`;
  },
  text(user, url) {
    const userEmail = user.emails[0].address;
    const urlWithoutHash = url.replace('#/', '');
    if (Meteor.isDevelopment) console.info(`Reset Password Link: ${urlWithoutHash}`);
    const emailBody = `A password reset has been requested for the account related to this address (${userEmail}). To reset the password, visit the following link: \n\n${urlWithoutHash}\n\n If you did not request this reset, please ignore this email. If you feel something is wrong, please contact our support team: ${email}.`;

    return emailBody;
  },
};
```

This email sends a `url` with a token to the user. This url will load the ResetPassword component which is a simple form asking for the new password. The reset-password password script is loaded then and it validates the form and calls the `Accounts.resetPassword` method that takes as arguments the token send in the url and the new password. After the password is set we redirect the user to `/login`, to do this with react-router4 we run:

```javascript
history.push('/login');
```

## Verification Email

When doing the sign up we call the `Accounts.createUser`, if everything go right we call a method in the callback to `users.sendVerificationEmail`.

```javascript
handleSubmit() {
const { history } = this.props;

Accounts.createUser({
  email: this.emailAddress.value,
  password: this.password.value,
  profile: {
    name: {
      first: this.firstName.value,
      last: this.lastName.value,
    },
  },
}, (error) => {
  if (error) {
    Bert.alert(error.reason, 'danger');
  } else {
    Meteor.call('users.sendVerificationEmail');
    Bert.alert('Welcome!', 'success');
    history.push('/projects');
  }
});
}
```
This new method is going to call the `Accounts.sendVerificationEmail` when a new user is created, as with password reset this email template can be defined with `Accounts.emailTemplates.verifyEmail`.

```javascript
'users.sendVerificationEmail': function sendVerificationEmail() {
  return Accounts.sendVerificationEmail(this.userId);
},
```

This email is going to have an url with a token, the VerifyEmail component that loads is going to call the `Accounts.verifyEmail` method, that takes as argument the token in the url to update the corresponding email address to verified. After the verification is done we redirect the router like shown bellow.

```javascript
class VerifyEmail extends Component {
  constructor(props) {
    super(props);
    this.state = { error: null };
  }

  componentDidMount() {
    const { match, history } = this.props;
    Accounts.verifyEmail(match.params.token, (error) => {
      if (error) {
        Bert.alert(error.reason, 'danger');
        this.setState({ error: `${error.reason}. Please try again.` });
      } else {
        setTimeout(() => {
          Bert.alert('All set, thanks!', 'success');
          history.push('/projects');
        }, 2000);
      }
    });
  }

  render() {
    return (<div className="VerifyEmail">
      <Alert bsStyle={!this.state.error ? 'info' : 'danger'}>
        {!this.state.error ? 'Verifying...' : this.state.error}
      </Alert>
    </div>);
  }
}

VerifyEmail.propTypes = {
  match: PropTypes.object.isRequired,
  history: PropTypes.object.isRequired,
};

export default VerifyEmail;
```

Also for the external services for logging in we are going to take the user type and make the emailVerified flag as `true` in the `<App />` layout so that the variable is reactive.

```javascript
export default createContainer(() => {
  const user = Meteor.user();
  const emailAddress = user && user.emails && user.emails[0].address;
  const userType = user ? (user.emails ? 'password' : 'oauth') : '';
  const passwordUserEmailVerified = userType === 'password' ? (user && user.emails && user.emails[0].verified) : true;
  const emailVerified = user ? passwordUserEmailVerified : false;

  return {
    ...
  };
}, App);
```

We then add the email verification at the `<Authenticated />` like this:

```javascript
const sendVerificationEmail = (emailAddress) => {
  Meteor.call('users.sendVerificationEmail', (error) => {
    if (error) {
      Bert.alert(error.reason, 'danger');
    } else {
      Bert.alert(`Verification sent to ${emailAddress}!`, 'success');
    }
  });
};

const verifyEmailAlert = emailAddress => (<Alert bsStyle="warning">
  <p>Hey friend! Can you <strong>verify your email address</strong> ({emailAddress}) for us?
    <Button
      bsStyle="link"
      onClick={() => sendVerificationEmail(emailAddress)}
      href="#"
    >
    Re-send verification email
  </Button>
  </p>
</Alert>);

const Authenticated = ({ loggingIn, authenticated, component, emailVerified, emailAddress, ...rest }) => (
  <Route
    {...rest}
    render={(props) => {
      const emailVerifiedComponent = emailVerified
      ? React.createElement(component, { ...props, loggingIn, authenticated })
      : verifyEmailAlert(emailAddress);

      return authenticated ? emailVerifiedComponent : <Redirect to="/logout" />;
    }}
  />
);
```


## Useful links

-   [`aldeed:collection2-core` Documentation](https://github.com/aldeed/meteor-collection2-core#aldeedcollection2-core)
-   [`simple-schema` Documentation](https://github.com/aldeed/node-simple-schema#simple-schema)
-   [`meteor-roles` Documentation](https://github.com/alanning/meteor-roles#meteor-roles)
