import React from 'react';
import { render } from 'react-dom';
import { Bert } from 'meteor/themeteorchef:bert';
import 'bootstrap/dist/css/bootstrap.min.css';
import { Meteor } from 'meteor/meteor';

import Routes from './routes/Routes';

Bert.defaults.style = 'growl-top-right';

Meteor.startup(() => {
    render(<Routes />, document.getElementById('react-root'));
});
