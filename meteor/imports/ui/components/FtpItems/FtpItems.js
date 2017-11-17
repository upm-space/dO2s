import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { Button, Row, Col } from 'react-bootstrap';

export default class FtpItems extends Component {
  constructor(props) {
    super(props);

    this.state = {
      isChecked: true,
    };

    this.setCheckedValue = this.setCheckedValue.bind(this);
    this.deleteItem = this.deleteItem.bind(this);
    this.uploadItem = this.uploadItem.bind(this);
  }

  setCheckedValue() {
    const { isChecked } = this.state;
    this.setState({
      isChecked: !isChecked,
    });
    this.props.onchangeCheck(this.props.objFile.name, this.props.parent);
  }

  uploadItem() {
    this.props.onUpload(this.props.parent, this.props.objFile);
  }

  deleteItem() {
    this.props.onDelete(this.props.parent, this.props.objFile);
  }

  renderCheck() {
    return (
      <div className="checkbox">
        <label htmlFor="ckeckId">
          <input
            type="checkbox"
            checked={this.state.isChecked}
            id="checkId"
            onChange={event => this.setCheckedValue(event)}
          />
        </label>
      </div>
    );
  }

  renderTrash() {
    return (
      <Button>
        <span
          className="fa fa-trash redColored"
          onClick={this.deleteItem}
          aria-hidden="true"
        />
      </Button>
    );
  }

  renderUpload() {
    return (
      <Button className="delete">
        <span
          className="fa fa-upload redColored"
          onClick={this.uploadItem}
          aria-hidden="true"
        />
      </Button>
    );
  }

  render() {
    return (
      <Row>
        <Col md={2} lg={2} sm={2} xs={2}>
          {this.props.drawCheck ? this.renderCheck() : ''}
        </Col>
        <Col md={6} lg={6} sm={6} xs={6}>
          {this.props.objFile.name}
        </Col>
        <Col md={2} lg={2} sm={2} xs={2}>
          {this.props.drawTrash ? this.renderTrash() : ''}
        </Col>
        <Col md={2} lg={2} sm={2} xs={2}>
          {this.props.drawUpload ? this.renderUpload() : ''}
        </Col>
      </Row>

    );
  }
}

FtpItems.defaultProps = {
  drawCheck: true,
  drawTrash: true,
  drawUpload: true,
};

FtpItems.propTypes = {
  objFile: PropTypes.object.isRequired,
  parent: PropTypes.object.isRequired,
  drawCheck: PropTypes.bool,
  drawTrash: PropTypes.bool,
  drawUpload: PropTypes.bool,
  onchangeCheck: PropTypes.func.isRequired,
  onUpload: PropTypes.func.isRequired,
  onDelete: PropTypes.func.isRequired,
};
