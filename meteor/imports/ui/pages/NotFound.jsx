import React, { Component } from 'react';
import { Alert } from 'react-bootstrap';

const NotFound = () => (
  <div className="NotFound">
    <Alert bsStyle="danger">
      <h1><strong>Error [404]</strong>: { window.location.pathname } does not exist.</h1>
    </Alert>
  </div>
);

export default NotFound;
