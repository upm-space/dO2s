import React, { Component } from 'react';
import { Bert } from 'meteor/themeteorchef:bert';
import PropTypes from 'prop-types';
import L from 'leaflet';
import 'leaflet-draw';

import { featurePoint2latlong, latlong2featurePoint, featurePointGetZoom } from '../../../modules/geojson-utilities';
import { getWaypointType, waypointSize, waypointAnchor, waypointHtml } from '../../../modules/waypoint-style-chooser.js';
import { getOperationType, insertNewWaypoint, removeWaypoint, moveWaypoint, setWaypointNumbers, createRPAPath } from '../../../modules/waypoint-utilities.js';

import './MissionMap.scss';


const rpaPathStyle = {
  style: { color: '#d9534f' },
};

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

class MissionMap extends Component {
  componentDidMount() {
    const currentLocation = this.props.location;
    const missionmap = L.map('missionmap').setView(featurePoint2latlong(currentLocation), featurePointGetZoom(currentLocation));
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

    // we load these variables in the component to access them
    // in other functions.
    this.drawnItems = drawnItems;
    this.geoJSONTakeOffPointLayer = geoJSONTakeOffPointLayer;
    this.geoJSONLandingPointLayer = geoJSONLandingPointLayer;
    this.geoJSONRpaPathLayer = geoJSONRpaPathLayer;
    this.geoJSONWaypointListLayer = geoJSONWaypointListLayer;

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
          const rpaPath = createRPAPath(flightPlan.missionCalculation.waypointList.features);
          const myRpaPathLayer = L.geoJSON(rpaPath, rpaPathStyle);
          geoJSONRpaPathLayer.addLayer(myRpaPathLayer.getLayers()[0]);
          const myWaypointList = flightPlan.missionCalculation.waypointList;
          const myWaypointListLayer = L.geoJSON(myWaypointList, waypointListOptions);
          myWaypointListLayer.eachLayer(layer =>
            geoJSONWaypointListLayer.addLayer(layer));
        }
      }
    }

    // defining draw controls
    const drawControlFull = new L.Control.Draw({
      edit: {
        featureGroup: drawnItems,
        poly: {
          allowIntersection: false,
        },
      },
      draw: {
        polygon: (this.props.mission.missionType === 'Surface Area' ?
          {
            allowIntersection: false,
            showArea: true,
          } : false),
        marker: false,
        circle: false,
        polyline: (this.props.mission.missionType === 'Linear Area'),
        rectangle: false,
        circlemarker: false,
      },
    });

    const drawControlEditOnly = new L.Control.Draw({
      edit: {
        featureGroup: drawnItems,
        poly: {
          allowIntersection: false,
        },
      },
      draw: false,
    });

    this.drawControlFull = drawControlFull;
    this.drawControlEdit = drawControlEditOnly;

    // moving take off and landing on click
    missionmap.on('click', (e) => {
      // TODO Add alert to redraw mission if these change
      if (this.props.takeOffPointActive) {
        const myTakeOffPoint = latlong2featurePoint(e.latlng.wrap());
        myTakeOffPoint.properties = {};
        myTakeOffPoint.properties.type = 1;
        geoJSONTakeOffPointLayer.clearLayers();
        this.props.setTakeOffPoint(myTakeOffPoint);
      }

      if (this.props.landingPointActive) {
        const myLandingPoint = latlong2featurePoint(e.latlng.wrap());
        myLandingPoint.properties = {};
        myLandingPoint.properties.type = 2;
        geoJSONLandingPointLayer.clearLayers();
        this.props.setLandingPoint(myLandingPoint);
      }
    });

    // passing the new mission area geometry to the database
    missionmap.on(L.Draw.Event.CREATED, (event) => {
      if (this.props.defineAreaActive) {
        // TODO add alert to redraw misison
        const featureFromLayer = event.layer.toGeoJSON(15);
        this.props.setMissionGeometry(featureFromLayer);
        missionmap.removeControl(drawControlFull);
        missionmap.addControl(drawControlEditOnly);
      }
    });

    missionmap.on(L.Draw.Event.EDITED, (event) => {
      if (this.props.defineAreaActive) {
        // TODO add alert to redraw misison
        if (event.layers.getLayers().length !== 0) {
          drawnItems.clearLayers();
          const editedGeometryLayer = event.layers.getLayers()[0];
          const featureFromEditedLayer = editedGeometryLayer.toGeoJSON(15);
          this.props.setMissionGeometry(featureFromEditedLayer);
        }
      }
    });

    missionmap.on(L.Draw.Event.EDITVERTEX, (event) => {
      if (this.props.editWayPointsActive) {
        const currentWaypointList =
        flightPlan.missionCalculation.waypointList;
        const newRPAPathLatLngs = event.poly.getLatLngs();
        const eventOldPath = event.poly.feature;
        const newRPAPathLineString = {
          type: 'Feature',
          geometry: {
            type: 'LineString',
            coordinates: L.GeoJSON.latLngsToCoords(newRPAPathLatLngs, 0, false, 15),
          },
          properties: {},
        };
        let newWaypointList = {};

        switch (getOperationType(eventOldPath, newRPAPathLineString)) {
        case 'add':
          newWaypointList = insertNewWaypoint(currentWaypointList, newRPAPathLineString);
          break;
        case 'delete':
          newWaypointList = removeWaypoint(currentWaypointList, newRPAPathLineString);
          break;
        case 'move':
          newWaypointList = moveWaypoint(currentWaypointList, newRPAPathLineString);
          break;
        default:
          newWaypointList = currentWaypointList;
          Bert.alert('You should not get themeteorchef', 'danger');
        }
        const newWaypointListWithNumbers = setWaypointNumbers(newWaypointList);
        this.geoJSONRpaPathLayer.clearLayers();
        this.geoJSONWaypointListLayer.clearLayers();
        this.props.editWayPoints(newWaypointListWithNumbers);
      }
    });

    // deleting the mission area geometry
    missionmap.on(L.Draw.Event.DELETED, () => {
      if (this.props.defineAreaActive) {
        if (drawnItems.getLayers().length === 0) {
          this.props.setMissionGeometry();
          missionmap.removeControl(drawControlEditOnly);
          missionmap.addControl(drawControlFull);
        }
      }
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
          const rpaPath = createRPAPath(flightPlan.missionCalculation.waypointList.features);
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

    // making controls visible when clicking the area button
    if (this.props.defineAreaActive) {
      if (this.drawnItems.getLayers().length === 0) {
        this.missionmap.addControl(this.drawControlFull);
      } else {
        this.missionmap.addControl(this.drawControlEdit);
      }
    } else if (!this.props.defineAreaActive) {
      this.drawControlFull.remove();
      this.drawControlEdit.remove();
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
      <div className="MissionMap" style={{ height: this.props.height }}>
        <div id="missionmap" />
      </div>);
  }
}

MissionMap.defaultProps = {
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
  takeOffPointActive: false,
  landingPointActive: false,
  defineAreaActive: false,
  setTakeOffPoint: () => {},
  setLandingPoint: () => {},
  setMissionGeometry: () => {},
  editWayPointsActive: false,
  editWayPoints: () => {},
};

MissionMap.propTypes = {
  location: PropTypes.object,
  mission: PropTypes.object.isRequired,
  height: PropTypes.string,
  takeOffPointActive: PropTypes.bool,
  landingPointActive: PropTypes.bool,
  defineAreaActive: PropTypes.bool,
  setTakeOffPoint: PropTypes.func,
  setLandingPoint: PropTypes.func,
  setMissionGeometry: PropTypes.func,
  editWayPointsActive: PropTypes.bool,
  editWayPoints: PropTypes.func,
};

export default MissionMap;
