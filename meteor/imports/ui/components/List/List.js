import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { Link } from 'react-router-dom';
import { Table, Alert, Button, Glyphicon } from 'react-bootstrap';
import { timeago, monthDayYearAtTime } from '@cleverbeagle/dates';
import { Meteor } from 'meteor/meteor';
import { createContainer } from 'meteor/react-meteor-data';
import { Bert } from 'meteor/themeteorchef:bert';
import classnames from 'classnames';

import Loading from '../../components/Loading/Loading';
import TrashModal from '../../components/TrashModal/TrashModal';


import './List.scss';

const renderListItems = (history, match, items, hideCompleted, completedColumn) => {
  let filteredItems = items;
  if (completedColumn && hideCompleted) {
    filteredItems = filteredItems.filter(item => !item.done);
  }
  
  return filteredItems.map(({ _id, name, createdAt, updatedAt, done }) => {
    const goToItem = () => this.props.history.push(`${this.props.match.url}/${_id}`);
    if
    const itemClassName = classnames({ completed: done });
    return (
      <tr
        className={projectClassName}
        key={_id}
      >
        <td onClick={goToProject}>{name}</td>
        <td onClick={goToProject}>
          {timeago(updatedAt)}</td>
        <td onClick={goToProject}>
          {monthDayYearAtTime(createdAt)}</td>
        <td className="button-column">
          <Button
            bsStyle={done ? 'success' : 'default'}
            onClick={() => this.toggleDone(_id, done)}
          >
            {done ?
              <i className="fa fa-check-square-o" aria-hidden="true" /> :
              <i className="fa fa-square-o" aria-hidden="true" />}
          </Button>
        </td>
        <td className="button-column">
          <Button
            bsStyle="danger"
            onClick={() => this.handleSoftRemove(_id)}
          ><i className="fa fa-times" aria-hidden="true" /></Button>
        </td>
      </tr>);
  });
}

renderList(columnsNumber, items, match, history) {
  return (
    <div className="List">
      {items.length ? <Table responsive hover>
        <thead>
          <tr>
            <th>
              Projects (
                {this.state.hideCompleted ? this.props.incompleteCount : this.props.totalCount}
              )
            </th>
            <th>Last Updated</th>
            <th>Created</th>
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
        <tbody>
          {this.renderProjects(projects)}
        </tbody>
      </Table> : <Alert bsStyle="warning">No projects yet!</Alert>}
    </div>)

const List = ({ loading, items, match, history }) => (
  !loading ? renderList(columnsNumber, items, match, history) : <Loading />
);

List.propTypes = {
  loading: PropTypes.bool.isRequired,
  completedColumn: PropTypes.bool.isRequired,
  columnsNumber: PropTypes.number.isRequired,
  columnHeaders: PropTypes.arrayOf(PropTypes.String).isRequired,
  items: PropTypes.arrayOf(PropTypes.object).isRequired,
  match: PropTypes.object.isRequired,
  history: PropTypes.object.isRequired,
  hideCompleted: PropTypes.bool.isRequired,
  softDeleteItem: PropTypes.func.isRequired,
  if (completedColumn === True){
    completeItem: PropTypes.func.isRequired,
  }
};
