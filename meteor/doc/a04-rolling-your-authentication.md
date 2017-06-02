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

Add the themes for the buttons from [Bootstrap Social](https://lipis.github.io/bootstrap-social/). Using the `.scss` file you have to manually add some missing variables from the Bootstrap source.

## The SingUp / LogIn Social Buttons React Component

After doing this we can create our components to make the sign up and log in pages. We'll be using the social buttons we just imported.

The LogIn and SingUp pages are fairly similar, only changes the function they call when the form is submitted. But the external services use the same function to log in and sign up, so we'll use the same component on both pages.

This would be the LogIn page.

```html
[...]
import LoginButtons from '../components/LoginButtons';

class Login extends Component {

    render() {
    return (
      <div className="login">
        <Row>
          <Col xs={ 12 } smOffset={3} sm={ 6 } mdOffset={4} md={ 4 }>
            <h3 className="page-header">Log In</h3>
            <LoginButtons />
            [...] Here goes the form [...]
            <p>Need to create an account? <NavLink to="/singup">Sign Up</NavLink>.</p>
          </Col>
        </Row>
      </div>
    );
    }
}

export default Login;
```

Now let's look at the LoginButtons component:

```javascript
import handleExternalLogin from '../../modules/social-logins.js';

export default class LoginButtons extends Component {
    constructor(props) {
        super(props);
        this.handleClick = this.handleClick.bind(this);
    }

    handleClick(event) {
        handleExternalLogin(event);
    }

    render() {
        return(
            <ButtonToolbar>
                <Button bsClass="btn btn-social btn-block btn-facebook" onClick={(event)=>this.handleClick(event.target.getAttribute("data-social-login"))} data-social-login="loginWithFacebook">
                    <span className="fa fa-facebook"></span>Facebook
                </Button>
                <Button bsClass="btn btn-social btn-block btn-google" onClick={(event)=>this.handleClick(event.target.getAttribute("data-social-login"))} data-social-login="loginWithGoogle">
                    <span className="fa fa-google"></span>Google
                </Button>
            </ButtonToolbar>
        )
    }
};
```

Here we call the `handleExternalLogin` function with the `data-social-login` argument, this will later tell the function which service to log in with. Let's take a look at the function:

```javascript
const login = (service) => {
    const options = { requestPermissions: [ 'email' ] };

    Meteor[ service ](options, (error) => {
        if (error) {
            Bert.alert(error.reason, 'warning');
        } else {
            Bert.alert('Logged in!', 'success');
        }
      });
};

export default function handleExternalLogin(service) {
    login(service);
}
```

As you can see this call the appropriate `Meteor.loginWith<Service>` function to log in the user. We deleted the twitter service since it does not offer the users email.

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
    if (!user.roles) {
        user.roles = ["free-user"];
    } else {
        user.roles.push("free-user");
    }

    if (options.profile){
        user.profile = options.profile;
    }

    user.deleted = "no";
    const cleanUser = UserSchema.clean(user);
    return cleanUser;
});
```

With this we make sure that every new user has a `free-user` role when created and a `deleted` field for recycle bin purposes. This `deleted` field would either be the string `"no"` or the date it was deleted. The Schema does not work with `null` plus it's use is not recommended. The empty String also gives an error when creating the user, the schema says `deleted` is a required field, changing this to a non-empty String fixed the error.

## Setting up the LogIn/SignUp with `accounts-password`

For this part we will need to create the forms for signing in and logging in for the user in the respective pages. We'll also need the scripts to handle log in and signup plus we will use [jQuery validation](https://themeteorchef.com/tutorials/validating-forms-with-jquery-validation) to validate the forms. After that we also need a way to handle password recovery for the user.

### Setting up the forms

We have to use two forms to get user or info when logging in and signing up. These forms are very similar for logging in and signing up. Here is the sign up form.
This form calls the `handleSignup` function defined in a script in the `modules` folder.

```javascript
[...]
import handleSignup from '../../modules/signup';

export default class SignUp extends Component {
    componentDidMount() {
        handleSignup({ component: this });
    }

    handleSubmit(event) {
        event.preventDefault();
    }

    render() {
        return (
            [...]
            <form
            ref={ form => (this.signupForm = form) }
            onSubmit={ this.handleSubmit }
            >
                <Row>
                    <Col xs={ 6 } sm={ 6 }>
                        <FormGroup>
                            <ControlLabel>First Name</ControlLabel>
                            <FormControl
                            type="text"
                            ref="firstName"
                            name="firstName"
                            placeholder="First Name"
                            />
                        </FormGroup>
                    </Col>
                    <Col xs={ 6 } sm={ 6 }>
                        <FormGroup>
                            <ControlLabel>Last Name</ControlLabel>
                            <FormControl
                            type="text"
                            ref="lastName"
                            name="lastName"
                            placeholder="Last Name"
                            />
                        </FormGroup>
                    </Col>
                </Row>
                <FormGroup>
                    <ControlLabel>Email Address</ControlLabel>
                    <FormControl
                    type="text"
                    ref="emailAddress"
                    name="emailAddress"
                    placeholder="Email Address"
                    />
                </FormGroup>
                <FormGroup>
                    <ControlLabel>Password</ControlLabel>
                    <FormControl
                    type="password"
                    ref="password"
                    name="password"
                    placeholder="Password"
                    />
                </FormGroup>
                <Button type="submit" bsStyle="success" block>Sign Up</Button>
            </form>
            [...]
        );
    }
}

```


## The `handleSignup` function

With this script we handle the log in and sign up of the user and also the form validation with jQuery. The log in script will be similar but we will call the `Meteor.loginWithPassword` function.

```javascript
import { Accounts } from 'meteor/accounts-base';
import { Bert } from 'meteor/themeteorchef:bert';
import './validation.js';

let component;

const getUserData = () => ({
    email: document.querySelector('[name="emailAddress"]').value,
    password: document.querySelector('[name="password"]').value,
    profile: {
        name: {
            first: document.querySelector('[name="firstName"]').value,
            last: document.querySelector('[name="lastName"]').value,
        },
    },
});

const signup = () => {
    const user = getUserData();

    Accounts.createUser(user, (error) => {
        if (error) {
            Bert.alert(error.reason, 'danger');
        } else {
            Bert.alert('Welcome!', 'success');
        }
    });
};

const validate = () => {
    $(component.signupForm).validate({
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
        },
        messages: {
            firstName: {
                required: 'First name?',
            },
            lastName: {
                required: 'Last name?',
            },
            emailAddress: {
                required: 'Need an email address here.',
                email: 'Is this email address legit?',
            },
            password: {
                required: 'Need a password here.',
                minlength: 'Use at least six characters, please.',
            },
        },
        submitHandler() { signup(); },
    });
};

export default function handleSignup(options) {
    component = options.component;
    validate();
}
```
### Password Recovery

#### Using the Email Package
To do the password recovery we have to set up sending emails first. As explained in the guide from The Meteor Chef to [set up the email package](https://themeteorchef.com/tutorials/using-the-email-package).

We need to install the `email` package from meteor, then we have to set up an email provider like [Mailgun](https://mailgun.com/), there are other providers, we'll use this.

Get an account, by default we get a sandbox URL from Mailgun, but we can create a custom domain, too. For the sandbox URL you can only send emails to 5 authenticated emails, this is to prevent spam. I think that if you set up your domain you don't have this limitation.

After getting the accounts you have to set up the `MAIL_URL` environment variable in meteor. We will set this up on our `settings.json` file, and then call it on the server on startup.

```
process.env.MAIL_URL = "smtp://postmaster%40<your-mailgun-address>.mailgun.org:password@smtp.mailgun.org:587";
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

#### Password Recovery and respective

First we set up a Recovery Password component that will call the `recover-password` script. The component for password recovery is a simple form that asks for the user email. The script then validates the form and calls the `Accounts.forgotPassword` method that sends an email to the one provided.

You can set the email template that this method is going to send by using the helper methods in the `accounts-base` package. This would be the code for that, to be run in the server at startup.

```javascript
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
    const emailBody = `A password reset has been requested for the account related to this address (${userEmail}). To reset the password, visit the following link: \n\n${urlWithoutHash}\n\n If you did not request this reset, please ignore this email. If you feel something is wrong, please contact our support team: ${email}.`

    return emailBody;
  },
};
```

This email sends a `url` with a token to the user. This url will load the ResetPassword component which is a simple form asking for the new password. The reset-password password script is loaded then and it validates the form and calls the `Accounts.resetPassword` method that takes as arguments the token send in the url and the new password. After the password is set we redirect the user to `/`, to do this with react-router4 we run:

```javascript
component.props.history.push('/');
```

## Verification Email

When doing to sign up we call the `Accounts.createUser` function, in the callback of this method we add a call to a new method called `sendVerificationLink`.

```javascript
Accounts.createUser( user, ( error ) => {
      if ( error ) {
        Bert.alert( error.reason, 'danger' );
      } else {
        Meteor.call( 'sendVerificationLink', ( error, response ) => {
          if ( error ) {
            Bert.alert( error.reason, 'danger' );
          } else {
            Bert.alert( 'Welcome!', 'success' );
          }
      });
  }});
```
This new method is going to call the `Accounts.sendVerificationEmail` when a new user is created, as with password reset this email template can be defined with `Accounts.emailTemplates.verifyEmail`.

```javascript
'sendVerificationLink': function sendVerificationLink() {
    const userId = Meteor.userId();
    if ( userId ) {
        return Accounts.sendVerificationEmail( userId );
    }
}
```

This email is going to have an url with a token, the VerifyEmail component that loads is going to call the `Accounts.verifyEmail` method, that takes as argument the token in the url to update the corresponding email address to verified. After the verification is done we redirect the router like shown bellow.

```javascript
export default class VerifyEmail extends Component{
    componentDidMount(){
        Accounts.verifyEmail( this.props.match.params.token, ( error ) =>{
            if ( error ) {
                Bert.alert( error.reason, 'danger' );
                this.props.history.push('/');
            } else {
                Bert.alert( 'Email verified! Thanks!', 'success' );
                this.props.history.push('/one');
            }
        });
    }
    render() {
        return (<div></div>);
    }
}
```

Also for the external services for logging in we are going to take the email from services, add it to the email field and set it as verified. To do this we'll call a helper function on the `Accounts.onCreateUser` hook.

```javascript
Accounts.onCreateUser((options, user) => {
    if (!user.roles) {
        user.roles = ["free-user"];
    } else {
        user.roles.push("free-user");
    }

    if (options.profile){
        user.profile = options.profile;
    }
    if (!user.emails){
        user.emails = [{"address": getEmail(user),
                        "verified": true}];
    }

    user.deleted = "no";
    const cleanUser = UserSchema.clean(user);
    return cleanUser;
});
```

This is the helper function:

```javascript
const getUserEmail = ( user ) => {
    let emails   = user.emails,
    services = user.services;
    return _getEmailFromService( services );
};

const _getEmailFromService = ( services ) => {
    for ( let service in services ) {
        let current = services[ service ];
        return current.email;
    }
};

export default function getEmail(user) { return getUserEmail(user); };
```

## Useful links

-   [`aldeed:collection2-core` Documentation](https://github.com/aldeed/meteor-collection2-core#aldeedcollection2-core)
-   [`simple-schema` Documentation](https://github.com/aldeed/node-simple-schema#simple-schema)
-   [`meteor-roles` Documentation](https://github.com/alanning/meteor-roles#meteor-roles)