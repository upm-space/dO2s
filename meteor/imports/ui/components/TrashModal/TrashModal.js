import React from 'react';
import PropTypes from 'prop-types';
import { Modal, Button, Table, Alert } from 'react-bootstrap';
import Loading from '../Loading/Loading';

import './TrashModal.scss';

const renderDeletedProjects = (deletedProjects, handleRestore, handleHardRemove) => (
  deletedProjects.map(({ _id, name }) => (
    <tr key={_id} className="clearfix">
      <td>{name}</td>
      <td>
        <Button
          bsSize="small"
          bsStyle="info"
          onClick={() => handleRestore(_id)}

        >Restore</Button>
      </td>
      <td>
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
          {props.deletedProjects.length ? <Table responsive>
            {/* <thead>
              <tr>
                <th>
                  Deleted {props.itemName} ({props.deletedCount})
                </th>
                <th />
                <th />
              </tr>
            </thead> */}
            <tbody>
              {renderDeletedProjects(
                props.deletedProjects,
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
  deletedProjects: PropTypes.arrayOf(PropTypes.object).isRequired,
  deletedCount: PropTypes.number.isRequired,
  loading: PropTypes.bool.isRequired,
  handleRestore: PropTypes.func.isRequired,
  handleHardRemove: PropTypes.func.isRequired,
};

export default TrashModal;
