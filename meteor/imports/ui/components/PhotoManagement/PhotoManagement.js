/* eslint-disable max-len, no-return-assign */
import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { Meteor } from 'meteor/meteor';
import { Bert } from 'meteor/themeteorchef:bert';
import { Button, ButtonGroup, FormGroup, ControlLabel, Row, Col } from 'react-bootstrap';

class PhotoManagement extends Component {
  constructor(props) {
    super(props);

    this.state = {
    };

    this.selectFiles = this.selectFiles.bind(this);
  }

  componentDidMount() {
  }

  selectFiles(evt) {
    const selectedFiles = evt.target.files;
    return selectedFiles;
  }

  render() {
    return (
      <Row>
        <Col xs={12} sm={6} md={6} lg={6}>
          <Row>
            <Col xs={12} sm={12} md={12} lg={12}>
              {/* <FilePanelComponent
                panelStyle="primary"
                panelMaxHeight="30vh"
                panelHeight="25vh"
                title="Client side"
                items={this.state.localFiles}
                deleteItem={this.deleteLocalFile}
                uploadButton
                uploadItem={this.uploadLocalFile}
              /> */}
            </Col>
          </Row>
          <Row>
            <Col xs={12} sm={12} md={12} lg={12}>
              <ButtonGroup>
                <Button bsStyle="primary">
                  <label htmlFor="browseFile">
                    <span className="fa fa-folder-open" aria-hidden="true" /> Browse
                    <input
                      id="browseFile"
                      type="file"
                      style={{ display: 'none' }}
                      multiple
                      onChange={event => this.selectFiles(event)}
                    />
                  </label>
                </Button>
                <Button bsStyle="primary" onClick={() => this.uploadFiles()}>
                  <label htmlFor="uploadFile">
                    <span id="uploadFile" className="fa fa-upload" aria-hidden="true" /> Upload
                  </label>
                </Button>
              </ButtonGroup>
            </Col>
          </Row>
          <br />
          <Row>
            <Col xs={12} sm={12} md={12} lg={12}>
              <FormGroup>
                <ControlLabel>Local Folder</ControlLabel>
                <input
                  type="text"
                  name="localDirectory"
                  defaultValue="C:\Oficina\Universidad\TFM\pruebas-servidor-do2s\testFiles"
                  ref={localDirectory => (this.localDirectory = localDirectory)}
                  className="form-control"
                />
              </FormGroup>
            </Col>
          </Row>
          <br />
        </Col>
        <Col xs={12} sm={6} md={6} lg={6}>
          <Row>
            <Col xs={12} sm={12} md={12} lg={12}>
              {/* <FilePanelComponent
                panelStyle="primary"
                panelMaxHeight="30vh"
                panelHeight="25vh"
                title="Server side"
                items={this.state.serverFiles}
                deleteItem={this.deleteServerFile}
              /> */}
            </Col>
          </Row>
          <Row>
            <Col xs={12} sm={12} md={12} lg={12}>
              <Button bsStyle="primary" onClick={() => this.deleteFiles()}>
                <span id="deleteFile" className="fa fa-trash" aria-hidden="true" /> Delete
              </Button>
            </Col>
          </Row>
        </Col>
      </Row>
    );
  }
}

PhotoManagement.propTypes = {
  missionId: PropTypes.string.isRequired,
};

export default PhotoManagement;
