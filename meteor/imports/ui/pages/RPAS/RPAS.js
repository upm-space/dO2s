/* eslint-disable jsx-a11y/no-noninteractive-element-interactions */
import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { Link } from 'react-router-dom';
import { Table, Alert, Button, Glyphicon } from 'react-bootstrap';
import { Meteor } from 'meteor/meteor';
import { createContainer } from 'meteor/react-meteor-data';
import { Bert } from 'meteor/themeteorchef:bert';


import RPASCollection from '../../../api/RPAS/RPAS';
import Loading from '../../components/Loading/Loading';
import TrashModal from '../../components/TrashModal/TrashModal';
import List from '../../components/List/List';

class RPAS extends Component {
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

  handleSoftRemove(rpasId) {
    if (confirm('Move to Trash?')) {
      Meteor.call('rpas.softDelete', rpasId, (error) => {
        if (error) {
          Bert.alert(error.reason, 'danger');
        } else {
          Bert.alert('RPAS moved to Trash!', 'warning');
        }
      });
    }
  }

  handleRestore(rpasId) {
    if (confirm('Restore RPAS?')) {
      Meteor.call('rpas.restore', rpasId, (error) => {
        if (error) {
          Bert.alert(error.reason, 'danger');
        } else {
          Bert.alert('RPAS Restored!', 'success');
        }
      });
    }
  }

  handleHardRemove(rpasId) {
    if (confirm('Are you sure? This is permanent!')) {
      Meteor.call('rpas.hardDelete', rpasId, (error) => {
        if (error) {
          Bert.alert(error.reason, 'danger');
        } else {
          Bert.alert('RPAS deleted!', 'danger');
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
    const { loading, rpas, match } = this.props;
    return (!loading ? (
      <div className="RPAS">
        <TrashModal
          title="Recycle Bin"
          show={this.state.trashShow}
          onHide={() => this.trashClose()}
          itemName="RPAS"
          loading={loading}
          deletedCount={this.props.deletedCount}
          handleRestore={this.handleRestore}
          handleHardRemove={this.handleHardRemove}
          deletedItems={this.props.deletedRPAS}
        />
        <div className="page-header clearfix">
          <Link className="btn btn-success pull-right" to={`${match.url}/new`}>Add RPAS</Link>
        </div>
        {rpas.length ? <div className="ItemList"><Table responsive hover>
          <thead>
            <tr>
              <th>
                RPAS ({this.props.totalCount})
              </th>
              <th className="hidden-xs">Last Updated</th>
              <th className="hidden-xs">Created</th>
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
            items={rpas}
            match={match}
            history={this.props.history}
            softDeleteItem={this.handleSoftRemove}
          />
        </Table></div> : <Alert bsStyle="warning">No rpas yet!</Alert>}
      </div>
    ) : <Loading />);
  }
}

RPAS.propTypes = {
  loading: PropTypes.bool.isRequired,
  rpas: PropTypes.arrayOf(PropTypes.object).isRequired,
  deletedRPAS: PropTypes.arrayOf(PropTypes.object).isRequired,
  match: PropTypes.object.isRequired,
  history: PropTypes.object.isRequired,
  deletedCount: PropTypes.number.isRequired,
  totalCount: PropTypes.number.isRequired,
};

export default createContainer(() => {
  const rpasSub = Meteor.subscribe('rpas');
  return {
    loading: !rpasSub.ready(),
    rpas: RPASCollection.find({ deleted: { $eq: 'no' } }).fetch(),
    deletedRPAS: RPASCollection.find({ deleted: { $ne: 'no' } }).fetch(),
    deletedCount: RPASCollection.find({ deleted: { $ne: 'no' } }).count(),
    totalCount: RPASCollection.find({ deleted: { $eq: 'no' } }).count(),
  };
}, RPAS);
