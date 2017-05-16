# Using React Router v4
As of this writing `react-router` is in version `4.1.1`

-   [Meteor Chef - Getting Started with React Router 4](https://themeteorchef.com/tutorials/getting-started-with-react-router-v4)
-   [React Router Documentation](https://reacttraining.com/react-router/web/guides/quick-start)

###### Some Tips

-   [Nesting in ReactRouter v4](https://teamtreehouse.com/community/warning-you-should-not-use-route-component-and-route-children-in-the-same-route-route-children-will-be-ignored)
-   [Quick tut to ReactRouter 4](https://medium.com/@pshrmn/a-simple-react-router-v4-tutorial-7f23ff27adf˚)

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
import { Meteor } from 'meteor/meteor';

import Routes from '../../ui/routes/Routes';

console.log(Routes);

Meteor.startup(() => {
    render(<Routes />, document.getElementById('react-root'));
});
```

The big part to pay attention to is our importing and rendering of the `<Routes />` component. If we look back up at our `routes.js` file, we'll notice that we were rendering the `<Router />` component from React Router directly.

Now, we want to move our routes into our components. As a result, we'll be moving our routes into our main `<Routes />` layout component. In the code here, we're saying that when the client-side of Meteor starts up, we want to use the `render()` method from the `react-dom` package to render the `<Routes />`—and subsequently, the routes it contains—into the `<div id="react-root"></div>` element defined in `/client/main.html`.

Because this is only half the picture, let's take a look at the `<Routes />` component now to see how our routes are being defined.

```javascript
import React from 'react';
import { render } from 'react-dom';
import { BrowserRouter as Router, Route, Switch } from 'react-router-dom';

import App from '../layouts/app';

import Home from '../pages/home';
import One from '../pages/one';
import Two from '../pages/two';
import NotFound from '../pages/not-found';

import UserCouta from '../forms/user-cuota';
import { UserManagementLayout } from '../layouts/user-mng-layout';


const Routes = () => (
    <Router>
        <App>
            <Switch>
                <Route exact path="/" component={ Home }/>
                <Route path="/usrmng" component={ UserManagementRoutes } />
                <Route path="/one" component={ One } />
                <Route path="/two" component={ Two } />
                <Route component={ NotFound } />
            </Switch>
        </App>
    </Router>
);

const UserManagementRoutes = () => (
    <UserManagementLayout>
        <Route path="/usrmng/user-cuota" component={UserCouta} />
    </UserManagementLayout>
);


export default Routes;
```

If we move up a bit to our `<Routes />` component's definition, we get our first taste of defining routes with React Router v4. In truth, beyond the move that we just explored, defining routes isn't too different from before. The first thing to pay attention to is where the different bits of React Router are coming from. As we hinted above when installing our dependencies, as opposed to the original `react-router` package, now, we pull everything we need from the `react-router-dom` package. Why?

As of v4, React Router supports routing in two different contexts: the browser and React Native applications. When we're working with the browser, we want to rely on the `react-router-dom` package . For our needs in this file (`/imports/ui/routes/Routes.jsx`), we're importing the `<BrowserRouter />` component (recasting it as `<Router />`), the `<Switch />` component, and the `<Route />` component. With these three, we have everything we need to set up our routes.

<!-- TODO - Handling authentication -->

## Defining our routes

First, in order for our routing to work properly, we want to wrap the `<Router />` component at the top-most level so that all of our components have access to the `<Router />` component's instance. While the bulk of our work here won't need this too much, it's good to have just in case we need it later. Inside, we begin to define the contents of our `<Routes />` component, starting with our main wrapper `<App> </App>` element. Have in mind that the `<Router />` component only accepts one child.

```javascript
import React from 'react';
import Navigation from '../components/navigation';

const App = ( {children} ) => (
    <div className="App">
        <Navigation />
        {children}
    </div>
);

export default App;
```

Inside of this, we start to "layout" our application. Because all of the pages in our application will need to display our navigation bar—the `<Navigation />` component—we render this above the definition for all of our routes. Because all of our route's components will be rendered in the same spot in our app, we nest our call to the `<Switch />` component from React Router. This wraps each route's contents (the component it renders) in a `<div className="container"></div>` element. ¿Does it? Here the `<Switch />` component is nested inside our `<App>` layout.

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
import React from 'react';
import Navigation from '../components/navigation';

const App = ( {children} ) => (
    <div className="App">
        <Navigation />
        {children}
    </div>
);

export default App;
```

Real quick, we want to call attention to one thing: our `<Navigation />` component inside of our `<App />` component. Remember earlier when we mentioned the importance of wrapping our component's contents with the `<Router />` component so every element could have access? This is where it comes into play. Because we're wrapping our `<Navigation />` component with this, that means that we'll be able to see the current route state and update our links accordingly.

```javascript
import React from 'react';
import { NavLink } from 'react-router-dom';

const Navigation = () => (
<nav className="navbar navbar-ipsilum">
    [...]
    <li><NavLink to="/" activeClassName="active">[...] <b>HOME</b></NavLink></li>
    <li><NavLink to="/usrmng" activeClassName="active">[...]<b>USER MNG</b></NavLink></li>
    [...]
</nav>
);

export default Navigation;
```
Let's take a look at the `<Navigation />` component now to see how we handle our links and switching active state based on the URL.

Well, this got easier! In React Router v3, getting active links set up required a bit of hoop jumping. Now, it's baked into the library. Here, in order to handle navigation, we import the `<NavLink />` component which gives us access to a wrapped version of React Router's `<Link />` component which is self-aware about whether or not the link it renders is currently active.

Here, in order to toggle the active class, we simply specify the `activeClassName` we want applied to the rendered element when the current URL matches. That's it! Now if you render an `<li><a></a></li>` element within the `<Nav />` component from `react-bootstrap`, the appropriate styles from Bootstrap will be automatically applied.

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

There is still some opinions as to how to do this. We will cover two ways I found that successfully does nesting.

<!-- TODO -->
Coming soon...


## Performing redirects programmatically
Last but not least! In respect to routing, one more feature we need to look at is managing redirects when an action is performed.

<!-- TODO -->
