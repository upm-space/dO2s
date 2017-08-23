import React from 'react';
import PropTypes from 'prop-types';
import { Modal, Button, Table, Alert } from 'react-bootstrap';
import Loading from '../Loading/Loading';

import './TrashModal.scss';


const getUserName = name => ({
  string: name,
  object: `${name.first} ${name.last}`,
}[typeof name]);

const renderDeletedItems = (deletedItems, handleRestore, handleHardRemove) => (
  deletedItems.map(({ _id, name, profile }) => (
    <tr key={_id} className="clearfix">
      <td>{!name ? getUserName(profile.name) : name}</td>
      <td className="button-column">
        <Button
          bsSize="small"
          bsStyle="info"
          onClick={() => handleRestore(_id)}

        >Restore</Button>
      </td>
      <td className="button-column">
        <Button
          bsSize="small"
          bsStyle="danger"
          onClick={() => handleHardRemove(_id)}

        >Delete</Button>
      </td>
    </tr>),
));

const TrashModal = props => (
  <Modal show={props.show} onHide={props.onHide}>
    <Modal.Header closeButton>
      <Modal.Title>{props.itemName} Recycle Bin ({props.deletedCount})</Modal.Title>
    </Modal.Header>
    <Modal.Body>
      {!props.loading ? (
        <div className="recycle-bin">
          {props.deletedItems.length ? <Table responsive>
            <tbody>
              {renderDeletedItems(
                props.deletedItems,
                props.handleRestore,
                props.handleHardRemove)}
            </tbody>
          </Table> : <Alert bsStyle="info">Your Recycle Bin is empty!</Alert>}
        </div>
      ) : <Loading />}
    </Modal.Body>
  </Modal>
);

TrashModal.propTypes = {
  show: PropTypes.bool.isRequired,
  onHide: PropTypes.func.isRequired,
  itemName: PropTypes.string.isRequired,
  deletedItems: PropTypes.arrayOf(PropTypes.object).isRequired,
  deletedCount: PropTypes.number.isRequired,
  loading: PropTypes.bool.isRequired,
  handleRestore: PropTypes.func.isRequired,
  handleHardRemove: PropTypes.func.isRequired,
};

export default TrashModal;
