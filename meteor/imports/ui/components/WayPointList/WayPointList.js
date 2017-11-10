import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { Table, Alert } from 'react-bootstrap';
import { Meteor } from 'meteor/meteor';
import { Bert } from 'meteor/themeteorchef:bert';
import { editWayPointType } from '../../../modules/mission-planning/waypoint-utilities.js';

import './WayPointList.scss';

class WayPointList extends Component {
  constructor(props) {
    super(props);
    this.changeWaypointType = this.changeWaypointType.bind(this);
    this.changeWaypointAtlRelative = this.changeWaypointAtlRelative.bind(this);
  }

  changeWaypointType(waypointList, waypointIndex, newWayPointType) {
    const newWaypointList = editWayPointType(waypointList, waypointIndex, newWayPointType);
    Meteor.call('missions.editWayPointList', this.props.missionId, newWaypointList, (error) => {
      if (error) {
        Bert.alert(error.reason, 'danger');
      } else {
        Bert.alert('Waypoint Type Changed', 'success');
      }
    });
  }

  changeWaypointAtlRelative(waypointIndex, newWayPointAltRelative) {
    return Meteor.call('missions.editWayPointAltRelative', this.props.missionId, waypointIndex, newWayPointAltRelative, (error) => {
      if (error) {
        Bert.alert(error.reason, 'danger');
      } else {
        Bert.alert('Waypoint Height Relative to Take Off Changed', 'success');
      }
    });
  }

  renderWaypointListItems(waypointList) {
    return waypointList.features.map(waypoint => (
      <tr
        key={waypoint.properties.totalNumber}
      >
        <td className="center-column">{waypoint.properties.webNumber}</td>
        <td>
          <select
            type="text"
            className="form-control"
            name="rpa"
            value={waypoint.properties.type}
            onChange={event =>
              (this.changeWaypointType(
                waypointList,
                waypoint.properties.totalNumber,
                Number(event.target.value),
              ))}
          >
            <option key="1" value="1">Take Off</option>
            <option key="2" value="2">Landing</option>
            <option key="3" value="3">Camera On</option>
            <option key="4" value="4">Camera Off</option>
            <option key="5" value="5">Waypoint</option>
          </select>
        </td>
        {/* <td>{waypoint.geometry.coordinates[0]}</td>
        <td>{waypoint.geometry.coordinates[1]}</td> */}
        <td>{waypoint.properties.altAbsolute.toFixed(2)}</td>
        <td><input
          type="number"
          className="form-control"
          name="altRelative"
          min="0"
          defaultValue={waypoint.properties.altRelative.toFixed(2)}
          onChange={event =>
            this.changeWaypointAtlRelative(
              waypoint.properties.totalNumber,
              Number(event.target.value),
            )}
        />
        </td>
        <td>{waypoint.properties.altGround.toFixed(2)}</td>
      </tr>));
  }

  render() {
    const waypointListTd = this.renderWaypointListItems(this.props.waypointList);
    return (
      <div className="WayPointList">
        {this.props.waypointList.features.length ?
          <Table responsive hover>
            <thead>
              <tr>
                <th className="center-column">
            Waypoints ({this.props.waypointList.features.length})
                </th>
                <th>Type</th>
                {/* <th>Longitude</th>
                <th>Latitude</th> */}
                <th>altAbsolute</th>
                <th>ALT Relative to TOff</th>
                <th>Ground Elevation</th>
              </tr>
            </thead>
            <tbody>
              {waypointListTd}
            </tbody>
          </Table> : <Alert bsStyle="warning">No waypoints yet!</Alert>}
      </div>
    );
  }
}


WayPointList.propTypes = {
  missionId: PropTypes.string.isRequired,
  waypointList: PropTypes.object.isRequired,
};


export default WayPointList;
