import React from 'react';
import { Button } from 'react-bootstrap';

import './Index.scss';

const Index = () => (
  <div className="Index">
    <img
      src=""
      alt="My Logo"
    />
    <h1>dO2s</h1>
    <p>Drone Online Opensource Service</p>
    <p>The only drone tool you&aposll ever need.</p>
    <p>WIP</p>
    <div>
      <Button href="#docs">Read the Docs</Button>
      <Button href="https://github.com/upm-space/dO2s"><i className="fa fa-star" /> Star on GitHub</Button>
    </div>
  </div>
);

export default Index;
