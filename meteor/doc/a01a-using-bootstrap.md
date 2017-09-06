#Using Bootstrap and SASS

We'll be using bootstrap and sass on this project.
We have to install a preprocessor to manage the scss files.

This are the packages we'll be installing.

```bash
meteor npm install --save bootstrap
meteor add fourseven:scss
meteor add fortawesome:fontawesome
```

## Styles

Stylesheets in dO2s are loaded in one of two ways: globally in `/imports/ui/stylesheets/app.scss` and directly from within React components.

### Global Stylesheets

We are going to have some stylesheets that apply to the entire application, all located in `/imports/ui/stylesheets/` and importing them all in `app.scss`.

```css
@import "./colors";
@import "./forms";
@import './bootstrap-overrides';
```
### Component Stylesheets

In addition to the global stylesheets listed above, some components have their own stylesheets. To keep things clean and organized, component-specific stylesheets are stored directly alongside the components themselves and imported within the component file. Not only is this easy to understand, it's efficient; component-specific stylesheets are only loaded when the component itself is loaded/used.

If you define a component that has any styles of its own (those that apply specifically to that component), it's best to store them alongside the component, for exmaple `/imports/ui/components/MyComponent/MyComponent.scss` and import them within the component `/imports/ui/components/MyComponent/MyComponent.js` using `import './MyComponent.scss';`.

## Bootstrap

We are going to use Bootstrap from npm preparing for the release of Bootstrap 4, which will have sass files. Right now what is not working is importing the `bootstrap.css` file from the npm module on this `app.scss`, since somehow the scss processor does not get to the `node_modules` folder. The current workaround is to import this css on our project on `/imports/startup/client/index.js`:

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

This loads the main theme and everything seems to work except for the glyphicons, somehow they don't get loaded. Using the `twbs:bootstrap` package fixes this but after installing `jquery` it complains about it's version, saying I have to downgrade. Also I don't want to use `twbs:bootstrap` since it looks that it won't be maintained any more after the change to `npm` and the update to Bootstrap 4.

The current fix for this is copying the `/bootstrap/fonts` folder into a `/public/fonts` folder in our project. No more complains and everything works. This will be revisited if a better fix is found.

## Adding Font Awesome

To use Font Awesome we'll use a CDN. We'll add it to the head of `main.html`, we will also use the package `fortawesome:fontawesome`.

```html
<link href="https://maxcdn.bootstrapcdn.com/font-awesome/4.7.0/css/font-awesome.min.css" rel="stylesheet" />
```

### References
-   [The way to use Bootstrap 4 from npm including js and tether](https://forums.meteor.com/t/the-way-to-use-bootstrap-4-from-npm-including-js-and-tether/23159/10)
-   [Meteor bootstrap package](https://atmospherejs.com/twbs/bootstrap), is still on 3.3.6
-   [SASS project structure](http://vanseodesign.com/css/sass-directory-structures/)
-   [Sass Language Documentation](http://sass-lang.com/documentation/)
-   [Using bootstrap 4 in meteor](https://github.com/juliancwirko/meteor-bootstrap-npm-test)
