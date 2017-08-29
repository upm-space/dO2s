/* eslint-disable jsx-a11y/no-noninteractive-element-interactions */
import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { Link } from 'react-router-dom';
import { Table, Alert, Button, Glyphicon } from 'react-bootstrap';
import { Meteor } from 'meteor/meteor';
import { createContainer } from 'meteor/react-meteor-data';
import { Bert } from 'meteor/themeteorchef:bert';


import ProjectsCollection from '../../../api/Projects/Projects';
import Loading from '../../components/Loading/Loading';
import TrashModal from '../../components/TrashModal/TrashModal';
import List from '../../components/List/List';

class Projects extends Component {
  constructor(props) {
    super(props);

    this.toggleDone = this.toggleDone.bind(this);
    this.handleHardRemove = this.handleHardRemove.bind(this);
    this.handleSoftRemove = this.handleSoftRemove.bind(this);
    this.handleRestore = this.handleRestore.bind(this);
    this.toggleHideCompleted = this.toggleHideCompleted.bind(this);
    this.trashClose = this.trashClose.bind(this);

    this.state = {
      hideCompleted: false,
      trashShow: false,
      showGrid: false,
      showList: true,
    };
  }

  getInitialState() {
    return {
      trashShow: false,
    };
  }

  handleSoftRemove(projectId) {
    if (confirm('Move to Trash?')) {
      Meteor.call('projects.softDelete', projectId, (error) => {
        if (error) {
          Bert.alert(error.reason, 'danger');
        } else {
          Bert.alert('Project moved to Trash!', 'warning');
        }
      });
    }
  }

  handleRestore(projectId) {
    if (confirm('Restore Project?')) {
      Meteor.call('projects.restore', projectId, (error) => {
        if (error) {
          Bert.alert(error.reason, 'danger');
        } else {
          Bert.alert('Project Restored!', 'success');
        }
      });
    }
  }

  handleHardRemove(projectId) {
    if (confirm('Are you sure? This is permanent!')) {
      Meteor.call('projects.hardDelete', projectId, (error) => {
        if (error) {
          Bert.alert(error.reason, 'danger');
        } else {
          Bert.alert('Project deleted!', 'danger');
        }
      });
    }
  }

  toggleDone(projectId, done) {
    Meteor.call('projects.setDone', projectId, !done, (error) => {
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

  render() {
    const { loading, projects, match } = this.props;
    return (!loading ? (
      <div className="Projects">
        <TrashModal
          title="Recycle Bin"
          show={this.state.trashShow}
          onHide={() => this.trashClose()}
          itemName="Projects"
          loading={loading}
          deletedCount={this.props.deletedCount}
          handleRestore={this.handleRestore}
          handleHardRemove={this.handleHardRemove}
          deletedItems={this.props.deletedProjects}
        />
        <div className="page-header clearfix">
          <Button
            bsStyle={!this.state.hideCompleted ? 'info' : 'default'}
            onClick={() => this.toggleHideCompleted()}
          >{!this.state.hideCompleted ? 'Hide Completed Projects' : 'Show Completed Projects'} ({this.props.completeCount})</Button>
          <Link className="btn btn-success pull-right" to={`${match.url}/new`}>Add Project</Link>
        </div>
        {projects.length ? <div className="ItemList"><Table responsive hover>
          <thead>
            <tr>
              <th>
                Projects (
                  {this.state.hideCompleted ? this.props.incompleteCount : this.props.totalCount}
                )
              </th>
              <th className="hidden-xs">Last Updated</th>
              <th className="hidden-xs">Created</th>
              <th className="center-column">
                Completed
              </th>
              <th><Button
                bsStyle="default"
                onClick={() => this.setState({ trashShow: true })}
                block
              ><Glyphicon glyph="trash" /></Button></th>
            </tr>
          </thead>
          <List
            loading={loading}
            completedColumn
            items={projects}
            match={match}
            hideCompleted={this.state.hideCompleted}
            history={this.props.history}
            softDeleteItem={this.handleSoftRemove}
            completeItem={this.toggleDone}
          />
        </Table></div> : <Alert bsStyle="warning">No projects yet!</Alert>}
      </div>
    ) : <Loading />);
  }
}

Projects.propTypes = {
  loading: PropTypes.bool.isRequired,
  projects: PropTypes.arrayOf(PropTypes.object).isRequired,
  deletedProjects: PropTypes.arrayOf(PropTypes.object).isRequired,
  match: PropTypes.object.isRequired,
  history: PropTypes.object.isRequired,
  deletedCount: PropTypes.number.isRequired,
  incompleteCount: PropTypes.number.isRequired,
  completeCount: PropTypes.number.isRequired,
  totalCount: PropTypes.number.isRequired,
};

export default createContainer(() => {
  const subscription = Meteor.subscribe('projects');
  return {
    loading: !subscription.ready(),
    projects: ProjectsCollection.find({ deleted: { $eq: 'no' } }).fetch(),
    deletedProjects: ProjectsCollection.find({ deleted: { $ne: 'no' } }).fetch(),
    deletedCount: ProjectsCollection.find({ deleted: { $ne: 'no' } }).count(),
    incompleteCount: ProjectsCollection.find({ deleted: { $eq: 'no' }, done: { $eq: false } }).count(),
    completeCount: ProjectsCollection.find({ deleted: { $eq: 'no' }, done: { $eq: true } }).count(),
    totalCount: ProjectsCollection.find({ deleted: { $eq: 'no' } }).count(),
  };
}, Projects);
