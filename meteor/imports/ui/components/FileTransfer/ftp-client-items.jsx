import React, { Component, PropTypes } from 'react';

export default class FtpClientItems extends Component {
  constructor(props) {
    super(props);
    this.state = {
      isChecked: true,
    };
  }

  setCheckedValue() {
    this.setState(({ isChecked }) => (
      {
        isChecked: !isChecked,
      }
    ));

    this.props.onchangeCheck(this.props.name, this.props.parent);
    /* this.setState({
            checked : this.refs.checkId.value
        }) */
  }
  uploadItem() {
    this.props.onUpload(this.props.parent, this.props.objFile);
  }
  deleteItem() {
    this.props.onDelete(this.props.parent, this.props.objFile);
  }

  renderCheck() {
    if (this.props.drawCheck) {
      return (
        <div className="checkbox">
          <label><input type="checkbox" checked={isChecked} ref="checkId" onChange={this.setCheckedValue.bind(this)} /></label>
        </div>
      );
    }
  }
  renderTrash() {
    if (this.props.drawTrash) {
      return (
        <button className="delete">
          <i className="fa fa-trash redColored" onClick={this.deleteItem.bind(this)} aria-hidden="true" />
        </button>
      );
    }
  }
  renderUpload() {
    if (this.props.drawUpload) {
      return (
        <button className="delete">
          <i className="fa fa-upload redColored" onClick={this.uploadItem.bind(this)} aria-hidden="true" />
        </button>
      );
    }
  }
  render() {
    const { isChecked } = this.state;

    return (
      <div className="row precise-width">
        <div className="col-md-2 col-lg-2 col-sm-2 col-xs-2">
          {this.renderCheck()}
        </div>
        <div className="col-md-6 col-lg-6 col-sm-6 col-xs-6">
          {this.props.objFile.name}
        </div>
        <div className="col-md-2 col-lg-2 col-sm-2 col-xs-2">
          {this.renderTrash()}
        </div>
        <div className="col-md-2 col-lg-2 col-sm-2 col-xs-2">
          {this.renderUpload()}
        </div>
      </div>

    );
  }
}
