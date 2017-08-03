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

BasicModal.defaultProps = {
  body: <div />,
};

BasicModal.propTypes = {
  show: PropTypes.bool.isRequired,
  onHide: PropTypes.func.isRequired,
  title: PropTypes.string.isRequired,
  body: PropTypes.object,
  action: PropTypes.func.isRequired,
  actionStyle: PropTypes.oneOf(['success', 'warning', 'danger', 'info', 'default', 'primary', 'link']).isRequired,
  actionText: PropTypes.string.isRequired,
};

export default BasicModal;
