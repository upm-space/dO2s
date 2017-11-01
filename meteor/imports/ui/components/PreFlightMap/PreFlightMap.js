import React, { Component } from 'react';
import { Meteor } from 'meteor/meteor';
import { Bert } from 'meteor/themeteorchef:bert';
import PropTypes from 'prop-types';
import L from 'leaflet';
import 'leaflet-draw';

import { featurePoint2latlong, latlong2featurePoint, featurePointGetZoom } from '../../../modules/geojson-utilities';
import { getWaypointType, waypointSize, waypointAnchor, waypointHtml } from '../../../modules/waypoint-style-chooser.js';
import { getOperationType, insertNewWaypoint, removeWaypoint, moveWaypoint, setWaypointNumbers } from '../../../modules/waypoint-utilities.js';

import './PreFlightMap.scss';

if (Meteor.isClient) {
  L.Icon.Default.imagePath = '/images/';
}

const waypointListOptions = {
  pointToLayer(feature, latlng) {
    return L.marker(latlng, {
      icon: L.divIcon({
        html: waypointHtml(feature.properties.type, feature.properties.webNumber),
        iconSize: waypointSize(feature.properties.type),
        iconAnchor: waypointAnchor(feature.properties.type),
        className: `wayPointIcon ${getWaypointType(feature.properties.type)}`,
      }),
    });
  },
};

const rpaPathStyle = {
  style: { color: '#d9534f' },
};

class PreFlightMap extends Component {
  constructor(props) {
    super(props);
    this.state = {
      mission: this.props.mission,
    };
  }

  componentDidMount() {
    const currentLocation = this.props.location;
    const missionmap = L.map('preflightmap').setView(featurePoint2latlong(currentLocation), featurePointGetZoom(currentLocation));
    this.missionmap = missionmap;
    L.tileLayer('http://{s}.tile.osm.org/{z}/{x}/{y}.png', {
      attribution: '&copy; <a href="http://osm.org/copyright">OpenStreetMap</a> contributors',
    }).addTo(missionmap);

    // FeatureGroup is to store editable layers
    const drawnItems = new L.FeatureGroup().addTo(missionmap);
    const geoJSONTakeOffPointLayer = L.geoJSON().addTo(missionmap);
    const geoJSONLandingPointLayer = L.geoJSON().addTo(missionmap);
    const geoJSONRpaPathLayer = L.geoJSON().addTo(missionmap);
    const geoJSONWaypointListLayer = L.geoJSON().addTo(missionmap);
    const geoJSONAngleToPointLayer = L.geoJSON().addTo(missionmap);

    // we load these variables in the component to access them
    // in other functions.
    this.drawnItems = drawnItems;
    this.geoJSONTakeOffPointLayer = geoJSONTakeOffPointLayer;
    this.geoJSONLandingPointLayer = geoJSONLandingPointLayer;
    this.geoJSONRpaPathLayer = geoJSONRpaPathLayer;
    this.geoJSONWaypointListLayer = geoJSONWaypointListLayer;
    this.geoJSONAngleToPointLayer = geoJSONAngleToPointLayer;

    // Here we load the current mission data on the map if it exists
    const { flightPlan } = this.state.mission;
    if (flightPlan) {
      if (flightPlan.takeOffPoint) {
        const myTakeOffPoint = flightPlan.takeOffPoint;
        const myTakeOffPointLayer = L.geoJSON(myTakeOffPoint, waypointListOptions);
        geoJSONTakeOffPointLayer.addLayer(myTakeOffPointLayer.getLayers()[0]);
      }
      if (flightPlan.landingPoint) {
        const myLandingPoint = flightPlan.landingPoint;
        const myLandingPointLayer = L.geoJSON(myLandingPoint, waypointListOptions);
        geoJSONLandingPointLayer.addLayer(myLandingPointLayer.getLayers()[0]);
      }

      let missionGeometry = '';

      if (flightPlan.missionArea) {
        missionGeometry = flightPlan.missionArea;
      } else if (flightPlan.missionAxis) {
        missionGeometry = flightPlan.missionAxis;
      }
      if (missionGeometry) {
        const myMissionGeomtryLayer = L.geoJSON(missionGeometry);
        drawnItems.addLayer(myMissionGeomtryLayer.getLayers()[0]);
      }
      if (flightPlan.missionCalculation) {
        if (flightPlan.missionCalculation.rpaPath) {
          const myRpaPath = flightPlan.missionCalculation.rpaPath;
          const myRpaPathLayer = L.geoJSON(myRpaPath, rpaPathStyle);
          geoJSONRpaPathLayer.addLayer(myRpaPathLayer.getLayers()[0]);
        }
        if (flightPlan.missionCalculation.waypointList) {
          const myWaypointList = flightPlan.missionCalculation.waypointList;
          const myWaypointListLayer = L.geoJSON(myWaypointList, waypointListOptions);
          myWaypointListLayer.eachLayer(layer =>
            geoJSONWaypointListLayer.addLayer(layer));
        }
      }
    }

    if (this.props.mission) {
      let bearing;
    }

    // moving take off and landing on click
    missionmap.on('click', (e) => {
      // TODO Add alert to redraw mission if these change
      if (this.props.getAngleActive) {
        const toPoint = latlong2featurePoint(e.latlng.wrap());
      }
    });

    // passing the new mission area geometry to the database
    missionmap.on(L.Draw.Event.CREATED, (event) => {

    });

    missionmap.on(L.Draw.Event.EDITED, (event) => {

    });

    missionmap.on(L.Draw.Event.EDITVERTEX, (event) => {
      if (this.props.editWayPointsActive) {
        this.geoJSONRpaPathLayer.clearLayers();
        this.geoJSONWaypointListLayer.clearLayers();
        const currentRPAPath =
        flightPlan.missionCalculation.rpaPath;
        const currentWaypointList =
        flightPlan.missionCalculation.waypointList;
        const newRPAPathFeature = event.poly.toGeoJSON(15);
        // TODO habria que hacer una comprobacion de que las listas
        // waypoints y trayectoria no estan desfasadas y borrarlas si lo estan
        let newWaypointList = {};
        switch (getOperationType(currentRPAPath, newRPAPathFeature)) {
        case 'add':
          newWaypointList = insertNewWaypoint(currentWaypointList, newRPAPathFeature);
          break;
        case 'delete':
          newWaypointList = removeWaypoint(currentWaypointList, newRPAPathFeature);
          break;
        case 'move':
          newWaypointList = moveWaypoint(currentWaypointList, newRPAPathFeature);
          break;
        default:
          newWaypointList = currentWaypointList;
          Bert.alert('You should not get themeteorchef', 'danger');
        }
        const newWaypointListWithNumbers = setWaypointNumbers(newWaypointList);
        this.props.editWayPoints(newWaypointListWithNumbers, newRPAPathFeature);
      }
    });

    // deleting the mission area geometry
    missionmap.on(L.Draw.Event.DELETED, () => {

    });
  }

  componentDidUpdate() {
    // re lodaing the mission if anything changes
    const { flightPlan } = this.props.mission;
    if (flightPlan) {
      if (flightPlan.takeOffPoint) {
        this.geoJSONTakeOffPointLayer.clearLayers();
        const myTakeOffPoint = flightPlan.takeOffPoint;
        const myTakeOffPointLayer = L.geoJSON(myTakeOffPoint, this.state.waypointListOptions);
        this.geoJSONTakeOffPointLayer.addLayer(myTakeOffPointLayer.getLayers()[0]);
      }
      if (flightPlan.landingPoint) {
        this.geoJSONLandingPointLayer.clearLayers();
        const myLandingPoint = flightPlan.landingPoint;
        const myLandingPointLayer = L.geoJSON(myLandingPoint, this.state.waypointListOptions);
        this.geoJSONLandingPointLayer.addLayer(myLandingPointLayer.getLayers()[0]);
      }

      let missionGeometry = '';
      if (flightPlan.missionArea) {
        missionGeometry = flightPlan.missionArea;
      } else if (flightPlan.missionAxis) {
        missionGeometry = flightPlan.missionAxis;
      }
      if (missionGeometry) {
        this.drawnItems.clearLayers();
        const myMissionGeomtryLayer = L.geoJSON(missionGeometry);
        this.drawnItems.addLayer(myMissionGeomtryLayer.getLayers()[0]);
      }

      if (flightPlan.missionCalculation) {
        if (flightPlan.missionCalculation.rpaPath) {
          this.geoJSONRpaPathLayer.clearLayers();
          const myRpaPath = flightPlan.missionCalculation.rpaPath;
          const myRpaPathLayer = L.geoJSON(myRpaPath, this.state.rpaPathStyle);
          this.geoJSONRpaPathLayer.addLayer(myRpaPathLayer.getLayers()[0]);
        }
        if (flightPlan.missionCalculation.waypointList) {
          this.geoJSONWaypointListLayer.clearLayers();
          const myWaypointList = flightPlan.missionCalculation.waypointList;
          const myWaypointListLayer = L.geoJSON(myWaypointList, this.state.waypointListOptions);
          myWaypointListLayer.eachLayer(layer => (this.geoJSONWaypointListLayer.addLayer(layer)));
        }
      }

      const myflightPlanKeys = Object.keys(flightPlan);
      const clearedKeys = ['takeOffPoint', 'landingPoint', 'missionArea', 'missionCalculation'];
      const myflightPlanKeysFiltered = myflightPlanKeys.filter(word => clearedKeys.includes(word));
      if (myflightPlanKeysFiltered.length === 0) {
        this.geoJSONTakeOffPointLayer.clearLayers();
        this.geoJSONLandingPointLayer.clearLayers();
        this.drawnItems.clearLayers();
        this.geoJSONRpaPathLayer.clearLayers();
        this.geoJSONWaypointListLayer.clearLayers();
      }
    }

    if (this.props.editWayPointsActive &&
      this.geoJSONRpaPathLayer.getLayers().length !== 0) {
      // this.missionmap.addControl(this.editControlWaypointPath);
      this.geoJSONRpaPathLayer.getLayers()[0].editing.enable();
    } else if (!this.props.editWayPointsActive &&
    this.geoJSONRpaPathLayer.getLayers().length !== 0) {
      // this.editControlWaypointPath.remove();
      this.geoJSONRpaPathLayer.getLayers()[0].editing.disable();
    }
  }

  render() {
    return (
      <div className="PreFlightMap" style={{ height: this.props.height }}>
        <div id="preflightmap" />
      </div>);
  }
}

PreFlightMap.defaultProps = {
  location: {
    type: 'Feature',
    geometry: {
      type: 'Point',
      coordinates: [-3.7038, 40.4168, 0],
    },
    properties: {
      zoom: 12,
    },
  },
  height: '80vh',
  setTakeOffPoint: () => {},
  setLandingPoint: () => {},
  editWayPointsActive: false,
  editWayPoints: () => {},
};

PreFlightMap.propTypes = {
  location: PropTypes.object,
  mission: PropTypes.object.isRequired,
  height: PropTypes.string,
  setTakeOffPoint: PropTypes.func,
  setLandingPoint: PropTypes.func,
  editWayPointsActive: PropTypes.bool,
  editWayPoints: PropTypes.func,
};

export default PreFlightMap;
