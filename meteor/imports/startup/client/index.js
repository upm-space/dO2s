import React from 'react';
import { render } from 'react-dom';
import { Bert } from 'meteor/themeteorchef:bert';
import { Meteor } from 'meteor/meteor';


import 'bootstrap/dist/css/bootstrap.min.css';
import 'bootstrap';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import 'leaflet-draw/dist/leaflet.draw.css';

import App from '../../ui/layouts/App/App';
import '../../ui/stylesheets/app.scss';

if (Meteor.isClient) {
  L.Icon.Default.imagePath = '/images/';
}

Bert.defaults.style = 'growl-top-right';

Meteor.startup(() => {
  render(<App />, document.getElementById('react-root'));
});
