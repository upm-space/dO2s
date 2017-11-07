// import React, { Component, PropTypes } from 'react';
import React, { Component } from 'react';
import { Meteor } from 'meteor/meteor';
import FtpClientItems from './ftp-client-items';

import './FileTransferUi.scss';

class FileTransferUi extends Component {
  constructor(props) {
    super(props);

    this.state = {
      localFiles: [],
      serverFiles: [],
      // uploadedSoFar: '',
    };
    this.rootDirectory = 'C:/Oficina/Universidad/TFM/';
    this.selectedLocalFiles = new Set();
    this.selectedServerFiles = new Set();
  }
  componentDidMount() {
  }

  selectFiles() {
    this.selectedLocalFiles = new Set();
    // const btnFiles = this.btnSelectedFiles;
    for (let i = 0; i < this.btnSelectedFiles.files.length; i += 1) {
      this.selectedLocalFiles.add(this.btnSelectedFiles.files[i]);
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
    if (parent.selectedServerFiles.has(file.props.objFile)) {
      parent.selectedServerFiles.delete(file.props.objFile);
    }
    parent.renderServerFiles(parent.selectedServerFiles);
  }

  oldLoadLocalFiles(path, files, callback) {
    Meteor.apply('saveLocalFiles', [path, files], {
      wait: true,
      onResultReceived: (error, result) => {
        if (result) {
          if (result.result === 'ok') {
            callback(`file copied${result}`);
          } else {
            callback(`Ooops. Something strange has happened copying the file: ${result}`);
          }
        }
      },
    });
  }

  uploadFiles() {
    this.state.localFiles.forEach((file) => {
      this.uploadFile(file, (data) => {
        console.log(data);
      });
    });
  }

  uploadFile(file, callback) {
    const reader = new FileReader();
    reader.onload = (event) => {
      const buffer = new Uint8Array(reader.result); // convert to binary
      Meteor.apply('saveFile', [buffer, this.rootDirectory, file.props.objFile.name], {
        wait: true,
        onResultReceived: (error, result) => {
          if (result) {
            if (result.result === 'ok') {
              this.removeLocalFile(this, file.props.objFile);
              this.selectedServerFiles.add(file);
              this.renderServerFiles(this.selectedServerFiles);
              console.log(`file copied${result}`);
              // callback(result);
            } else {
              console.log(`Ooops. Something strange has happened copying the file: ${result}`);
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
    // for(let i = 0; i < files.length; i++){
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
    // for(let i = 0; i < files.length; i++){
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
      <div className="row">
        <div className="col-md-5">
          <h3 className="redColored big-glyph text-center">Client side</h3>
          <div className="ftpFileContainer" id="ftpClientSide">{this.state.localFiles}</div>
          <div className="row btn-group centerBlock data-input">
            <label className="btn btn-lg btn-danger centerBlock">
              <i className="fa fa-folder-open" aria-hidden="true" /> Browse
              <input ref={(c) => { this.btnSelectedFiles = c; }} id="uploadFile" className="file" type="file" multiple onChange={this.selectFiles.bind(this)} />
            </label>
            <label className="btn btn-lg btn-danger" onClick={() => { this.uploadFiles(); }}>
              <i className="fa fa-upload" aria-hidden="true" /> Upload {() => { }}
            </label>
          </div>
        </div>
        <div className="col-md-2" />

        <div className="col-md-5">
          <h3 className="redColored big-glyph text-center">Server side</h3>
          <div className="ftpFileContainer" id="ftpServerSide">{this.state.serverFiles}</div>
        </div>
      </div>
    );
  }
}

FileTransferUi.propTypes = {
  // serverPath: PropTypes.string.isRequired,
};

export default FileTransferUi;
