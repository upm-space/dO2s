/* eslint-disable max-len, no-return-assign */
import React, { Component } from 'react';
// import PropTypes from 'prop-types';
// import { Meteor } from 'meteor/meteor';
import path from 'path';
import fs from 'fs';
import piexif from 'piexif';
import { Bert } from 'meteor/themeteorchef:bert';
import { Button, Row, Col } from 'react-bootstrap';
// import { Button, ButtonGroup, FormGroup, ControlLabel, Row, Col } from 'react-bootstrap';

const logUrl = 'C:/Oficina/Universidad/TFM/pruebas-servidor-do2s/8.log.json';
const photoDir = 'C:/Oficina/Universidad/TFM/pruebas-servidor-do2s/Images/';
let camArray = [];

class PhotoManagement extends Component {
  constructor(props) {
    super(props);

    this.state = {
    };

    // this.selectFiles = this.selectFiles.bind(this);
  }

  componentWillMount() {
    fetch(logUrl)
      .then((response) => {
        const contentType = response.headers.get('content-type');
        if (contentType && contentType.includes('application/json')) {
          return response.json();
        }
        throw new TypeError("Oops, we haven't got JSON!");
      }).then((data) => {
        camArray = data.CAM;
        console.log(camArray[0]);
      })
      .catch(error => Bert.alert(`CAM Request Error: ${error}`, 'warning'));
  }

  componentDidMount() {
  }

  render() {
    return (
      <Row>
        <Col xs={12} sm={6} md={6} lg={6}>
          <Row>
            <Col xs={12} sm={12} md={12} lg={12} />
          </Row>
          <Row>
            <Col xs={12} sm={12} md={12} lg={12} />
          </Row>
        </Col>
        <Col xs={12} sm={6} md={6} lg={6}>
          <Row>
            <Col xs={12} sm={12} md={12} lg={12} />
          </Row>
          <Row>
            <Col xs={12} sm={12} md={12} lg={12} />
          </Row>
        </Col>
      </Row>
    );
  }
}

PhotoManagement.propTypes = {
  // missionId: PropTypes.string.isRequired,
};

export default PhotoManagement;
