import React, { Component } from 'react';
import { Meteor } from 'meteor/meteor';
import PropTypes from 'prop-types';
import L from 'leaflet';
import 'leaflet-draw';

import { featurePoint2latlong, latlong2featurePoint, featurePointGetZoom } from '../../../modules/geojson-utilities';

import './MissionMap.scss';

if (Meteor.isClient) {
  L.Icon.Default.imagePath = '/images/';
}

const waypointIcon = (waypointType) => {
  switch (waypointType) {
  case 1 : return '/waypoints/fa-arrow-circle-up.svg';
  case 2 : return '/waypoints/fa-arrow-circle-down.svg';
  case 3 : return '/waypoints/fa-camera-on.svg';
  case 4 : return '/waypoints/fa-camera-off.svg';
  case 5 : return '/waypoints/fa-flag.svg';
  default : return '/images/marker-icon.png';
  }
};

const waypointSize = (waypointType) => {
  switch (waypointType) {
  case 1 : return [50, 50];
  case 2 : return [50, 50];
  case 3 : return [40, 40];
  case 4 : return [40, 40];
  case 5 : return [28, 41];
  default : return [25, 41];
  }
};

const waypointAnchor = (waypointType) => {
  switch (waypointType) {
  case 1 : return [24.3, 40];
  case 2 : return [24.3, 40];
  case 3 : return [20, 22];
  case 4 : return [20, 22];
  case 5 : return [3, 32];
  default : return [12, 41];
  }
};

class MissionMap extends Component {
  constructor(props) {
    super(props);
    this.state = {
      rpaPathStyle: {
        style: { color: '#d9534f' },
      },
      waypointListOptions: {
        pointToLayer(feature, latlng) {
          return L.marker(latlng, {
            icon: L.icon({
              iconUrl: waypointIcon(feature.properties.type),
              iconSize: waypointSize(feature.properties.type),
              iconAnchor: waypointAnchor(feature.properties.type),
            }),
          });
        },
      },
    };
  }

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
    const waypoints = new L.FeatureGroup().addTo(missionmap);
    const geoJSONRpaPathLayer = L.geoJSON().addTo(missionmap);
    const geoJSONWaypointListLayer = L.geoJSON().addTo(missionmap);


    this.drawnItems = drawnItems;
    this.waypoints = waypoints;
    this.geoJSONTakeOffPointLayer = geoJSONTakeOffPointLayer;
    this.geoJSONLandingPointLayer = geoJSONLandingPointLayer;
    this.geoJSONRpaPathLayer = geoJSONRpaPathLayer;
    this.geoJSONWaypointListLayer = geoJSONWaypointListLayer;

    if (this.props.mission.flightPlan) {
      if (this.props.mission.flightPlan.takeOffPoint) {
        const myTakeOffPoint = this.props.mission.flightPlan.takeOffPoint;
        const myTakeOffPointLayer = L.geoJSON(myTakeOffPoint, this.state.waypointListOptions);
        geoJSONTakeOffPointLayer.addLayer(myTakeOffPointLayer.getLayers()[0]);
      }
      if (this.props.mission.flightPlan.landingPoint) {
        const myLandingPoint = this.props.mission.flightPlan.landingPoint;
        const myLandingPointLayer = L.geoJSON(myLandingPoint, this.state.waypointListOptions);
        geoJSONLandingPointLayer.addLayer(myLandingPointLayer.getLayers()[0]);
      }

      let missionGeometry = '';

      if (this.props.mission.flightPlan.missionArea) {
        missionGeometry = this.props.mission.flightPlan.missionArea;
      } else if (this.props.mission.flightPlan.missionAxis) {
        missionGeometry = this.props.mission.flightPlan.missionAxis;
      }
      if (missionGeometry) {
        const myMissionGeomtryLayer = L.geoJSON(missionGeometry);
        drawnItems.addLayer(myMissionGeomtryLayer.getLayers()[0]);
      }
      if (this.props.mission.flightPlan.missionCalculation) {
        if (this.props.mission.flightPlan.missionCalculation.rpaPath) {
          const myRpaPath = this.props.mission.flightPlan.missionCalculation.rpaPath;
          const myRpaPathLayer = L.geoJSON(myRpaPath, this.state.rpaPathStyle);
          geoJSONRpaPathLayer.addLayer(myRpaPathLayer.getLayers()[0]);
        }
        if (this.props.mission.flightPlan.missionCalculation.waypointList) {
          const myWaypointList = this.props.mission.flightPlan.missionCalculation.waypointList;
          const myWaypointListLayer = L.geoJSON(myWaypointList, this.state.waypointListOptions);
          myWaypointListLayer.eachLayer(layer =>
            geoJSONWaypointListLayer.addLayer(layer));
        }
      }
    }


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

    missionmap.on('click', (e) => {
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

    missionmap.on(L.Draw.Event.CREATED, (event) => {
      const newGeometryLayer = event.layer;
      const featureFromLayer = newGeometryLayer.toGeoJSON();
      this.props.setMissionGeometry(featureFromLayer);
      missionmap.removeControl(drawControlFull);
      missionmap.addControl(drawControlEditOnly);
    });

    missionmap.on(L.Draw.Event.EDITED, (event) => {
      drawnItems.clearLayers();
      const editedGeometryLayer = event.layers.getLayers()[0];
      const featureFromEditedLayer = editedGeometryLayer.toGeoJSON();
      this.props.setMissionGeometry(featureFromEditedLayer);
      drawnItems.clearLayers();
    });

    missionmap.on(L.Draw.Event.DELETED, () => {
      if (drawnItems.getLayers().length === 0) {
        this.props.setMissionGeometry();
        missionmap.removeControl(drawControlEditOnly);
        missionmap.addControl(drawControlFull);
      }
    });
  }

  componentDidUpdate(prevProps) {
    if (this.props.mission.flightPlan) {
      if (this.props.mission.flightPlan.takeOffPoint) {
        this.geoJSONTakeOffPointLayer.clearLayers();
        const myTakeOffPoint = this.props.mission.flightPlan.takeOffPoint;
        const myTakeOffPointLayer = L.geoJSON(myTakeOffPoint, this.state.waypointListOptions);
        this.geoJSONTakeOffPointLayer.addLayer(myTakeOffPointLayer.getLayers()[0]);
      }
      if (this.props.mission.flightPlan.landingPoint) {
        this.geoJSONLandingPointLayer.clearLayers();
        const myLandingPoint = this.props.mission.flightPlan.landingPoint;
        const myLandingPointLayer = L.geoJSON(myLandingPoint, this.state.waypointListOptions);
        this.geoJSONLandingPointLayer.addLayer(myLandingPointLayer.getLayers()[0]);
      }

      let missionGeometry = '';
      if (this.props.mission.flightPlan.missionArea) {
        missionGeometry = this.props.mission.flightPlan.missionArea;
      } else if (this.props.mission.flightPlan.missionAxis) {
        missionGeometry = this.props.mission.flightPlan.missionAxis;
      }
      if (missionGeometry) {
        this.drawnItems.clearLayers();
        const myMissionGeomtryLayer = L.geoJSON(missionGeometry);
        this.drawnItems.addLayer(myMissionGeomtryLayer.getLayers()[0]);
      }
      if (this.props.mission.flightPlan.missionCalculation) {
        if (this.props.mission.flightPlan.missionCalculation.rpaPath) {
          this.geoJSONRpaPathLayer.clearLayers();
          const myRpaPath = this.props.mission.flightPlan.missionCalculation.rpaPath;
          const myRpaPathLayer = L.geoJSON(myRpaPath, this.state.rpaPathStyle);
          this.geoJSONRpaPathLayer.addLayer(myRpaPathLayer.getLayers()[0]);
        }
        if (this.props.mission.flightPlan.missionCalculation.waypointList) {
          this.geoJSONWaypointListLayer.clearLayers();
          const myWaypointList = this.props.mission.flightPlan.missionCalculation.waypointList;
          const myWaypointListLayer = L.geoJSON(myWaypointList, this.state.waypointListOptions);
          myWaypointListLayer.eachLayer(layer => (this.geoJSONWaypointListLayer.addLayer(layer)));
        }
      }
    }

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
};

MissionMap.propTypes = {
  location: PropTypes.object,
  mission: PropTypes.object.isRequired,
  height: PropTypes.string.isRequired,
  takeOffPointActive: PropTypes.bool.isRequired,
  landingPointActive: PropTypes.bool.isRequired,
  defineAreaActive: PropTypes.bool.isRequired,
  setTakeOffPoint: PropTypes.func.isRequired,
  setLandingPoint: PropTypes.func.isRequired,
  setMissionGeometry: PropTypes.func.isRequired,
};

export default MissionMap;
