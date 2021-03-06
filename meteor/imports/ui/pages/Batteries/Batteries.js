/* eslint-disable jsx-a11y/no-noninteractive-element-interactions */
import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { Link } from 'react-router-dom';
import { Table, Alert, Button } from 'react-bootstrap';
import { Meteor } from 'meteor/meteor';
import { withTracker } from 'meteor/react-meteor-data';
import { Bert } from 'meteor/themeteorchef:bert';


import BatteriesCollection from '../../../api/Batteries/Batteries';
import Loading from '../../components/Loading/Loading';
import TrashModal from '../../components/TrashModal/TrashModal';
import List from '../../components/List/List';

class Batteries extends Component {
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

  handleSoftRemove(batteryId) {
    Meteor.call('batteries.softDelete', batteryId, (error) => {
      if (error) {
        Bert.alert(error.reason, 'danger');
      } else {
        Bert.alert('Battery moved to Trash!', 'warning');
      }
    });
  }

  handleRestore(batteryId) {
    Meteor.call('batteries.restore', batteryId, (error) => {
      if (error) {
        Bert.alert(error.reason, 'danger');
      } else {
        Bert.alert('Battery Restored!', 'success');
      }
    });
  }

  handleHardRemove(batteryId) {
    if (window.confirm('Are you sure? This is permanent!')) {
      Meteor.call('batteries.hardDelete', batteryId, (error) => {
        if (error) {
          Bert.alert(error.reason, 'danger');
        } else {
          Bert.alert('Battery deleted!', 'danger');
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
    const { loading, batteries, match } = this.props;
    return (!loading ? (
      <div className="Batteries">
        <TrashModal
          title="Recycle Bin"
          show={this.state.trashShow}
          onHide={() => this.trashClose()}
          itemName="Batteries"
          loading={loading}
          deletedCount={this.props.deletedCount}
          handleRestore={this.handleRestore}
          handleHardRemove={this.handleHardRemove}
          deletedItems={this.props.deletedBatteries}
        />
        <div className="page-header clearfix">
          <Link className="btn btn-success pull-right" to={`${match.url}/new`}>Add Battery</Link>
        </div>
        {batteries.length ?
          <div className="ItemList">
            <Table responsive hover>
              <thead>
                <tr>
                  <th>
                Batteries ({this.props.totalCount})
                  </th>
                  <th className="hidden-xs">Last Updated</th>
                  <th className="hidden-xs">Created</th>
                  <th>
                    <Button
                      bsStyle="default"
                      onClick={() => this.setState({ trashShow: true })}
                      block
                    ><span className="fa fa-trash" aria-hidden="true" />
                    </Button>
                  </th>
                </tr>
              </thead>
              <List
                loading={loading}
                completedColumn={false}
                items={batteries}
                match={match}
                history={this.props.history}
                softDeleteItem={this.handleSoftRemove}
              />
            </Table>
          </div> : <Alert bsStyle="warning">No batteries yet!</Alert>}
      </div>
    ) : <Loading />);
  }
}

Batteries.propTypes = {
  loading: PropTypes.bool.isRequired,
  batteries: PropTypes.arrayOf(PropTypes.object).isRequired,
  deletedBatteries: PropTypes.arrayOf(PropTypes.object).isRequired,
  match: PropTypes.object.isRequired,
  history: PropTypes.object.isRequired,
  deletedCount: PropTypes.number.isRequired,
  totalCount: PropTypes.number.isRequired,
};

export default withTracker(() => {
  const subscription = Meteor.subscribe('batteries');
  return {
    loading: !subscription.ready(),
    batteries: BatteriesCollection.find({ deleted: { $eq: 'no' } }).fetch(),
    deletedBatteries: BatteriesCollection.find({ deleted: { $ne: 'no' } }).fetch(),
    deletedCount: BatteriesCollection.find({ deleted: { $ne: 'no' } }).count(),
    totalCount: BatteriesCollection.find({ deleted: { $eq: 'no' } }).count(),
  };
})(Batteries);
