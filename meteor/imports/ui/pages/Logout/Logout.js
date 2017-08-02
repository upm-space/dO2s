import React from 'react';
import Icon from '../../components/Icon/Icon';

import './Logout.scss';

const Logout = () => (
  <div className="Logout">
    <img
      src=""
      alt="My Logo"
    />
    <h1>Stay safe out there.</h1>
    <p>{'Don\'t forget to like and follow dO2s elsewhere on the web:'}</p>
    <ul className="FollowUsElsewhere">
      <li><a href="#"><Icon icon="facebook-official" /></a></li>
      <li><a href="https://twitter.com/dO2s_app"><Icon icon="twitter" /></a></li>
      <li><a href="https://github.com/upm-space/dO2s"><Icon icon="github" /></a></li>
    </ul>
  </div>
);

Logout.propTypes = {};

export default Logout;
