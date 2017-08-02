import React from 'react';
import PropTypes from 'prop-types';
import { Modal, Button } from 'react-bootstrap';

const BasicModal = props => (
  <Modal show={props.show} onHide={props.onHide}>
    <Modal.Header closeButton>
      <Modal.Title>{props.title}</Modal.Title>
    </Modal.Header>
    <Modal.Body>
      {props.body}
    </Modal.Body>
    <Modal.Footer>
      <Button bsStyle="default" onClick={props.onHide}>Close</Button>
      <Button bsStyle={props.actionStyle} onClick={props.action}>{props.actionText}</Button>
    </Modal.Footer>
  </Modal>
);

BasicModal.PropTypes = {
  show: PropTypes.bool.isRequired,
  onHide: PropTypes.func.isRequired,
  title: PropTypes.string.isRequired,
  body: PropTypes.string.isRequired,
  action: PropTypes.func.isRequired,
  actionStyle: PropTypes.oneOf.isRequired,
  actionText: PropTypes.func.isRequired,
};

BasicModal.defaultProps = {

};

export default BasicModal;
