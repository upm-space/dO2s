import React, { Component } from 'react';
import { Meteor } from 'meteor/meteor';
import { Bert } from 'meteor/themeteorchef:bert';
import PropTypes from 'prop-types';
import L from 'leaflet';
import 'leaflet-draw';

import { featurePoint2latlong, latlong2featurePoint, featurePointGetZoom } from '../../../modules/geojson-utilities';
import { waypointListOptions, rpaPathStyle } from '../../../modules/mission-planning/waypoint-style-chooser.js';
import { pointsCollectionFeatureToLineString } from '../../../modules/mission-planning/waypoint-utilities.js';

import './PreFlightMap.scss';

class PreFlightMap extends Component {
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
    const { flightPlan } = this.props.mission;
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
        if (flightPlan.missionCalculation.waypointList) {
          const rpaPath =
           pointsCollectionFeatureToLineString(flightPlan.missionCalculation.waypointList);
          const myRpaPathLayer = L.geoJSON(rpaPath, rpaPathStyle);
          geoJSONRpaPathLayer.addLayer(myRpaPathLayer.getLayers()[0]);
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

    });

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
        const myTakeOffPointLayer = L.geoJSON(myTakeOffPoint, waypointListOptions);
        this.geoJSONTakeOffPointLayer.addLayer(myTakeOffPointLayer.getLayers()[0]);
      }
      if (flightPlan.landingPoint) {
        this.geoJSONLandingPointLayer.clearLayers();
        const myLandingPoint = flightPlan.landingPoint;
        const myLandingPointLayer = L.geoJSON(myLandingPoint, waypointListOptions);
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
        if (flightPlan.missionCalculation.waypointList) {
          this.geoJSONRpaPathLayer.clearLayers();
          this.geoJSONWaypointListLayer.clearLayers();
          const rpaPath =
           pointsCollectionFeatureToLineString(flightPlan.missionCalculation.waypointList);
          const myRpaPathLayer = L.geoJSON(rpaPath, rpaPathStyle);
          this.geoJSONRpaPathLayer.addLayer(myRpaPathLayer.getLayers()[0]);
          const myWaypointList = flightPlan.missionCalculation.waypointList;
          const myWaypointListLayer = L.geoJSON(myWaypointList, waypointListOptions);
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
      this.geoJSONRpaPathLayer.getLayers()[0].editing.enable();
    } else if (!this.props.editWayPointsActive &&
    this.geoJSONRpaPathLayer.getLayers().length !== 0) {
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
