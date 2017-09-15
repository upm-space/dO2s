import React, { Component } from 'react';
import PropTypes from 'prop-types';
import L from 'leaflet';
import 'leaflet-draw';

import { featurePoint2latlong, latlong2featurePoint, featurePointGetZoom, featureSetAltitudeToZero } from '../../../modules/geojson-utilities';

import './MissionMap.scss';

class MissionMap extends Component {
  constructor(props) {
    super(props);
    this.state = {
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
    this.drawnItems = drawnItems;
    this.geoJSONTakeOffPointLayer = geoJSONTakeOffPointLayer;
    this.geoJSONLandingPointLayer = geoJSONLandingPointLayer;

    if (this.props.mission.flightPlan) {
      if (this.props.mission.flightPlan.takeOffPoint) {
        geoJSONTakeOffPointLayer.addData(this.props.mission.flightPlan.takeOffPoint);
      }
      if (this.props.mission.flightPlan.landingPoint) {
        geoJSONLandingPointLayer.addData(this.props.mission.flightPlan.landingPoint);
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

    this.drawnItems = drawnItems;
    this.drawControlFull = drawControlFull;
    this.drawControlEdit = drawControlEditOnly;

    missionmap.on('click', (e) => {
      if (this.props.takeOffPointActive) {
        const myTakeOffPoint = latlong2featurePoint(e.latlng.wrap());
        myTakeOffPoint.properties = {};
        myTakeOffPoint.properties.waypointType = 'take-off';
        geoJSONTakeOffPointLayer.clearLayers();
        this.props.setTakeOffPoint(myTakeOffPoint);
      }

      if (this.props.landingPointActive) {
        const myLandingPoint = latlong2featurePoint(e.latlng.wrap());
        myLandingPoint.properties = {};
        myLandingPoint.properties.waypointType = 'landing';
        geoJSONLandingPointLayer.clearLayers();
        this.props.setLandingPoint(myLandingPoint);
      }
    });

    missionmap.on(L.Draw.Event.CREATED, (event) => {
      const newGeometryLayer = event.layer;
      const featureFromLayer = newGeometryLayer.toGeoJSON();
      featureSetAltitudeToZero(featureFromLayer);
      this.props.setMissionGeometry(featureFromLayer);
      missionmap.removeControl(drawControlFull);
      missionmap.addControl(drawControlEditOnly);
    });

    missionmap.on(L.Draw.Event.EDITED, (event) => {
      drawnItems.clearLayers();
      const editedGeometryLayer = event.layers.getLayers()[0];
      const featureFromEditedLayer = editedGeometryLayer.toGeoJSON();
      featureSetAltitudeToZero(featureFromEditedLayer);
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
        this.geoJSONTakeOffPointLayer.addData(this.props.mission.flightPlan.takeOffPoint);
      }
      if (this.props.mission.flightPlan.landingPoint) {
        this.geoJSONLandingPointLayer.clearLayers();
        this.geoJSONLandingPointLayer.addData(this.props.mission.flightPlan.landingPoint);
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
  onLocationChange: PropTypes.func.isRequired,
  height: PropTypes.string.isRequired,
  takeOffPointActive: PropTypes.bool.isRequired,
  landingPointActive: PropTypes.bool.isRequired,
  defineAreaActive: PropTypes.bool.isRequired,
  setTakeOffPoint: PropTypes.func.isRequired,
  setLandingPoint: PropTypes.func.isRequired,
  setMissionGeometry: PropTypes.func.isRequired,
};

export default MissionMap;
