/* eslint-disable jsx-a11y/no-noninteractive-element-interactions */
import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { Link } from 'react-router-dom';
import { Table, Alert, Button } from 'react-bootstrap';
import { timeago, monthDayYearAtTime } from '@cleverbeagle/dates';
import { Meteor } from 'meteor/meteor';
import { withTracker } from 'meteor/react-meteor-data';
import { Bert } from 'meteor/themeteorchef:bert';
import classnames from 'classnames';

import MissionsCollection from '../../../api/Missions/Missions';
import Loading from '../../components/Loading/Loading';
import TrashModal from '../../components/TrashModal/TrashModal';

class Missions extends Component {
  constructor(props) {
    super(props);

    this.toggleDone = this.toggleDone.bind(this);
    this.handleHardRemove = this.handleHardRemove.bind(this);
    this.handleSoftRemove = this.handleSoftRemove.bind(this);
    this.handleRestore = this.handleRestore.bind(this);
    this.toggleHideCompleted = this.toggleHideCompleted.bind(this);
    this.renderMissions = this.renderMissions.bind(this);
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

  handleSoftRemove(missionId) {
    Meteor.call('missions.softDelete', missionId, (error) => {
      if (error) {
        Bert.alert(error.reason, 'danger');
      } else {
        Bert.alert('Mission moved to Trash!', 'warning');
      }
    });
  }

  handleRestore(missionId) {
    Meteor.call('missions.restore', missionId, (error) => {
      if (error) {
        Bert.alert(error.reason, 'danger');
      } else {
        Bert.alert('Mission Restored!', 'success');
      }
    });
  }

  handleHardRemove(missionId) {
    if (window.confirm('Are you sure? This is permanent!')) {
      Meteor.call('missions.hardDelete', missionId, (error) => {
        if (error) {
          Bert.alert(error.reason, 'danger');
        } else {
          Bert.alert('Mission deleted!', 'danger');
        }
      });
    }
  }

  toggleDone(missionId, done) {
    Meteor.call('missions.setDone', missionId, !done, (error) => {
      if (error) {
        Bert.alert(error.reason, 'danger');
      } else {
        !done ? Bert.alert('Good Job', 'success') : Bert.alert('Keep up the work', 'info');
      }
    });
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

  renderMissions(missions) {
    let filteredMissions = missions;
    if (this.state.hideCompleted) {
      filteredMissions = filteredMissions.filter(mission => !mission.done);
    }
    return filteredMissions.map(({
      _id, name, createdAt, updatedAt, done,
    }) => {
      const goToMission = () => this.props.history.push(`${this.props.match.url}/${_id}`);
      const missionClassName = classnames({ info: done });
      return (
        <tr
          className={missionClassName}
          key={_id}
        >
          <td onClick={goToMission}>{name}</td>
          <td onClick={goToMission} className="hidden-xs">
            {timeago(updatedAt)}
          </td>
          <td onClick={goToMission} className="hidden-xs">
            {monthDayYearAtTime(createdAt)}
          </td>
          <td className="button-column">
            <Button
              bsStyle={done ? 'success' : 'default'}
              onClick={() => this.toggleDone(_id, done)}
            >
              {done ?
                <span className="fa fa-check-square-o" aria-hidden="true" /> :
                <span className="fa fa-square-o" aria-hidden="true" />}
            </Button>
          </td>
          <td className="button-column">
            <Button
              bsStyle="danger"
              onClick={() => this.handleSoftRemove(_id)}
            ><span className="fa fa-times" aria-hidden="true" />
            </Button>
          </td>
        </tr>);
    });
  }

  render() {
    const { loading, missions, match } = this.props;
    return (!loading ? (
      <div className="Missions">
        <TrashModal
          title="Recycle Bin"
          show={this.state.trashShow}
          onHide={() => this.trashClose()}
          itemName="Missions"
          loading={loading}
          deletedCount={this.props.deletedCount}
          handleRestore={this.handleRestore}
          handleHardRemove={this.handleHardRemove}
          deletedItems={this.props.deletedMissions}
        />
        <div className="page-header clearfix">
          <Button
            bsStyle={!this.state.hideCompleted ? 'info' : 'default'}
            onClick={() => this.toggleHideCompleted()}
          >{!this.state.hideCompleted ? 'Hide Completed Missions' : 'Show Completed Missions'} ({this.props.completeCount})
          </Button>
          <Link className="btn btn-success pull-right" to={`${match.url}/newMission`}>Add Mission</Link>
        </div>
        {missions.length ?
          <div className="ItemList">
            <Table responsive hover>
              <thead>
                <tr>
                  <th>
                Missions (
                    {this.state.hideCompleted ? this.props.incompleteCount : this.props.totalCount}
                )
                  </th>
                  <th className="hidden-xs">Last Updated</th>
                  <th className="hidden-xs">Created</th>
                  <th className="center-column">
                Completed
                  </th>
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
              <tbody>
                {this.renderMissions(missions)}
              </tbody>
            </Table>
          </div> : <Alert bsStyle="warning">No missions yet!</Alert>}
      </div>
    ) : <Loading />);
  }
}

Missions.propTypes = {
  loading: PropTypes.bool.isRequired,
  missions: PropTypes.arrayOf(PropTypes.object).isRequired,
  deletedMissions: PropTypes.arrayOf(PropTypes.object).isRequired,
  match: PropTypes.object.isRequired,
  history: PropTypes.object.isRequired,
  deletedCount: PropTypes.number.isRequired,
  incompleteCount: PropTypes.number.isRequired,
  completeCount: PropTypes.number.isRequired,
  totalCount: PropTypes.number.isRequired,
};

export default withTracker(({ projectId }) => {
  const subscription = Meteor.subscribe('missions', projectId);
  return {
    loading: !subscription.ready(),
    missions: MissionsCollection.find({ deleted: { $eq: 'no' } }).fetch(),
    deletedMissions: MissionsCollection.find({ deleted: { $ne: 'no' } }).fetch(),
    deletedCount: MissionsCollection.find({ deleted: { $ne: 'no' } }).count(),
    incompleteCount: MissionsCollection.find({ deleted: { $eq: 'no' }, done: { $eq: false } }).count(),
    completeCount: MissionsCollection.find({ deleted: { $eq: 'no' }, done: { $eq: true } }).count(),
    totalCount: MissionsCollection.find({ deleted: { $eq: 'no' } }).count(),
  };
})(Missions);
