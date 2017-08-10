import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { Link } from 'react-router-dom';
import { Table, Alert, Button, Glyphicon, Checkbox } from 'react-bootstrap';
import { timeago, monthDayYearAtTime } from '@cleverbeagle/dates';
import { Meteor } from 'meteor/meteor';
import { createContainer } from 'meteor/react-meteor-data';
import { Bert } from 'meteor/themeteorchef:bert';
import classnames from 'classnames';

import ProjectsCollection from '../../../api/Projects/Projects';
import Loading from '../../components/Loading/Loading';
import TrashModal from '../../components/TrashModal/TrashModal';

import './Projects.scss';

class Projects extends Component {
  constructor(props) {
    super(props);

    this.toggleDone = this.toggleDone.bind(this);
    this.handleHardRemove = this.handleHardRemove.bind(this);
    this.handleSoftRemove = this.handleSoftRemove.bind(this);
    this.handleRestore = this.handleRestore.bind(this);
    this.toggleHideCompleted = this.toggleHideCompleted.bind(this);
    this.renderProjects = this.renderProjects.bind(this);
    // this.trashClose = this.trashClose.bind(this);

    this.state = {
      hideCompleted: false,
      trashShow: false,
      showGrid: false,
      showList: true,
    };
  }

  getInitialState() {
    return {
      deleteModalShow: false,
      newItemShow: false,
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

  // trashClose() {
  //   this.setState({
  //     trashShow: false,
  //   });
  // }

  renderProjects(projects) {
    let filteredProjects = projects;
    if (this.state.hideCompleted) {
      filteredProjects = filteredProjects.filter(project => !project.done);
    }
    return filteredProjects.map(({ _id, name, createdAt, updatedAt, done }) => {
      const projectClassName = classnames({
        completed: done,
      });
      return (
        <tr className={projectClassName} key={_id}>
          <td>{name}</td>
          <td>{timeago(updatedAt)}</td>
          <td>{monthDayYearAtTime(createdAt)}</td>
          <td>
            <Checkbox
              bsSize="lg"
              type="checkbox"
              readOnly
              checked={done}
              onClick={() => this.toggleDone(_id, done)}
            />
          </td>
          <td>
            <Button
              bsSize="xs"
              bsStyle="danger"
              onClick={() => this.handleSoftRemove(_id)}
              block
            ><Glyphicon glyph="trash" /></Button>
          </td>
        </tr>);
    });
  }

  render() {
    const { loading, projects, match } = this.props;
    const trashClose = () => this.setState({ trashShow: false });
    return (!loading ? (
      <div className="Projects">
        <TrashModal
          title="Recycle Bin"
          show={this.state.trashShow}
          onHide={trashClose}
          itemName="Projects"
          loading={loading}
          deletedCount={this.props.deletedCount}
          handleRestore={this.handleRestore}
          handleHardRemove={this.handleHardRemove}
          deletedProjects={this.props.deletedProjects}
        />
        <div className="page-header clearfix">
          <Button
            bsStyle={this.state.hideCompleted ? 'info' : 'default'}
            onClick={() => this.toggleHideCompleted()}
          >{!this.state.hideCompleted ? 'Hide Completed Projects' : 'Show Completed Projects'} ({this.props.completeCount})</Button>
          <Link className="btn btn-success pull-right" to={`${match.url}/new`}>Add Project</Link>
        </div>
        {projects.length ? <Table responsive>
          <thead>
            <tr>
              <th>
                Projects (
                  {this.state.hideCompleted ? this.props.incompleteCount : this.props.totalCount}
                )
              </th>
              <th>Last Updated</th>
              <th>Created</th>
              <th>Completed</th>
              <th><Button
                bsStyle="default"
                onClick={() => this.setState({ trashShow: true })}
                block
              ><Glyphicon glyph="trash" /></Button></th>
            </tr>
          </thead>
          <tbody>
            {this.renderProjects(projects)}
          </tbody>
        </Table> : <Alert bsStyle="warning">No projects yet!</Alert>}
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
