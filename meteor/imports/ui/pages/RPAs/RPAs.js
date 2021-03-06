/* eslint-disable jsx-a11y/no-noninteractive-element-interactions */
import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { Link } from 'react-router-dom';
import { Table, Alert, Button } from 'react-bootstrap';
import { Meteor } from 'meteor/meteor';
import { withTracker } from 'meteor/react-meteor-data';
import { Bert } from 'meteor/themeteorchef:bert';


import RPAsCollection from '../../../api/RPAs/RPAs';
import Loading from '../../components/Loading/Loading';
import TrashModal from '../../components/TrashModal/TrashModal';
import List from '../../components/List/List';

class RPAs extends Component {
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

  handleSoftRemove(rpaId) {
    Meteor.call('rpas.softDelete', rpaId, (error) => {
      if (error) {
        Bert.alert(error.reason, 'danger');
      } else {
        Bert.alert('RPA moved to Trash!', 'warning');
      }
    });
  }

  handleRestore(rpaId) {
    Meteor.call('rpas.restore', rpaId, (error) => {
      if (error) {
        Bert.alert(error.reason, 'danger');
      } else {
        Bert.alert('RPA Restored!', 'success');
      }
    });
  }

  handleHardRemove(rpaId) {
    if (window.confirm('Are you sure? This is permanent!')) {
      Meteor.call('rpas.hardDelete', rpaId, (error) => {
        if (error) {
          Bert.alert(error.reason, 'danger');
        } else {
          Bert.alert('RPA deleted!', 'danger');
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
      <div className="RPAs">
        <TrashModal
          title="Recycle Bin"
          show={this.state.trashShow}
          onHide={() => this.trashClose()}
          itemName="RPAs"
          loading={loading}
          deletedCount={this.props.deletedCount}
          handleRestore={this.handleRestore}
          handleHardRemove={this.handleHardRemove}
          deletedItems={this.props.deletedRPAs}
        />
        <div className="page-header clearfix">
          <Link className="btn btn-success pull-right" to={`${match.url}/new`}>Add RPA</Link>
        </div>
        {rpas.length ?
          <div className="ItemList">
            <Table responsive hover>
              <thead>
                <tr>
                  <th>
                RPAs ({this.props.totalCount})
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
                items={rpas}
                match={match}
                history={this.props.history}
                softDeleteItem={this.handleSoftRemove}
              />
            </Table>
          </div> : <Alert bsStyle="warning">No RPAs yet!</Alert>}
      </div>
    ) : <Loading />);
  }
}

RPAs.propTypes = {
  loading: PropTypes.bool.isRequired,
  rpas: PropTypes.arrayOf(PropTypes.object).isRequired,
  deletedRPAs: PropTypes.arrayOf(PropTypes.object).isRequired,
  match: PropTypes.object.isRequired,
  history: PropTypes.object.isRequired,
  deletedCount: PropTypes.number.isRequired,
  totalCount: PropTypes.number.isRequired,
};

export default withTracker(() => {
  const rpasSub = Meteor.subscribe('rpas');
  return {
    loading: !rpasSub.ready(),
    rpas: RPAsCollection.find({ deleted: { $eq: 'no' } }).fetch(),
    deletedRPAs: RPAsCollection.find({ deleted: { $ne: 'no' } }).fetch(),
    deletedCount: RPAsCollection.find({ deleted: { $ne: 'no' } }).count(),
    totalCount: RPAsCollection.find({ deleted: { $eq: 'no' } }).count(),
  };
})(RPAs);
