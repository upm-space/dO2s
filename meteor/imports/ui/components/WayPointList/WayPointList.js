import React from 'react';
import PropTypes from 'prop-types';
import { Table, Alert } from 'react-bootstrap';
import { Meteor } from 'meteor/meteor';
import { Bert } from 'meteor/themeteorchef:bert';

import './WayPointList.scss';

const changeWaypointType = (missionId, waypointIndex, newWayPointType) =>
  (Meteor.call('missions.editWayPointType', missionId, waypointIndex, newWayPointType, (error) => {
    if (error) {
      Bert.alert(error.reason, 'danger');
    } else {
      Meteor.call('missions.recalculateWaypointNumbers', missionId, (error1) => {
        if (error1) {
          Bert.alert(error1.reason, 'danger');
        } else {
          Bert.alert('Waypoint Type Changed', 'success');
        }
      });
    }
  }));

const changeWaypointAtlRelative = (missionId, waypointIndex, newWayPointAltRelative) =>
  (Meteor.call('missions.editWayPointAltRelative', missionId, waypointIndex, newWayPointAltRelative, (error) => {
    if (error) {
      Bert.alert(error.reason, 'danger');
    } else {
      Bert.alert('Waypoint Height Relative to Take Off Changed', 'success');
    }
  }));

const renderWaypointListItems = ({ missionId, waypointList }) =>
  waypointList.map(waypoint => (
    <tr
      key={waypoint.properties.totalNumber}
    >
      <td className="center-column">{waypoint.properties.webNumber}</td>
      <td><select
        type="text"
        className="form-control"
        name="rpa"
        defaultValue={waypoint.properties.type}
        onChange={event =>
          changeWaypointType(missionId, waypoint.properties.totalNumber, Number(event.target.value))}
      >
        <option key="1" value="1">Take Off</option>
        <option key="2" value="2">Landing</option>
        <option key="3" value="3">Camera On</option>
        <option key="4" value="4">Camera Off</option>
        <option key="5" value="5">Waypoint</option>
      </select></td>
      <td><input
        type="number"
        className="form-control"
        name="altRelative"
        min="0"
        defaultValue={waypoint.properties.altRelative.toFixed(2)}
        onChange={event =>
          changeWaypointAtlRelative(missionId, waypoint.properties.totalNumber, Number(event.target.value))}
      /></td>
      <td>{waypoint.properties.altGround.toFixed(2)}</td>
    </tr>));

const renderWaypointListBody = props => (
  <tbody>
    {renderWaypointListItems(props)}
  </tbody>);

const WayPointList = props => (
  <div className="WayPointList">
    {props.waypointList.length ? <Table responsive hover>
      <thead>
        <tr>
          <th className="center-column">
            Waypoints ({props.waypointList.length})
          </th>
          <th>Type</th>
          <th>ALT Relative to TOff</th>
          <th>Ground Elevation</th>
        </tr>
      </thead>
      {renderWaypointListBody(props)}
    </Table> : <Alert bsStyle="warning">No waypoints yet!</Alert>}
  </div>
);

WayPointList.propTypes = {
  missionId: PropTypes.string.isRequired,
  waypointList: PropTypes.arrayOf(PropTypes.object).isRequired,
};


export default WayPointList;
