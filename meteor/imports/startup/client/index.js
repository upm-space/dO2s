import React from 'react';
import { render } from 'react-dom';
import { Meteor } from 'meteor/meteor';

import Routes from './routes/Routes';

Meteor.startup(() => {
    render(<Routes />, document.getElementById('react-root'));
});
