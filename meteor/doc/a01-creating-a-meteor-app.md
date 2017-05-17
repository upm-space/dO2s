## Creating the Meteor App

This is a good tutorial on routing, [Leveling Up With React: React Router](https://css-tricks.com/learning-react-router/). Now this is ReactRouter v3, the new ReactRouter v4 is out now, as of this reading is v4.1.1, CSS Tricks does a very good job in explaining ReactRouter's philosophy, it's a recommended reading, but v4 does not work as v3. This are the links to tutorials on the new version.

-   [Meteor Chef - Getting Started with React Router 4](https://themeteorchef.com/tutorials/getting-started-with-react-router-v4)
-   [React Router Documentation](https://reacttraining.com/react-router/web/guides/quick-start)
-   [Nesting in ReactRouter v4](https://teamtreehouse.com/community/warning-you-should-not-use-route-component-and-route-children-in-the-same-route-route-children-will-be-ignored)
-   [Quick tut to ReactRouter 4](https://medium.com/@pshrmn/a-simple-react-router-v4-tutorial-7f23ff27adf˚)

This is the installation process for a Meteor app with React.

```bash
meteor create dO2s
cd dO2s
meteor npm install
meteor npm install --save react react-dom
meteor npm install --save font-awesome
meteor add twbs:bootstrap
```

For the installation and setup of `react-router` we follow this steps [React Router Basics](https://themeteorchef.com/tutorials/react-router-basics). (Not really, we use v4)

```bash
meteor npm install --save react-router react-router-dom
```

On the `client` folder the `main.html` file looks like this:

```html
<head>
    <title>dO2s</title>
</head>

<body>
   <div id="react-root"></div>
</body>
```

On the `client` folder the `main.js` file looks like this:
```javascript
// import './main.html';
import '/imports/startup/client';
```

We create the folders `/imports/startup/routes/` and we put in a `Routes.jsx` file.

## Collections Definition

The pattern we follow for the definition of collections is here, [Defining MongoDB Collections](https://themeteorchef.com/tutorials/defining-mongodb-collections).
