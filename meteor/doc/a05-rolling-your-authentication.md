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

After doing this we can create our components to make the sing up and log in pages. We'll be using the social buttons we just imported.

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
import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { Button, ButtonToolbar } from 'react-bootstrap';
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
                <Button bsClass="btn btn-social btn-block btn-twitter" onClick={(event)=>this.handleClick(event.target.getAttribute("data-social-login"))} data-social-login="loginWithTwitter">
                    <span className="fa fa-twitter"></span>Twitter
                </Button>
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
import { Redirect } from 'react-router-dom';
import { Meteor } from 'meteor/meteor';
import { Bert } from 'meteor/themeteorchef:bert';

const login = (service) => {
    const options = { requestPermissions: [ 'email' ] };


    if ( service === 'loginWithTwitter' ) {
      delete options.requestPermissions;
    }

    Meteor[ service ](options, (error) => {
        if (error) {
            Bert.alert(error.reason, 'warning');
        } else {
            Bert.alert('Logged in!', 'success');

            // const { location } = component.props;
            // if (location.state && location.state.nextPathname) {
            //     history.push(location.state.nextPathname)
            // } else {
            //     history.push('/')
            // }
        }
      });
};

export default function handleExternalLogin(service) {
    login(service);
}
```

<!-- TODO - handle redirects when logged in -->

As you can see this call the appropiate `Meteor.loginWith<Service>` function to log in the user.

## 
