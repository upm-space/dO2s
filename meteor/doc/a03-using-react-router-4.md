# Using React Router v4
As of this writing `react-router` is in version `4.1.1`

-   [Meteor Chef - Getting Started with React Router 4](https://themeteorchef.com/tutorials/getting-started-with-react-router-v4)
-   [React Router Documentation](https://reacttraining.com/react-router/web/guides/quick-start)
-   [React Router 4 Basics](https://teamtreehouse.com/library/react-router-4-basics-2)

###### Some Tips

-   [Nesting in ReactRouter v4](https://teamtreehouse.com/community/warning-you-should-not-use-route-component-and-route-children-in-the-same-route-route-children-will-be-ignored)
-   [Quick tut to ReactRouter 4](https://medium.com/@pshrmn/a-simple-react-router-v4-tutorial-7f23ff27adf)

---

In React Router, we rely on nesting React components using a concept known as Higher-Order Components (HOCs). This means that we define our routes _within_ our other React components, as opposed to standalone in another file. At first glance this is a bit alarming, but once you get used to it starts to make sense. Our routes are defined _where we need them_, meaning that routing becomes more contextual and easy to follow. Quite literally, our routes are defined where they're rendered.

## Installation

We need the new package `react-router-dom` to help us define routers in the browser and not with `react-router-native`
```bash
meteor npm install --save react react-router-dom
```

## Moving our routes into our App layout
Let's get the shock factor out of the way now. The biggest change in React Router v4 is the suggestion that our routes should _**not**_ be defined in a file separate from our components. Instead, in the latest version, routes are defined at the component-level.

In version 3, we import all of our components into one file and define our routes in the same location, too. Simple enough, however, in v4 of React Router we handle routing a bit differently. To begin, let's update the `/imports/startup/client/index.js` file to look like this:

```javascript
import React from 'react';
import { render } from 'react-dom';
import { Bert } from 'meteor/themeteorchef:bert';
import { Meteor } from 'meteor/meteor';

import 'bootstrap';
import 'bootstrap/dist/css/bootstrap.min.css';

import App from '../../ui/layouts/App/App';
import '../../ui/stylesheets/app.scss';

Bert.defaults.style = 'growl-top-right';

Meteor.startup(() => {
  render(<App />, document.getElementById('react-root'));
});
```

The big part to pay attention to is our importing and rendering of the `<App />` component. If we look back up at our `routes.js` file, we'll notice that we were rendering the `<Router />` component from React Router directly.

Now, we want to move our routes into our components. As a result, we'll be moving our routes into our main `<App />` component. In the code here, we're saying that when the client-side of Meteor starts up, we want to use the `render()` method from the `react-dom` package to render the `<App />`—and subsequently, the routes it contains—into the `<div id="react-root"></div>` element defined in `/client/main.html`.

Because this is only half the picture, let's take a look at the `<App />` component now to see how our routes are being defined.

```javascript
import React from 'react';
import PropTypes from 'prop-types';
import { Grid } from 'react-bootstrap';
import { Meteor } from 'meteor/meteor';
import { createContainer } from 'meteor/react-meteor-data';
import { BrowserRouter as Router, Route, Switch } from 'react-router-dom';
import { Roles } from 'meteor/alanning:roles';

import Navigation from '../../components/Navigation/Navigation';
import Index from '../../pages/Index/Index';
import One from '../../pages/One/One';
import Two from '../../pages/Two/Two';
import NotFound from '../../pages/NotFound/NotFound';
import SignUp from '../../pages/Signup/SignUp';
import Login from '../../pages/Login/Login';
import Logout from '../../pages/Logout/Logout';
import RecoverPassword from '../../pages/RecoverPassword/RecoverPassword';
import ResetPassword from '../../pages/ResetPassword/ResetPassword';
import Profile from '../../pages/Profile/Profile';
import VerifyEmail from '../../pages/VerifyEmail/VerifyEmail';
import Footer from '../../components/Footer/Footer';
import Terms from '../../pages/Terms/Terms';
import Privacy from '../../pages/Privacy/Privacy';
import ExamplePage from '../../pages/ExamplePage/ExamplePage';

import Public from '../../components/Public/Public';
import Authenticated from '../../components/Authenticated/Authenticated';
import AdminPage from '../../components/Administrator/AdminPage';
import EmailNotVerified from '../../components/EmailNotVerified/EmailNotVerified';

import UserManagementLayout from '../../pages/UserManagement/UserMngLayout';

const App = props => (
  <Router>
    {!props.loading ? <div className="App">
      <Navigation {...props} />
      <Grid fluid>
        <Switch>
          <Route exact name="index" path="/" component={Index} />
          <AdminPage exact path="/usrmng" component={UserManagementLayout} {...props} />
          <Authenticated exact path="/projects" component={One} {...props} />
          <Authenticated exact path="/hangar" component={Two} {...props} />
          <EmailNotVerified exact path="/profile" component={Profile} {...props} />
          <Public path="/signup" component={SignUp} {...props} />
          <Public path="/login" component={Login} {...props} />
          <Public path="/logout" component={Logout} {...props} />
          <Route name="verify-email" path="/verify-email/:token" component={VerifyEmail} />
          <Route name="recover-password" path="/recover-password" component={RecoverPassword} />
          <Route name="reset-password" path="/reset-password/:token" component={ResetPassword} />
          <Route name="terms" path="/terms" component={Terms} />
          <Route name="privacy" path="/privacy" component={Privacy} />
          <Route name="examplePage" path="/example-page" component={ExamplePage} />
          <Route component={NotFound} />
        </Switch>
      </Grid>
      <Footer />
    </div> : ''}
  </Router>
);

App.defaultProps = {
  userId: '',
  emailAddress: '',
};

App.propTypes = {
  loading: PropTypes.bool.isRequired,
};

const getUserName = name => ({
  string: name,
  object: `${name.first} ${name.last}`,
}[typeof name]);

export default createContainer(() => {
  const loggingIn = Meteor.loggingIn();
  const user = Meteor.user();
  const userId = Meteor.userId();
  const loading = !Roles.subscription.ready();
  const name = user && user.profile && user.profile.name && getUserName(user.profile.name);
  const emailAddress = user && user.emails && user.emails[0].address;
  const userType = user ? (user.emails ? 'password' : 'oauth') : '';
  const passwordUserEmailVerified = userType === 'password' ? (user && user.emails && user.emails[0].verified) : true;
  const emailVerified = user ? passwordUserEmailVerified : false;

  return {
    loading,
    loggingIn,
    authenticated: !loggingIn && !!userId,
    name: name || emailAddress,
    roles: !loading && Roles.getRolesForUser(userId),
    isAdmin: Roles.userIsInRole(Meteor.userId(), 'admin'),
    userType,
    userId,
    emailAddress,
    emailVerified,
  };
}, App);

```

If we move up a bit to our `<App />` component's definition, we get our first taste of defining routes with React Router v4. In truth, beyond the move that we just explored, defining routes isn't too different from before. The first thing to pay attention to is where the different bits of React Router are coming from. As we hinted above when installing our dependencies, as opposed to the original `react-router` package, now, we pull everything we need from the `react-router-dom` package. Why?

As of v4, React Router supports routing in two different contexts: the browser and React Native applications. When we're working with the browser, we want to rely on the `react-router-dom` package . For our needs in this file (`/imports/ui/layouts/App.js`), we're importing the `<BrowserRouter />` component (recasting it as `<Router />`), the `<Switch />` component, and the `<Route />` component. With these three, we have everything we need to set up our routes.

<!-- TODO - Handling authentication -->

## Defining our routes

First, in order for our routing to work properly, we want to wrap the `<Router />` component at the top-most level so that all of our components have access to the `<Router />` component's instance. While the bulk of our work here won't need this _too_ much, it's good to have just in case we need it later. Inside, we begin to define the contents of our `<App />` component. Have in mind that the `<Router />` component only accepts one child.

```javascript
const App = props => (
  <Router>
    {!props.loading ? <div className="App">
      <Navigation {...props} />
      <Grid fluid>
        <Switch>
          <Route exact name="index" path="/" component={Index} />
          <AdminPage exact path="/usrmng" component={UserManagementLayout} {...props} />
          <Authenticated exact path="/projects" component={One} {...props} />
          <Authenticated exact path="/hangar" component={Two} {...props} />
          <EmailNotVerified exact path="/profile" component={Profile} {...props} />
          <Public path="/signup" component={SignUp} {...props} />
          <Public path="/login" component={Login} {...props} />
          <Public path="/logout" component={Logout} {...props} />
          <Route name="verify-email" path="/verify-email/:token" component={VerifyEmail} />
          <Route name="recover-password" path="/recover-password" component={RecoverPassword} />
          <Route name="reset-password" path="/reset-password/:token" component={ResetPassword} />
          <Route name="terms" path="/terms" component={Terms} />
          <Route name="privacy" path="/privacy" component={Privacy} />
          <Route name="examplePage" path="/example-page" component={ExamplePage} />
          <Route component={NotFound} />
        </Switch>
      </Grid>
      <Footer />
    </div> : ''}
  </Router>
);
```

Inside of this, we start to "layout" our application. Because all of the pages in our application will need to display our navigation bar—the `<Navigation />` component—we render this above the definition for all of our routes. Because all of our route's components will be rendered in the same spot in our app, we nest our call to the `<Switch />` component from React Router inside of the `<Grid/>`. This wraps each route's contents (the component it renders) in a `<div className="container"></div>` element.

Now for the fun part. The `<Switch />` component has a special significance in React Router v4. What does it do? Now, by default routes in React Router v4 do something known as fuzzy matching. This means that any route matching the URL in the browser will be loaded. So, given two routes like the following:

```javascript
<Route path="/documents" component={Documents} />
<Route path="/documents/:_id" component={ViewDocument} />
```

if we were to visit the `/documents/:_id` route with something like `http://localhost:3000/documents/1234` in the browser, we'd see both the `<Documents />` and `<ViewDocument />` rendered. Yikes! To circumvent this behavior, in v4, we can wrap our routes in the `<Switch />` component to default back to the more traditional behavior of previous versions of React Router.


> If your application relies less on rendering complete pages and more on swapping parts in and out (think like in a [single page application](https://themeteorchef.com/tutorials/single-page-applications-with-react-router)), the default behavior of React Router v4 is your bag of chips.

Inside of our `<Switch />` component, we get down to defining our routes. For the most part, this looks identical to what we're doing above in our original `/imports/startup/routes.js` file. First, calling attention to the `<Route />` components in the list, these behave exactly like we'd expect. When the URL matches, the specified `component` is rendered. So, for the `path="/terms"` component, we'd see the `<Terms />` component rendered on screen. Cool.

<!-- TODO - Authenticated Routes -->

## Handling Navigation Items
In the previous section, we moved our routes into our main `<App />` layout component. We covered how routes are wired up—as well, we need to understand how to handle our navigation state. So, when we move from link to link, we highlight the correct or corresponding navigation item.

```javascript
import AuthenticatedNavigation from '../AuthenticatedNavigation/AuthenticatedNavigation';
import PublicNavigation from '../PublicNavigation/PublicNavigation';

const Navigation = props => (
  <Navbar collapseOnSelect fluid>
    <Navbar.Header>
      <Navbar.Brand>
        <Link to="/">dO2s</Link>
      </Navbar.Brand>
      <Navbar.Toggle />
    </Navbar.Header>
    <Navbar.Collapse>
      {props.authenticated ?
        <AuthenticatedNavigation isAdmin={props.isAdmin} {...props} /> :
        <PublicNavigation />}
    </Navbar.Collapse>
  </Navbar>
);

Navigation.defaultProps = {
  name: '',
};

Navigation.propTypes = {
  authenticated: PropTypes.bool.isRequired,
  isAdmin: PropTypes.bool.isRequired,
};

export default Navigation;
```

Real quick, we want to call attention to one thing: our `<Navigation />` component inside of our `<App />` component. Remember earlier when we mentioned the importance of wrapping our component's contents with the `<Router />` component so every element could have access? This is where it comes into play. Because we're wrapping our `<Navigation />` component with this, that means that we'll be able to see the current route state and update our links accordingly.


If we look at the internals of our `<Navigation />` component, we can see the same essential nav that we used with one twist. Here we map to our `authenticated` prop which is passed down from our `<App />` component's container.

Putting this to use, we test `authenticated` to determine which set of navigation links we want to render: those intended for public-facing users, or those that have already logged in to the app. Once we know the answer, we render the appropriate component. Let's take a look at the `<PublicNavigation />` component now to see how we handle our links and switching active state based on the URL.

```javascript
import React from 'react';
import { LinkContainer } from 'react-router-bootstrap';
import { NavItem, Nav } from 'react-bootstrap';

const PublicNavigation = () => (
  <Nav pullRight>
    <LinkContainer to="/signup">
      <NavItem eventKey={1} href="/signup">Sign Up</NavItem>
    </LinkContainer>
    <LinkContainer to="/login">
      <NavItem eventKey={2} href="/login">Log In</NavItem>
    </LinkContainer>
  </Nav>
);

export default PublicNavigation;
```

Well, this got easier! In React Router v3, getting active links set up required a bit of hoop jumping. Now, it's baked into the library. Here, in order to handle navigation, we import the `<LinkContainer />` component which gives us access to a wrapped version of React Router's `<NavLink />` component which is self-aware about whether or not the link it renders is currently active.

Because we are using `react-bootstrap` and `react-router` we need the `react-router-bootstrap` package that provides the `<LinkContainer />` component in which we have to wrap our  `<NavItem/>` components within `<Nav />` from `react-bootstrap`, the appropriate styles from Bootstrap will be automatically applied, and the `<LinkContainer />` passes the appropriate props to `<NavItem/>` in order to toggle the active class we want applied to the rendered element when the current URL matches. That's it!

Behind the scenes, if we look at the source of `<NavLink />`, we can see that it returns a `<Route />` component. This is important to pay attention to because it explains why we need our `<Navigation />` component wrapped in our `<Router />` component. With these pieces, inside of `<NavLink />`, we can see the code looking at the match prop passed to the component. Wait...`match`? Where's that coming from?

Though we don't see it, all `<Route />` components in React Router v4 are passed a handful of props, including `match`. `match` tells us about the current URL that matches the `<Route />` being rendered. This plays quite a bit into our next section, so let's look at that now and see how we can use it.

## Handling params

Getting to the end here! Just a few more things to cover, one of which is params. Params are the "dynamic" sections of URLs that we can swap in or out. Given a URL that looks something like this in the browser `http://localhost:3000/hello/Pili`, we want to be able to grab the `Pili` part so that we can pass it on to things like database queries to locate the corresponding document.

Real quick, if we look at the definition for a `<Hello />` component route...

```javascript
<Route path="/hello/:name" component={Hello}/>
```

The part we need to concern ourselves with is the `path` prop, and more specifically, the `:name` param. Here, we're saying that we expect `:name` to be _anything_. In order to get access to it, we need to interact with the aforementioned `match` prop that React Router passes us. Where do we do it, though? Like this.

```javascript
import React from 'react';

const Hello = ({ match }) => (
    <h3>Howdy, {match.params.name}!</h3>
)

export default Hello;
```

## Nesting Routes

As we said before in React Router, we rely on nesting React components using a concept known as Higher-Order Components (HOCs). This means that we define our routes _within_ our other React components, as opposed to standalone in another file. Quite literally, our routes are defined where they're rendered.

Getting the shock factor out of the way now. The biggest change in React Router v4 is the suggestion that our routes should _**not**_ be defined in a file separate from our components. Instead, in the latest version, routes are defined at the component-level.

There is still some opinions as to how to do this. We will cover some ways that successfully do nesting.

### [React Router Documentation](https://reacttraining.com/react-router/web/guides/quick-start)

This is the example in React Router Documentation,

```javascript
import React from 'react';
import {
  BrowserRouter as Router,
  Route,
  Link
} from 'react-router-dom';

const Home = () => (
  <div>
    <h2>Home</h2>
  </div>
);

const About = () => (
  <div>
    <h2>About</h2>
  </div>
);

const Topic = () => (
  <div>
    <h3>This is a nested Topic</h3>
  </div>
);

const Topics = ( ) => (
  <div>
    <h2>Topics</h2>
    // a list of topics
    <Route path="/topics/nested" component={Topic}/>
    <Route exact path="/topics" render={() => (
      <h3>Please select a topic.</h3>
    )}/>
  </div>
);

const BasicExample = () => (
  <Router>
    <div>
      <ul>
        <li><Link to="/">Home</Link></li>
        <li><Link to="/about">About</Link></li>
        <li><Link to="/topics">Topics</Link></li>
      </ul>

      <hr/>

      <Route exact path="/" component={Home}/>
      <Route path="/about" component={About}/>
      <Route path="/topics" component={Topics}/>
    </div>
  </Router>
);
export default BasicExample;
```

As you can see the nesting is done inside the `<Topics >` component, you wouldn't load all the components inside a routes file and then do the routing there. We would then load this basic example on the `index.js` file like this:

```javascript
import React from 'react';
import { render } from 'react-dom';
import { Meteor } from 'meteor/meteor';

import BasicExample from 'path-to-file';

Meteor.startup(() => {
    render(<BasicExample />, document.getElementById('react-root'));
});

```

But there are other ways to do this. Thins you need to have in mind:

-   `<Router >` component only accepts one child.
-   `<Switch >` component load the first child `<Route >` that matches, if no path is defined, the `<Route >`/`Component` is always rendered.


### First Level Nesting.

This first level nesting we do is usually the Main Layout of our App, inside this layout we want to put all of our stuff. Check nesting as explained here [Leveling Up With React: React Router](https://css-tricks.com/learning-react-router/).

Doing this is easy:

```javascript
const MainLayout = ( {children} ) => (
  <div>
    <h2>Main Layout</h2>
    {children}
  </div>
);

const Home = () => (
  <div>
    <h2>Home</h2>
  </div>
);

const About = () => (
  <div>
    <h2>About</h2>
  </div>
);

const FirstLevelNesting = () => (
  <Router>
      <MainLayout>
          <Switch>
              <Route exact path="/" component={Home}/>
              <Route path="/about" component={About}/>
          </Switch>
      </MainLayout>
    </div>
  </Router>
);
export default FirstLevelNesting;
```

Notice the `<Switch>` inside `<MainLayout>`, if we don't use a `<Switch>`, all the paths that match will be loaded.

### Second Level Nesting

This now gets trickier, we can't use the same pattern as before. If we load a component inside the `<Switch>` it will get loaded no matter what when `<Switch>` gets to it because it does not have a path. We have to user a middle man to do the nesting. This allows us for simpler parent routes and gives us a place to render content that is common across all router with the same prefix.

Following the example above, we add this:

```javascript
const NestedRoutes = () => (
    <div>
        <h2>This is my next nest</h2>
        <Switch>
            <Route exact path='/nextnest' component={Nest}/>
            <Route path='/nextnest/about' component={NestAbout}/>
        </Switch>
    </div>
)

const SecondLevelNesting = () => (
  <Router>
      <MainLayout>
          <Switch>
              <Route exact path="/" component={Home}/>
              <Route path="/about" component={About}/>
              <Route path="/nextnest" component={NestedRoutes}
          </Switch>
      </MainLayout>
    </div>
  </Router>
);
```
> Note: The route for the root always includes an exact prop. This is used to state that that route should only match when the pathname matches the route’s path exactly.

## No Match (404)
A `<Switch>` renders the first child `<Route>` that matches. A `<Route>` with no path always matches.

```javascript
const NoMatchExample = () => (
  <Router>
    <div>
      <ul>
        <li><Link to="/">Home</Link></li>
        <li><Link to="/old-match">Old Match, to be redirected</Link></li>
        <li><Link to="/will-match">Will Match</Link></li>
        <li><Link to="/will-not-match">Will Not Match</Link></li>
        <li><Link to="/also/will/not/match">Also Will Not Match</Link></li>
      </ul>
      <Switch>
        <Route path="/" exact component={Home}/>
        <Redirect from="/old-match" to="/will-match"/>
        <Route path="/will-match" component={WillMatch}/>
        <Route component={NoMatch}/>
      </Switch>
    </div>
  </Router>
)
```

## Performing redirects programmatically
Last but not least! In respect to routing, one more feature we need to look at is managing redirects when an action is performed.

<!-- TODO -->
