import React from 'react';
import { render } from 'react-dom';
import { Bert } from 'meteor/themeteorchef:bert';
import { Meteor } from 'meteor/meteor';


import 'bootstrap';
import 'bootstrap/dist/css/bootstrap.min.css';
import '../../ui/stylesheets/app.scss';

import Routes from './Routes';

Bert.defaults.style = 'growl-top-right';

Meteor.startup(() => {
  render(<Routes />, document.getElementById('react-root'));
});
