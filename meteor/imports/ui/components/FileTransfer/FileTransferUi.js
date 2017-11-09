// import React, { Component, PropTypes } from 'react';
import React, { Component } from 'react';
import { Meteor } from 'meteor/meteor';
import { Button, ButtonGroup, Row, Col } from 'react-bootstrap';
import FtpClientItems from './ftp-client-items';

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

    this.selectFiles = this.selectFiles.bind(this);
    this.uploadFiles = this.uploadFiles.bind(this);
  }
  componentDidMount() {
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
    // let fileCounter = 0;
    // const loopUpload = setInterval(() => {
    //   if (!this.fileUploading) {
    //     this.fileUploading = true;
    //     this.uploadLocalFile(this.state.localFiles[fileCounter]);
    //     fileCounter += 1;
    //     if (fileCounter === this.state.localFiles.length) { clearInterval(loopUpload); }
    //   }
    // }, 500);
  }

  uploadLocalFile(file) {
  // uploadLocalFile(file, callback) {
    const reader = new FileReader();
    reader.onload = () => {
      const buffer = new Uint8Array(reader.result); // convert to binary
      Meteor.apply('saveFile', [buffer, this.rootDirectory, file.props.objFile.name], {
        wait: true,
        onResultReceived: (error, result) => {
          if (result) {
            if (result.result === 'ok') {
              this.removeLocalFile(this, file.props.objFile);
              this.selectedServerFiles.add(file);
              this.renderServerFiles(this.selectedServerFiles);
              this.fileUploading = false;
              // console.log(`file copied${result}`);
              // callback(result);
            } else {
              // console.log(`Ooops. Something strange has happened copying the file: ${result}`);
              // callback(result);
            }
          }
        },
      });
    };
    reader.readAsArrayBuffer(file.props.objFile);
  }

  renderLocalFiles(files) {
    const fileList = [];
    files.forEach((file) => {
      const fileObj = (
        <FtpClientItems
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
        <FtpClientItems
          objFile={file.props.objFile}
          key={file.props.objFile.name}
          onchangeCheck={this.onChangeCheck}
          onDelete={this.removeServerFile}
          parent={this}
          drawCheck={false}
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
        <Col md={5}>
          <h3>Client side</h3>
          <div className="ftpFileContainer" id="ftpClientSide">{this.state.localFiles}</div>
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
        </Col>
        <Col md={2} />
        <Col md={5}>
          <h3>Server side</h3>
          <div className="ftpFileContainer" id="ftpServerSide">{this.state.serverFiles}</div>
        </Col>
      </Row>
    );
  }
}

FileTransferUi.propTypes = {
};

export default FileTransferUi;
