import React from 'react';
import { render } from 'react-dom';
import { Meteor } from 'meteor/meteor';

import Routes from '../../ui/routes/Routes';

console.log(Routes);

Meteor.startup(() => {
    render(<Routes />, document.getElementById('react-root'));
});
