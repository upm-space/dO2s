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
import 'bootstrap';
import 'bootstrap/dist/css/bootstrap.min.css';
import React from 'react';
import { render } from 'react-dom';
import { Bert } from 'meteor/themeteorchef:bert';
import { Meteor } from 'meteor/meteor';

import Routes from './Routes';

Bert.defaults.style = 'growl-top-right';

Meteor.startup(() => {
    render(<Routes />, document.getElementById('react-root'));
});
```

The big part to pay attention to is our importing and rendering of the `<Routes />` component. If we look back up at our `routes.js` file, we'll notice that we were rendering the `<Router />` component from React Router directly.

Now, we want to move our routes into our components. As a result, we'll be moving our routes into our main `<Routes />` component. In the code here, we're saying that when the client-side of Meteor starts up, we want to use the `render()` method from the `react-dom` package to render the `<Routes />`—and subsequently, the routes it contains—into the `<div id="react-root"></div>` element defined in `/client/main.html`.

Because this is only half the picture, let's take a look at the `<Routes />` component now to see how our routes are being defined.

```javascript
import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { createContainer } from 'meteor/react-meteor-data';
import { render } from 'react-dom';
import { BrowserRouter as Router, Route, Switch } from 'react-router-dom';

import App from '../../ui/layouts/App';

import Index from '../../ui/pages/Index';
import One from '../../ui/pages/One';
import Two from '../../ui/pages/Two';
import NotFound from '../../ui/pages/NotFound';
import SignUp from '../../ui/pages/SignUp';
import Login from '../../ui/pages/Login';
import RecoverPassword from '../../ui/pages/RecoverPassword';
import ResetPassword from '../../ui/pages/ResetPassword';

import Public from '../../ui/pages/Public';
import Authenticated from '../../ui/pages/Authenticated';
import AdminPage from '../../ui/pages/AdminPage';

import UserManagementLayout from '../../ui/layouts/UserMngLayout';

const Routes = (routesProps) => (
    <Router>
        <App {...routesProps}>
            <Switch>
                <Route exact path="/" component={Index}/>
                <AdminPage exact path="/usrmng" component={UserManagementLayout} {...routesProps} />
                <Authenticated exact path="/one" component={One} {...routesProps} />
                <Authenticated exact path="/two" component={Two} {...routesProps} />
                <Public path="/signup" component={SignUp} {...routesProps} />
                <Public path="/login" component={Login} {...routesProps} />
                <Route path="/recover-password" component={ RecoverPassword } />
                <Route path="/reset-password/:token" component={ ResetPassword } />
                <Route component={ NotFound } />
            </Switch>
        </App>
    </Router>
);


Routes.PropTypes = {
    loggingIn: PropTypes.bool.isRequired,
    authenticated: PropTypes.bool.isRequired,
    isAdmin: PropTypes.bool.isRequired
}

export default createContainer(({match}) => {
    const loggingIn = Meteor.loggingIn();
    return {
        loggingIn: loggingIn,
        authenticated: !loggingIn && !!Meteor.userId(),
        isAdmin: Roles.userIsInRole(Meteor.userId(), "admin"),
    }
}, Routes);
```

If we move up a bit to our `<Routes />` component's definition, we get our first taste of defining routes with React Router v4. In truth, beyond the move that we just explored, defining routes isn't too different from before. The first thing to pay attention to is where the different bits of React Router are coming from. As we hinted above when installing our dependencies, as opposed to the original `react-router` package, now, we pull everything we need from the `react-router-dom` package. Why?

As of v4, React Router supports routing in two different contexts: the browser and React Native applications. When we're working with the browser, we want to rely on the `react-router-dom` package . For our needs in this file (`/imports/ui/routes/Routes.jsx`), we're importing the `<BrowserRouter />` component (recasting it as `<Router />`), the `<Switch />` component, and the `<Route />` component. With these three, we have everything we need to set up our routes.

<!-- TODO - Handling authentication -->

## Defining our routes

First, in order for our routing to work properly, we want to wrap the `<Router />` component at the top-most level so that all of our components have access to the `<Router />` component's instance. While the bulk of our work here won't need this _too_ much, it's good to have just in case we need it later. Inside, we begin to define the contents of our `<Routes />` component, starting with our main wrapper `<App> </App>` element. Have in mind that the `<Router />` component only accepts one child.

```javascript
import React, { Component } from 'react';
import PropTypes from 'prop-types';
import Navigation from '../components/Navigation';
import PublicNavigation from '../components/PublicNavigation';
import { Grid } from 'react-bootstrap';

const renderNavigation = (authenticated, isAdmin) =>
(authenticated ? <Navigation isAdmin={isAdmin} /> : <PublicNavigation />);


const App = ( {children, authenticated, isAdmin} ) => (
    <div className="App">
        { renderNavigation(authenticated, isAdmin) }
        <Grid fluid>
            {children}
        </Grid>
    </div>
);

App.PropTypes = {
  authenticated: PropTypes.bool,
  children: PropTypes.node,
  isAdmin:  PropTypes.bool
};

export default App;
```

Inside of this, we start to "layout" our application. Because all of the pages in our application will need to display our navigation bar—the `<Navigation />` component—we render this above the definition for all of our routes. Because all of our route's components will be rendered in the same spot in our app, we nest our call to the `<Switch />` component from React Router inside of the `<Grid/>`. This wraps each route's contents (the component it renders) in a `<div className="container"></div>` element.

Now for the fun part. The `<Switch />` component has a special significance in React Router v4. What does it do? Now, by default routes in React Router v4 do something known as fuzzy matching. This means that any route matching the URL in the browser will be loaded. So, given two routes like the following:

```javascript
<Route path="/documents" component={Documents} />
<Route path="/documents/:_id" component={ViewDocument} />
```

if we were to visit the `/documents/:_id` route with something like `http://localhost:3000/documents/1234` in the browser, we'd see both the `<Documents />` and `<ViewDocument />` rendered. Yikes! To circumvent this behavior, in v4, we can wrap our routes in the `<Switch />` component to default back to the more traditional behavior of previous versions of React Router.


> If your application relies less on rendering complete pages and more on swapping parts in and out (think like in a [single page application](https://themeteorchef.com/tutorials/single-page-applications-with-react-router)), the default behavior of React Router v4 is your bag of chips.

Inside of our `<Switch />` component, we get down to defining our routes. For the most part, this looks identical to what we're doing above in our original `/imports/startup/routes.js` file. First, calling attention to the `<Route />` components in the list, these behave exactly like we'd expect. When the URL matches, the specified `component` is rendered. So, for the `path="/one"` component, we'd see the `<One />` component rendered on screen. Cool.

<!-- TODO - Authenticated Routes -->

## Handling Navigation Items
In the previous section, we moved our routes into our main `<Routes />` layout component. We covered how routes are wired up—as well, we need to understand how to handle our navigation state. So, when we move from link to link, we highlight the correct or corresponding navigation item.

```javascript
const renderNavigation = (authenticated, isAdmin) =>
(authenticated ? <Navigation isAdmin={isAdmin} /> : <PublicNavigation />);


const App = ( {children, authenticated, isAdmin} ) => (
    <div className="App">
        { renderNavigation(authenticated, isAdmin) }
        <Grid fluid>
            {children}
        </Grid>
    </div>
);
```

Real quick, we want to call attention to one thing: our `<Navigation />` component inside of our `<App />` component. Remember earlier when we mentioned the importance of wrapping our component's contents with the `<Router />` component so every element could have access? This is where it comes into play. Because we're wrapping our `<Navigation />` component with this, that means that we'll be able to see the current route state and update our links accordingly.

```javascript
const handleLogout = () => Meteor.logout();

const userName = () => {
  const user = Meteor.user();
  const name = user && user.profile ? user.profile.name : '';
  if (typeof name === "string"){
      return user ? `${name}` : '';
  } else {
      return user ? `${name.first} ${name.last}` : '';
  }

};

const UserMngButton = (isAdmin) => {
    if (isAdmin) {
        return (
            <LinkContainer to="/usrmng">
                  <NavItem eventKey={3}><Glyphicon glyph="user"/> User Manager</NavItem>
            </LinkContainer>
        )
    }
}

const Navigation = ({isAdmin}) => (
    <Navbar collapseOnSelect fluid>
        <Navbar.Header>
            <Navbar.Brand>
                <LinkContainer to="/" exact>
                    <Button bsStyle="link">dO2s</Button>
                </LinkContainer>
            </Navbar.Brand>
            <Navbar.Toggle />
        </Navbar.Header>
        <Navbar.Collapse>
        <Nav>
            <LinkContainer to="/one">
                  <NavItem eventKey={1}>Projects</NavItem>
            </LinkContainer>
            <LinkContainer to="/two">
                  <NavItem eventKey={2}>Missions</NavItem>
            </LinkContainer>
            {UserMngButton(isAdmin)}
        </Nav>
        <Nav pullRight>
            <NavDropdown eventKey={ 6 } title={ userName() } id="basic-nav-dropdown">
                <MenuItem eventKey={ 6.1 }>Change Password</MenuItem>
                <MenuItem eventKey={ 6.2 } onClick={ handleLogout }>Logout</MenuItem>
            </NavDropdown>
        </Nav>
        </Navbar.Collapse>
    </Navbar>
);

export default Navigation;
```

If we look at the internals of our `<Navigation />` component, we can see the same essential nav that we used with one twist. Here we map to our `authenticated` prop which is passed down from our `<Routes />` component's container.

Putting this to use, we test `authenticated` to determine which set of navigation links we want to render: those intended for public-facing users, or those that have already logged in to the app. Once we know the answer, we render the appropriate component. Let's take a look at the `<PublicNavigation />` component now to see how we handle our links and switching active state based on the URL.

```javascript
const PublicNavigation = () => (
    <Navbar collapseOnSelect fluid>
        <Navbar.Header>
            <Navbar.Brand>
                <LinkContainer to="/">
                    <Button bsStyle="link">dO2s</Button>
                </LinkContainer>
            </Navbar.Brand>
            <Navbar.Toggle />
        </Navbar.Header>
        <Navbar.Collapse>
        <Nav pullRight>
            <LinkContainer to="/signup">
            <NavItem eventKey={1}>Sign Up</NavItem>
            </LinkContainer>
            <LinkContainer to="/login">
            <NavItem eventKey={2}>Log In</NavItem>
            </LinkContainer>
        </Nav>
        </Navbar.Collapse>
    </Navbar>
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
