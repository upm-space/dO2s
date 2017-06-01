# Authenticated Navigation with React Router 4

Source - [Getting Started With React Router 4](https://themeteorchef.com/tutorials/getting-started-with-react-router-v4)

With React Router 4 we are going to be handling authentication at component level. To do this we need two pieces of data from Meteor: the `Meteor.logginIn()` method and the `Meteor.userId()` method. Between this two functions we can determine whether or not a user is currently logged into the application. Because we need to know this on multiple pages, it makes sense to gather this information up once here in our `<Routes />` component and pass it down to the pages that need it via props.

```javascript
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

To do the passing we're relying on the creation of a container with `react-meteor-data`. We're using this here because our data container is reactive, meaning, as data changes (in other words, as our user logs in or logs out), the props passed to our "wrapped" component are updated.

We are going to rely on `<Authenticated/>` and `<Public/>` to solve two problems:

1.  Routing users _away_ from pages where a logged-in/authenticated user is required when a logged-in user in _not_ present.
2.  Routing users _away_ from pages that are only meant for logged-out/unauthenticated users.

Because these two components are fairly identical, we can step through one in its entirety `<Authenticated />` and then preview the other `<Public />`, assuming the same concepts. Let's set up our `<Authenticated />` component now and walk through it. We'll also use `<AdminPage/>` for administrator role pages.

```javascript
const Authenticated = ({ loggingIn, authenticated, isAdmin, component, ...rest }) => (
  <Route {...rest} render={(props) => {
    if (loggingIn) return <div></div>;
    return authenticated ?
    (React.createElement(component, { ...props, loggingIn, authenticated, isAdmin})) :
    (<Redirect to="/login" />);
  }} />
);

Authenticated.PropTypes = {
  loggingIn: PropTypes.bool,
  authenticated: PropTypes.bool,
  isAdmin: PropTypes.bool,
  component: PropTypes.func,
};

export default Authenticated;
```

Starting at the top of our file with the signature of our component (the `const Authenticated = ...` part), we begin by using a bit of ES2015/ES6 destructuring to pick apart the props passed to our component. So that's clear, if we take a look at one of our routes...

```javascript
<Authenticated exact path="/two" component={Two} {...routesProps} />
```
We can see a few props defined on that component. In the code above, we're gaining access to a few different props. Extending the object a bit:

```javascript
{
  // The loggingIn prop passed from our data container.
  loggingIn,
  // The authenticated prop passed from our data container.
  authenticated,
  // The isAdmin prop passed from our data container.
  isAdmin,
  // The component prop passed directly to the <Authenticated /> component.
  component,
  // All of the other props passed to the the <Authenticated /> component.
  ...rest,
}
```
Here we destructure or "pluck" off four props from our `<Authenticated />` component. The first two, `loggingIn`, `authenticated` and `isAdmin` are the props passed down to us from the data container that we set up earlier in `/imports/startup/client/Routes.js`. The third, `component`, is the `component` prop that we passed to our `<Authenticated />` component directly. The last prop is a bit funky. What's with the dots? This is known as a "rest" operator (new in ES2015/ES6). This is saying "gather up the rest of the arguments into one variable called `rest`."


If we look back in our component's code, we can see on the first line of our function (this is a [stateless functional React component](https://themeteorchef.com/blog/understanding-react-component-types) which looks like a vanilla JavaScript function but returns a React component) that we're using the ES2015/ES6 spread operator `...` to "unpack" all of the other props scooped up by the `...rest` in our set of destructured arguments.

In React, if we wrap a spread operator like `{...rest}` in brackets and pass it like a prop to a component—like we do here with the` <Route />` component imported from the `react-router-dom` package—React will simply "unpack" each prop and apply it to that component independently. For example, one of the props we haven't "plucked off" in our destructuring is the `path` prop specifying the URL path for our `<Authenticated />` route. That exists in the `...rest` argument we _did_ pluck off, meaning, when we add it to the `<Route />` component with `{...rest}` here, we're effectively setting a `path` prop on the `<Route />` component like `<Route path={path} />`. Wild, eh?

Continuing our focus on the `<Route />` component here, next, we're introduced to a new feature of React Router v4: the `render` prop. Where in past versions what our `<Route />` component rendered could only be specified by a single `component` prop, now, we get `render`. This allows us to take in the `props` that the `<Route />` would pass down to our component and do some custom, inline rendering.

In our case, here, we use the `render` prop to manage what gets rendered based on our authentication state. Inside, if our `loggingIn` prop returns `true`, we want to display an empty `<div></div>` element on screen so we don't see a flash of the authenticated content (because Meteor's data is live, there's a short gap between the app loading and us having access to the user).

Once `loggingIn` is `false`—meaning we either have a user or we don't—we test the `authenticated` prop we passed down (remember, this is equal to whether or not `Meteor.loggingIn()` is `false` and whether a `Meteor.userId()` is available. If a `userId` is available, we make a call to `React.createElement()` to render the `component` that we passed to our `<Authenticated />` route, adding in any props that we want applied to the component. In this case `{ ...props, loggingIn, authenticated, isAdmin }`, or, all of the `props` passed to us by the `render` prop on `<Route />` as well as the `loggingIn` and `authenticated` props we passed from our data container.

If `authenticated` is `false`—meaning we _don't_ have a `userId`—we use the new `<Redirect />` component in v4 to redirect the user to the `/login` page. That's it! Whenever this specific route is loaded, it will only render the page when our `authenticated` prop is `true`. Otherwise, the user will be redirected, keeping our authenticated page safe from public access.

Now, like we mentioned earlier, let's take a quick look at our `<Public />` component. It's nearly identical to what we just covered above, with one little tweak.

```javascript
const Public = ({ loggingIn, authenticated, component, ...rest }) => (
  <Route {...rest} render={(props) => {
    if (loggingIn) return <div></div>;
    return !authenticated ?
    (React.createElement(component, { ...props, loggingIn, authenticated })) :
    (<Redirect to="/one" />);
  }} />
);

Public.propTypes = {
  loggingIn: PropTypes.bool,
  authenticated: PropTypes.bool,
  component: PropTypes.func,
};

export default Public;
```

See, pretty close! Can you spot the difference? It's pretty tiny. Inside of our `render` prop function on the `<Route />` component here, we've inverted our test of the `authenticated` prop that we've passed in. The idea here is that if this page is meant to be only accessible to the public, we want to redirect users away from it if they're already logged in. For example, if we logged in and then tried to go to `/signup`, that wouldn't make a whole lot of sense so we redirect the user away.

Cool! At this point, we have the fundamentals of our routing set up, but we're not quite done yet. Next up, we need to cover a few specifics like handling navigation items, ingesting params from the URL, and performing redirects programmatically.

And finally this is the `<AdminPage />` used to load admin-only components for the app, this would be the same as the `Authenticated` but after checking if the user is logged in we do a check for the user role.

```javascript
const AdminPage = ({ loggingIn, authenticated, isAdmin, component, ...rest }) => (
  <Route {...rest} render={(props) => {
    if (loggingIn) return <div></div>;
    if (authenticated){
        if (isAdmin) {
            return React.createElement(component, { ...props, loggingIn, authenticated, isAdmin});
        } else {
            return <Redirect to="/one" />;
        }
    } else {
        return <Redirect to="/login" />;
    }
    }}
     />
);

AdminPage.PropTypes = {
  loggingIn: PropTypes.bool,
  authenticated: PropTypes.bool,
  isAdmin: PropTypes.bool,
  component: PropTypes.func,
};

export default AdminPage;
```
