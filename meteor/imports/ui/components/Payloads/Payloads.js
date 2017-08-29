/* eslint-disable jsx-a11y/no-noninteractive-element-interactions */
import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { Link } from 'react-router-dom';
import { Table, Alert, Button, Glyphicon } from 'react-bootstrap';
import { Meteor } from 'meteor/meteor';
import { createContainer } from 'meteor/react-meteor-data';
import { Bert } from 'meteor/themeteorchef:bert';


import PayloadsCollection from '../../../api/Payloads/Payloads';
import Loading from '../../components/Loading/Loading';
import TrashModal from '../../components/TrashModal/TrashModal';
import List from '../../components/List/List';

class Payloads extends Component {
  constructor(props) {
    super(props);

    this.handleHardRemove = this.handleHardRemove.bind(this);
    this.handleSoftRemove = this.handleSoftRemove.bind(this);
    this.handleRestore = this.handleRestore.bind(this);
    this.trashClose = this.trashClose.bind(this);

    this.state = {
      hideCompleted: false,
      trashShow: false,
    };
  }

  getInitialState() {
    return {
      trashShow: false,
    };
  }

  handleSoftRemove(payloadId) {
    if (confirm('Move to Trash?')) {
      Meteor.call('payloads.softDelete', payloadId, (error) => {
        if (error) {
          Bert.alert(error.reason, 'danger');
        } else {
          Bert.alert('Payload moved to Trash!', 'warning');
        }
      });
    }
  }

  handleRestore(payloadId) {
    if (confirm('Restore Payload?')) {
      Meteor.call('payloads.restore', payloadId, (error) => {
        if (error) {
          Bert.alert(error.reason, 'danger');
        } else {
          Bert.alert('Payload Restored!', 'success');
        }
      });
    }
  }

  handleHardRemove(payloadId) {
    if (confirm('Are you sure? This is permanent!')) {
      Meteor.call('payloads.hardDelete', payloadId, (error) => {
        if (error) {
          Bert.alert(error.reason, 'danger');
        } else {
          Bert.alert('Payload deleted!', 'danger');
        }
      });
    }
  }

  toggleHideCompleted() {
    this.setState({
      hideCompleted: !this.state.hideCompleted,
    });
  }

  trashClose() {
    this.setState({
      trashShow: false,
    });
  }

  render() {
    const { loading, payloads, match } = this.props;
    return (!loading ? (
      <div className="Payloads">
        <TrashModal
          title="Recycle Bin"
          show={this.state.trashShow}
          onHide={() => this.trashClose()}
          itemName="Payloads"
          loading={loading}
          deletedCount={this.props.deletedCount}
          handleRestore={this.handleRestore}
          handleHardRemove={this.handleHardRemove}
          deletedItems={this.props.deletedPayloads}
        />
        <div className="page-header clearfix">
          <Link className="btn btn-success pull-right" to={`${match.url}/new`}>Add Payload</Link>
        </div>
        {payloads.length ? <div className="ItemList"><Table responsive hover>
          <thead>
            <tr>
              <th>
                Payloads ({this.props.totalCount})
              </th>
              <th>Last Updated</th>
              <th>Created</th>
              <th><Button
                bsStyle="default"
                onClick={() => this.setState({ trashShow: true })}
                block
              ><Glyphicon glyph="trash" /></Button></th>
            </tr>
          </thead>
          <List
            loading={loading}
            completedColumn={false}
            items={payloads}
            match={match}
            history={this.props.history}
            softDeleteItem={this.handleSoftRemove}
          />
        </Table></div> : <Alert bsStyle="warning">No payloads yet!</Alert>}
      </div>
    ) : <Loading />);
  }
}

Payloads.propTypes = {
  loading: PropTypes.bool.isRequired,
  payloads: PropTypes.arrayOf(PropTypes.object).isRequired,
  deletedPayloads: PropTypes.arrayOf(PropTypes.object).isRequired,
  match: PropTypes.object.isRequired,
  history: PropTypes.object.isRequired,
  deletedCount: PropTypes.number.isRequired,
  totalCount: PropTypes.number.isRequired,
};

export default createContainer(() => {
  const subscription = Meteor.subscribe('payloads');
  return {
    loading: !subscription.ready(),
    payloads: PayloadsCollection.find({ deleted: { $eq: 'no' } }).fetch(),
    deletedPayloads: PayloadsCollection.find({ deleted: { $ne: 'no' } }).fetch(),
    deletedCount: PayloadsCollection.find({ deleted: { $ne: 'no' } }).count(),
    totalCount: PayloadsCollection.find({ deleted: { $eq: 'no' } }).count(),
  };
}, Payloads);
