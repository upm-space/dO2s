import React, { Component } from 'react';
import { Bert } from 'meteor/themeteorchef:bert';
import PropTypes from 'prop-types';
import L from 'leaflet';
import 'leaflet-draw';

import { featurePoint2latlong, latlong2featurePoint, featurePointGetZoom } from '../../../modules/geojson-utilities';
import { waypointListOptions, rpaPathStyle } from '../../../modules/mission-planning/waypoint-style-chooser.js';
import { getOperationType, insertNewWaypointsAtIndex, removeWaypoint, moveWaypoint, setWaypointNumbers, pointsCollectionFeatureToLineString } from '../../../modules/mission-planning/waypoint-utilities.js';

import './MissionMap.scss';

class MissionMap extends Component {
  componentDidMount() {
    const currentLocation = this.props.location;
    const missionmap = L.map('missionmap').setView(featurePoint2latlong(currentLocation), featurePointGetZoom(currentLocation));
    this.missionmap = missionmap;
    L.tileLayer('https://server.arcgisonline.com/ArcGIS/rest/services' +
'/World_Imagery/MapServer/tile/{z}/{y}/{x}', {
      attribution: 'Tiles &copy; Esri &mdash; Source: Esri, i-cubed, USDA, USGS, AEX, GeoEye, Getmapping, Aerogrid, IGN, IGP, UPR-EGP, and the GIS User Community',
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

    // Here we load the first mission data on the map if it exists
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
        // this.editWaypointsLuis(event);
        this.editWaypointsPilar(event);
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

  editWaypointsPilar(event) {
    const { flightPlan } = this.props.mission;
    const currentWaypointList =
    flightPlan.missionCalculation.waypointList;
    const newRPAPathLatLngs = event.poly.getLatLngs();
    const rpaOldPath = event.poly.feature;
    // const newRPAPathLineString = {
    //   type: 'Feature',
    //   geometry: {
    //     type: 'LineString',
    //     coordinates: L.GeoJSON.latLngsToCoords(newRPAPathLatLngs, 0, false, 15),
    //   },
    //   properties: {},
    // };
    let newWaypointList = {};
    const operationType = getOperationType(rpaOldPath, newRPAPathLatLngs);
    let wptype = 5;
    if (operationType.operation === 'move') {
      wptype = currentWaypointList.features[operationType.index].properties.type;
    }
    const nextWPFeature = {
      type: 'Feature',
      geometry: {
        type: 'Point',
        coordinates: [operationType.lon, operationType.lat],
      },
      properties: {
        type: wptype,
        altRelative: flightPlan.flightParameters.height,
        altAbsolute: flightPlan.flightParameters.height,
        altGround: 0,
      },
    };
    switch (operationType.operation) {
    case 'add':
      newWaypointList = insertNewWaypointsAtIndex(currentWaypointList, operationType.index, nextWPFeature);
      break;
    case 'delete':
      newWaypointList = removeWaypoint(currentWaypointList, operationType.index);
      break;
    case 'move':
      newWaypointList = moveWaypoint(currentWaypointList, operationType.index, nextWPFeature);
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

  editWaypointsLuis(event) {
    const oldList = event.poly.feature.geometry.coordinates;
    // oldList[0][lon, lat]
    const newList = event.poly.getLatLngs(); // newList[0].{lat, lng}
    const olminusnl = oldList.length - newList.length;
    const result = {
      operation: 'none', index: -1, lat: -1, lon: -1,
    };
    let wpIndex = 0;
    switch (olminusnl) {
    case 1: // borrado
      for (wpIndex = 0; wpIndex < newList.length; wpIndex += 1) {
        if ((newList[wpIndex].lng !== oldList[wpIndex][0]) ||
             (newList[wpIndex].lat !== oldList[wpIndex][1])) {
          result.index = wpIndex;
          result.operation = 'delete';
          break;
        }
      }
      break;
    case 0: // move
      for (wpIndex = 0; wpIndex < newList.length; wpIndex += 1) {
        if ((newList[wpIndex].lng !== oldList[wpIndex][0]) ||
           (newList[wpIndex].lat !== oldList[wpIndex][1])) {
          result.index = wpIndex;
          result.operation = 'move';
          result.lat = newList[wpIndex].lat;
          result.lon = newList[wpIndex].lng;
          break;
        }
      }
      break;
    case -1: // add
      for (wpIndex = 0; wpIndex < newList.length; wpIndex += 1) {
        if ((newList[wpIndex].lng !== oldList[wpIndex][0]) ||
           (newList[wpIndex].lat !== oldList[wpIndex][1])) {
          result.index = wpIndex;
          result.operation = 'add';
          result.lat = newList[wpIndex].lat;
          result.lon = newList[wpIndex].lng;
          break;
        }
      }
      break;
    default:
      break;
    }

    const nextWPFeature = {
      type: 'Feature',
      geometry: {
        type: 'Point',
        coordinates: [],
      },
      properties: {
        type: 5,
        altRelative: flightPlan.flightParameters.height,
        altAbsolute: flightPlan.flightParameters.height,
        altGround: 0,
      },
    };
    const currentWaypointList =
      flightPlan.missionCalculation.waypointList;
    const newWaypointList =
      JSON.parse(JSON.stringify(currentWaypointList));
      // currentWaypointList.features[0].geometry.coordinates[0]
    switch (result.operation) {
    case 'delete':
      newWaypointList.features.splice(result.index, 1);
      break;
    case 'move':
      newWaypointList.features[result.index].geometry.coordinates[0] = result.lon;
      newWaypointList.features[result.index].geometry.coordinates[1] = result.lat;
      break;
    case 'add':
      newWaypointList.features.splice(result.index, 1);
      nextWPFeature.geometry.coordinates[0] = result.lon;
      nextWPFeature.geometry.coordinates[1] = result.lat;
      newWaypointList.features.splice(result.index, 0, nextWPFeature);
      break;
    default:
      console.log('algo anda mal');
      break;
    }
    const newWaypointListWithNumbers = setWaypointNumbers(newWaypointList);
    this.geoJSONRpaPathLayer.clearLayers();
    this.geoJSONWaypointListLayer.clearLayers();
    this.props.editWayPoints(newWaypointListWithNumbers);
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
