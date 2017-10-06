import React from 'react';
import PropTypes from 'prop-types';
import { Table, Alert } from 'react-bootstrap';

import Loading from '../../components/Loading/Loading';

import './WayPointList.scss';

const getWayPointType = (type) => {
  switch (type) {
  case 1:
    return 'Take Off';
  case 2:
    return 'Landing';
  case 3:
    return 'Camera On';
  case 4:
    return 'Camera Off';
  case 5:
    return 'Waypoint';
  default:
    return 'Waypoint';
  }
};

const renderWaypointListItems = ({ waypointList }) =>
  waypointList.map(waypoint => (
    <tr
      key={waypoint.properties.totalNumber}
    >
      <td>{waypoint.properties.webNumber}</td>
      <td>{getWayPointType(waypoint.properties.type)}</td>
      <td>{waypoint.properties.altRelative}</td>
      <td>{waypoint.properties.altGround}</td>
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
          <th>
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
  waypointList: PropTypes.arrayOf(PropTypes.object).isRequired,
};


export default WayPointList;
