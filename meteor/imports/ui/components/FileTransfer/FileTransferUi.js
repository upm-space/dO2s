// import React, { Component, PropTypes } from 'react';
import React, { Component } from 'react';
import { Meteor } from 'meteor/meteor';
import { Bert } from 'meteor/themeteorchef:bert';
import { Button, ButtonGroup, Row, Col } from 'react-bootstrap';
import FtpItems from '../FtpItems/FtpItems';

import './FileTransferUi.scss';

class FileTransferUi extends Component {
  constructor(props) {
    super(props);

    this.state = {
      localFiles: [],
      serverFiles: [],
    };

    this.rootDirectory = 'C:/Oficina/Universidad/TFM/';
    this.selectedLocalFiles = new Set();
    this.selectedServerFiles = new Set();
    this.fileUploading = false;
    this.fileBeingDeleted = false;

    this.selectFiles = this.selectFiles.bind(this);
    this.uploadFiles = this.uploadFiles.bind(this);
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

  removeLocalFile(parent, file) {
    if (parent.selectedLocalFiles.has(file)) {
      parent.selectedLocalFiles.delete(file);
    }
    parent.renderLocalFiles(parent.selectedLocalFiles);
  }

  removeServerFile(parent, file) {
    if (parent.selectedServerFiles.has(file)) {
      parent.selectedServerFiles.delete(file);
    }
    parent.renderServerFiles(parent.selectedServerFiles);
  }

  uploadFiles() {
    const loopUpload = setInterval(() => {
      if (!this.fileUploading) {
        if (this.state.localFiles.length === 0) { clearInterval(loopUpload); } else {
          this.fileUploading = true;
          this.uploadLocalFile(this.state.localFiles[0]);
        }
      }
    }, 500);
  }

  deleteFiles() {
    const loopDeleting = setInterval(() => {
      if (!this.fileBeingDeleted) {
        if (this.state.serverFiles.length === 0) { clearInterval(loopDeleting); } else {
          this.fileBeingDeleted = true;
          this.deleteFile(this.state.serverFiles[0]);
        }
      }
    }, 500);
  }

  uploadLocalFile(file) {
    const reader = new FileReader();
    reader.onload = () => {
      const buffer = new Uint8Array(reader.result); // convert to binary
      Meteor.call('fileTransfer.saveFile', buffer, this.rootDirectory, file.props.objFile.name, (error, result) => {
        if (result) {
          if (result.result === 'ok') {
            this.selectedServerFiles.add(file.props.objFile);
            this.renderServerFiles(this.selectedServerFiles);
            this.removeLocalFile(this, file.props.objFile);
            this.fileUploading = false;
            Bert.alert(`File ${file.props.objFile.name} copied`, 'success');
          } else {
            Bert.alert(error.reason, 'danger');
          }
        } else {
          Bert.alert(error.reason, 'danger');
        }
      });
    };
    reader.readAsArrayBuffer(file.props.objFile);
  }

  deleteFile(file) {
    const reader = new FileReader();
    reader.onload = () => {
      Meteor.call('fileTransfer.deleteFile', this.rootDirectory, file.props.objFile.name, (error, result) => {
        if (result) {
          if (result.result === 'ok') {
            this.removeServerFile(this, file.props.objFile);
            this.fileBeingDeleted = false;
            Bert.alert(`File ${file.props.objFile.name} removed`, 'success');
          } else {
            Bert.alert(error.reason, 'danger');
          }
        } else {
          Bert.alert(error.reason, 'danger');
        }
      });
    };
    reader.readAsArrayBuffer(file.props.objFile);
  }

  renderLocalFiles(files) {
    const fileList = [];
    files.forEach((file) => {
      const fileObj = (
        <FtpItems
          objFile={file}
          key={file.name}
          onchangeCheck={this.onChangeCheck}
          onDelete={this.removeLocalFile}
          onUpload={this.uploadLocalFile}
          parent={this}
          drawCheck={false}
          drawTrash
          drawUpload
        />);

      fileList.push(fileObj);
    });

    this.setState({
      localFiles: fileList,
    });
  }

  renderServerFiles(files) {
    const fileList = [];
    files.forEach((file) => {
      const fileObj = (
        <FtpItems
          objFile={file}
          key={file.name}
          onchangeCheck={this.onChangeCheck}
          onDelete={this.removeServerFile}
          parent={this}
          drawCheck={false}
          drawUpload={false}
          drawTrash
        />);
      fileList.push(fileObj);
    });

    this.setState({
      serverFiles: fileList,
    });
  }

  render() {
    return (
      <Row>
        <Col md={6}>
          <Col md={2} />
          <Col md={9}>
            <Row>
              <h3 align="center">Client side</h3>
            </Row>
            <Row>
              <div className="ftpFileContainer" id="ftpClientSide">{this.state.localFiles}</div>
            </Row>
            <Row>
              <ButtonGroup>
                <Button bsStyle="primary">
                  <label htmlFor="browseFile">
                    <span className="fa fa-folder-open" aria-hidden="true" /> Browse
                    <input id="browseFile" type="file" style={{ display: 'none' }} multiple onChange={event => this.selectFiles(event)} />
                  </label>
                </Button>
                <Button bsStyle="primary" onClick={() => this.uploadFiles()}>
                  <label htmlFor="uploadFile">
                    <span id="uploadFile" className="fa fa-upload" aria-hidden="true" /> Upload
                  </label>
                </Button>
              </ButtonGroup>
            </Row>
          </Col>
          <Col md={1} />
        </Col>
        <Col md={6}>
          <Col md={1} />
          <Col md={9}>
            <Row>
              <h3 align="center">Server side</h3>
            </Row>
            <Row>
              <div className="ftpFileContainer" id="ftpServerSide">{this.state.serverFiles}</div>
            </Row>
            <Row>
              <Button bsStyle="primary" onClick={() => this.deleteFiles()}>
                <label htmlFor="deleteFile">
                  <span id="deleteFile" className="fa fa-trash" aria-hidden="true" /> Delete
                </label>
              </Button>
            </Row>
          </Col>
          <Col md={2} />
        </Col>
      </Row>
    );
  }
}

FileTransferUi.propTypes = {
};

export default FileTransferUi;
