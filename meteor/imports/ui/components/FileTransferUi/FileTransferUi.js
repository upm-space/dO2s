/* eslint-disable max-len, no-return-assign */
import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { Meteor } from 'meteor/meteor';
import { Bert } from 'meteor/themeteorchef:bert';
import { Button, ButtonGroup, FormGroup, ControlLabel, Row, Col } from 'react-bootstrap';
// import FtpItems from '../FtpItems/FtpItems';
import FilePanelComponent from '../FilePanelComponent/FilePanelComponent';

// import './FileTransferUi.scss';

class FileTransferUi extends Component {
  constructor(props) {
    super(props);

    this.state = {
      localFiles: [],
      serverFiles: [],
    };

    this.rootDirectory = 'C:/Oficina/Universidad/TFM/';
    this.localDirectory = '';
    this.selectedLocalFiles = new Set();
    this.selectedServerFiles = new Set();
    this.fileUploading = false;
    this.fileBeingDeleted = false;

    this.selectFiles = this.selectFiles.bind(this);
    this.selectFolder = this.selectFolder.bind(this);
    this.uploadFiles = this.uploadFiles.bind(this);
    this.deleteFiles = this.deleteFiles.bind(this);
    this.deleteLocalFile = this.deleteLocalFile.bind(this);
    this.uploadLocalFile = this.uploadLocalFile.bind(this);
    this.deleteServerFile = this.deleteServerFile.bind(this);
  }
  componentDidMount() {
  }

  onChangeCheck(parent, file) {
    if (parent.selectedLocalFiles.has(file)) {
      parent.selectedLocalFiles.delete(file);
    } else {
      parent.selectedLocalFiles.add(file);
    }
  }

  selectFiles(evt) {
    this.selectedLocalFiles = new Set();
    const selectedFiles = evt.target.files;
    for (let i = 0; i < selectedFiles.length; i += 1) {
      this.selectedLocalFiles.add(selectedFiles[i]);
    }
    this.renderLocalFiles(this.selectedLocalFiles);
  }

  selectFolder(evt) {
    const selectedFiles = evt.target.files;
    const relativePath = selectedFiles[0].webkitRelativePath;
    const folder = relativePath.split('/');
    return folder;
  }

  removeLocalFile(file) {
    if (this.selectedLocalFiles.has(file)) {
      this.selectedLocalFiles.delete(file);
    }
    this.renderLocalFiles(this.selectedLocalFiles);
  }

  removeServerFile(file) {
    if (this.selectedServerFiles.has(file)) {
      this.selectedServerFiles.delete(file);
    }
    this.renderServerFiles(this.selectedServerFiles);
  }

  uploadFiles() {
    const loopUpload = setInterval(() => {
      if (!this.fileUploading) {
        if (this.state.localFiles.length === 0) { clearInterval(loopUpload); } else {
          this.fileUploading = true;
          this.uploadLocalFile(this.state.localFiles[0].id);
        }
      }
    }, 500);
  }

  deleteFiles() {
    const loopDeleting = setInterval(() => {
      if (!this.fileBeingDeleted) {
        if (this.state.serverFiles.length === 0) { clearInterval(loopDeleting); } else {
          this.fileBeingDeleted = true;
          this.deleteServerFile(this.state.serverFiles[0].id);
        }
      }
    }, 500);
  }

  isFile(element, fileId) { return element.id === fileId; }

  uploadLocalFile(fileId) {
    const file = this.state.localFiles.find(element => this.isFile(element, fileId));
    const reader = new FileReader();
    reader.onload = () => {
      const buffer = new Uint8Array(reader.result); // convert to binary
      Meteor.call('fileTransfer.saveFile', buffer, this.props.missionId, file.name, (error, result) => {
        if (result) {
          if (result.result === 'ok') {
            this.selectedServerFiles.add(file.objFile);
            this.renderServerFiles(this.selectedServerFiles);
            this.removeLocalFile(file.objFile);
            this.fileUploading = false;
            Bert.alert(`File ${file.name} copied`, 'success');
          } else {
            Bert.alert(error.reason, 'danger');
          }
        } else {
          Bert.alert(error.reason, 'danger');
        }
      });
    };
    reader.readAsArrayBuffer(file.objFile);
  }

  deleteLocalFile(fileId) {
    const file = this.state.localFiles.find(element => this.isFile(element, fileId));
    const reader = new FileReader();
    reader.onload = () => {
      this.removeLocalFile(file.objFile);
      Bert.alert(`File ${file.name} removed`, 'success');
    };
    reader.readAsArrayBuffer(file.objFile);
  }

  deleteServerFile(fileId) {
    const file = this.state.serverFiles.find(element => this.isFile(element, fileId));
    const reader = new FileReader();
    reader.onload = () => {
      Meteor.call('fileTransfer.deleteFile', this.props.missionId, file.name, (error, result) => {
        if (result) {
          if (result.result === 'ok') {
            this.removeServerFile(file.objFile);
            this.fileBeingDeleted = false;
            Bert.alert(`File ${file.name} removed`, 'success');
          } else {
            Bert.alert(error.reason, 'danger');
          }
        } else {
          Bert.alert(error.reason, 'danger');
        }
      });
    };
    reader.readAsArrayBuffer(file.objFile);
  }

  renderLocalFiles(files) {
    const fileList = [];
    files.forEach((file) => {
      const fileObj = {
        objFile: file,
        id: file.name,
        name: file.name,
      };

      fileList.push(fileObj);
    });

    this.setState({
      localFiles: fileList,
    });
  }

  renderServerFiles(files) {
    const fileList = [];
    files.forEach((file) => {
      const fileObj = {
        objFile: file,
        id: file.name,
        name: file.name,
      };
      fileList.push(fileObj);
    });

    this.setState({
      serverFiles: fileList,
    });
  }

  render() {
    return (
      <Row>
        <Col xs={12} sm={6} md={6} lg={6}>
          <Row>
            <Col xs={12} sm={12} md={12} lg={12}>
              <FilePanelComponent
                panelStyle="primary"
                panelMaxHeight="30vh"
                panelHeight="25vh"
                title="Client side"
                items={this.state.localFiles}
                deleteItem={this.deleteLocalFile}
                uploadButton
                uploadItem={this.uploadLocalFile}
              />
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
                  directory="localFolder"
                  defaultValue="Folder path"
                  ref={localDirectory => (this.localDirectory = `${localDirectory}/`)}
                  className="form-control"
                />
              </FormGroup>
              {/* <Button bsStyle="primary">
                <label htmlFor="browseFolder">
                  <span className="fa fa-folder-open" aria-hidden="true" /> Browse Folder
                  <input
                    id="browseFolder"
                    type="file"
                    accept
                    style={{ display: 'block' }}
                    webkitdirectory
                    mozdirectory
                    msdirectory
                    odirectory
                    directory
                    multiple
                    onChange={event => this.selectFolder(event)}
                  />
                </label>
              </Button> */}
            </Col>
          </Row>
          <br />
        </Col>
        <Col xs={12} sm={6} md={6} lg={6}>
          <Row>
            <Col xs={12} sm={12} md={12} lg={12}>
              <FilePanelComponent
                panelStyle="primary"
                panelMaxHeight="30vh"
                panelHeight="25vh"
                title="Server side"
                items={this.state.serverFiles}
                deleteItem={this.deleteServerFile}
              />
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

FileTransferUi.propTypes = {
  missionId: PropTypes.string.isRequired,
};

export default FileTransferUi;
