/* eslint-disable max-len */
import React, { Component } from 'react';
import { Bert } from 'meteor/themeteorchef:bert';
import PropTypes from 'prop-types';
import { Button, Row, Col } from 'react-bootstrap';
import L from 'leaflet';

import './MissionVideo.scss';

let featureArray;
let coordinates0;
let Lng0;
let Lat0;
let mymap;
let n = 1;
let l = 0;
let coordinates;
let p0;
let p1;
let p2;
let p3;
let linePointSelector = 2;
let pointControl = false;
const timeVector = [];
let timeIndex = -1;
const dataSetPoint = {
  type: 'FeatureCollection',
  features: [],
};
const dataSetLineString = {
  type: 'FeatureCollection',
  features: [{
    type: 'Feature',
    geometry: {
      type: 'LineString',
      coordinates: [],
    },
  }],
};
const myStyle = {
  color: '#ffbb00',
  weight: 4,
  opacity: 0.65,
  fillOpacity: 0,
};

class MissionVideo extends Component {
  constructor(props) {
    super(props);

    this.transformVideo = this.transformVideo.bind(this);
    this.getCoords = this.getCoords.bind(this);
    this.pointP = this.pointP.bind(this);
    this.lineP = this.lineP.bind(this);
  }

  componentDidMount() {
    this.myVideo.addEventListener('loadedmetadata', () => {
    });
    this.myTxtVideo.addEventListener('loadedmetadata', () => {
    });
    this.initiate(this);
  }

  componentDidUpdate() {
    n = this.props.logTime;
    this.myVideo.currentTime = this.props.videoTime * 1e-6;
    this.myTxtVideo.currentTime = this.props.videoTime * 1e-6;
    this.myVideo.playbackRate = this.props.speed;
    this.myTxtVideo.playbackRate = this.props.speed;
    this.myVideo.play();
    this.myTxtVideo.play();
  }

  getCoords(e) {
    timeIndex += 1;
    timeVector.push(new Date().getTime());
    // const videoCoords = [e.screenY - this.myVideo.offsetTop - 65, e.screenX - this.myVideo.offsetLeft - 15, 0];
    const videoCoords = [e.screenY, e.screenX, 0];
    const newData1 = this.transformGeoJson(p1.x, p1.y, p2.x, p2.y, p0.x, p0.y, p3.x, p3.y, [0, 0, 0]);
    const newData2 = this.transformGeoJson(p1.x, p1.y, p2.x, p2.y, p0.x, p0.y, p3.x, p3.y, [this.myVideo.videoHeight, 0, 0]);
    const newData3 = this.transformGeoJson(p1.x, p1.y, p2.x, p2.y, p0.x, p0.y, p3.x, p3.y, [this.myVideo.videoHeight, this.myVideo.videoWidth, 0]);
    const newData4 = this.transformGeoJson(p1.x, p1.y, p2.x, p2.y, p0.x, p0.y, p3.x, p3.y, [0, this.myVideo.videoWidth, 0]);
    const newData = this.transformGeoJson(p1.x, p1.y, p2.x, p2.y, p0.x, p0.y, p3.x, p3.y, videoCoords);
    const newDataTxt = mymap.containerPointToLatLng(new L.Point(newData[1] + p1.x, newData[0] + p1.y));
    const newDataTxt1 = mymap.containerPointToLatLng(new L.Point(newData1[1] + p1.x, newData1[0] + p1.y));
    const newDataTxt2 = mymap.containerPointToLatLng(new L.Point(newData2[1] + p1.x, newData2[0] + p1.y));
    const newDataTxt3 = mymap.containerPointToLatLng(new L.Point(newData3[1] + p1.x, newData3[0] + p1.y));
    const newDataTxt4 = mymap.containerPointToLatLng(new L.Point(newData4[1] + p1.x, newData4[0] + p1.y));
    if (linePointSelector === 1 && pointControl) {
      pointControl = false;
      dataSetPoint.features[0] = {
        type: 'Feature',
        geometry: {
          type: 'Point',
          coordinates: [newDataTxt.lng, newDataTxt.lat, 0],
        },
      };
    }
    if ((timeVector[timeIndex] - timeVector[timeIndex - 1]) < 300 && linePointSelector === 0) {
      dataSetLineString.features[0].geometry.coordinates.push(dataSetLineString.features[0].geometry.coordinates[0]);
      linePointSelector = 2;
    }
    if (linePointSelector === 0) {
      // dataSetLineString.features[0].geometry.coordinates.push([newDataTxt.lng, newDataTxt.lat]);
      dataSetLineString.features[0].geometry.coordinates.push([newDataTxt1.lng, newDataTxt1.lat], [newDataTxt2.lng, newDataTxt2.lat], [newDataTxt3.lng, newDataTxt3.lat], [newDataTxt4.lng, newDataTxt4.lat], [newDataTxt1.lng, newDataTxt1.lat]);
    }
  }

  pointP() {
    linePointSelector = 1;
    pointControl = true;
  }
  lineP() {
    linePointSelector = 0;
    dataSetLineString.features[0] = {
      type: 'Feature',
      geometry: {
        type: 'LineString',
        coordinates: [],
      },
    };
  }

  initiate(a) {
    fetch('http://localhost:3000/images/logJson2.json')
      .then((response) => {
        const contentType = response.headers.get('content-type');
        if (contentType && contentType.includes('application/json')) {
          return response.json();
        }
        throw new TypeError("Oops, we haven't got JSON!");
      }).then((data) => {
        featureArray = data.features;
        [coordinates0] = featureArray[0].geometry.coordinates;
        Lng0 = (coordinates0[0][0] + coordinates0[1][0] + coordinates0[2][0] + coordinates0[3][0]) / 4;
        Lat0 = (coordinates0[0][1] + coordinates0[1][1] + coordinates0[2][1] + coordinates0[3][1]) / 4;

        mymap = L.map('Map').setView([Lat0, Lng0], 15);
        // L.tileLayer('http://{s}.tile.osm.org/{z}/{x}/{y}.png', {
        L.tileLayer('http://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}', {
          attribution: '&copy; <a href="http://osm.org/copyright">OpenStreetMap</a> contributors', minZoom: 1, maxZoom: 27,
        }).addTo(mymap);

        setInterval(() => {
          n += this.props.frequency * 1000 * this.props.speed;
          function isBigger(element) { return element.TimeUS >= n; }
          const elt = featureArray.find(isBigger);
          l = featureArray.indexOf(elt);
          [coordinates] = featureArray[l].geometry.coordinates;
          p0 = mymap.latLngToContainerPoint(new L.LatLng(coordinates[0][1], coordinates[0][0]));
          p1 = mymap.latLngToContainerPoint(new L.LatLng(coordinates[1][1], coordinates[1][0]));
          p2 = mymap.latLngToContainerPoint(new L.LatLng(coordinates[2][1], coordinates[2][0]));
          p3 = mymap.latLngToContainerPoint(new L.LatLng(coordinates[3][1], coordinates[3][0]));
          a.transformVideo(p1.x, p1.y, p2.x, p2.y, p0.x, p0.y, p3.x, p3.y);
          L.geoJSON(dataSetLineString, {
            style: myStyle,
          }).addTo(mymap);
          L.geoJSON(dataSetPoint, {
            style: myStyle,
          }).addTo(mymap);
        }, this.props.frequency);
      })
      .catch(error => Bert.alert(`Coordinates Request Error: ${error}`, 'warning'));
  }

  transformVideo(x1, y1, x2, y2, x3, y3, x4, y4) {
    this.myTxtVideoDiv.style['-webkit-transform-origin'] = '0 0';
    this.myTxtVideoDiv.style['-moz-transform-origin'] = '0 0';
    this.myTxtVideoDiv.style['-o-transform-origin'] = '0 0';
    this.myTxtVideoDiv.style.transformOrigin = '0 0';
    const w = this.myTxtVideo.videoWidth;
    const h = this.myTxtVideo.videoHeight;
    let t = this.general2DProjection(0, 0, x1, y1, w, 0, x2, y2, 0, h, x3, y3, w, h, x4, y4);
    for (let i = 0; i < 9; i += 1) t[i] /= t[8];
    t = [t[0], t[3], 0, t[6],
      t[1], t[4], 0, t[7],
      0, 0, 1, 0,
      t[2], t[5], 0, t[8]];
    const tTransform = `matrix3d(${t.join(',')})`;
    this.myTxtVideoDiv.style['-webkit-transform'] = tTransform;
    this.myTxtVideoDiv.style['-moz-transform'] = tTransform;
    this.myTxtVideoDiv.style['-o-transform'] = tTransform;
    this.myTxtVideoDiv.style.transform = tTransform;
  }

  transformGeoJson(x1, y1, x2, y2, x3, y3, x4, y4, videoCoords) {
    const w = this.myVideo.offsetWidth;
    const h = this.myVideo.videoHeight;
    const tV = this.general2DProjection(0, 0, x1, y1, w, 0, x2, y2, 0, h, x3, y3, w, h, x4, y4);
    for (let i = 0; i < 9; i += 1) tV[i] /= tV[8];
    const tMatrix = [tV[0], tV[3], tV[6],
      tV[1], tV[4], tV[7],
      tV[2], tV[5], tV[8]];
    const tP = this.multmv(tMatrix, videoCoords);
    return tP;
  }

  general2DProjection(x1s, y1s, x1d, y1d, x2s, y2s, x2d, y2d, x3s, y3s, x3d, y3d, x4s, y4s, x4d, y4d) {
    const s = this.basisToPoints(x1s, y1s, x2s, y2s, x3s, y3s, x4s, y4s);
    const d = this.basisToPoints(x1d, y1d, x2d, y2d, x3d, y3d, x4d, y4d);
    return this.multmm(d, this.adj(s));
  }

  basisToPoints(x1, y1, x2, y2, x3, y3, x4, y4) {
    const m = [
      x1, x2, x3,
      y1, y2, y3,
      1, 1, 1,
    ];
    const v = this.multmv(this.adj(m), [x4, y4, 1]);
    return this.multmm(m, [
      v[0], 0, 0,
      0, v[1], 0,
      0, 0, v[2],
    ]);
  }

  adj(m) {
    return [
      (m[4] * m[8]) - (m[5] * m[7]), (m[2] * m[7]) - (m[1] * m[8]), (m[1] * m[5]) - (m[2] * m[4]),
      (m[5] * m[6]) - (m[3] * m[8]), (m[0] * m[8]) - (m[2] * m[6]), (m[2] * m[3]) - (m[0] * m[5]),
      (m[3] * m[7]) - (m[4] * m[6]), (m[1] * m[6]) - (m[0] * m[7]), (m[0] * m[4]) - (m[1] * m[3]),
    ];
  }

  multmm(a, b) {
    const c = new Array(9);
    for (let i = 0; i < 3; i += 1) {
      for (let j = 0; j < 3; j += 1) {
        let cij = 0;
        for (let k = 0; k < 3; k += 1) {
          cij += a[(3 * i) + k] * b[(3 * k) + j];
        }
        c[(3 * i) + j] = cij;
      }
    }
    return c;
  }

  multmv(m, v) {
    return [
      (m[0] * v[0]) + (m[1] * v[1]) + (m[2] * v[2]),
      (m[3] * v[0]) + (m[4] * v[1]) + (m[5] * v[2]),
      (m[6] * v[0]) + (m[7] * v[1]) + (m[8] * v[2]),
    ];
  }

  render() {
    return (
      <div className="MissionVideo" id="MissionVideo">
        <div className="ButtonDiv">
          <Row>
            <Col xs={10} sm={10} md={10} lg={12}>
              <Row>
                <Col xs={10} sm={10} md={6} lg={6} className="margin-bottom">
                  <Button
                    bsStyle="primary"
                    onClick={() => this.pointP()}
                    block
                  >
                    {/* <div><i className="fa fa-arrow-circle-up fa-lg" aria-hidden="true" /></div> */}
                    <div>Add Point</div>
                  </Button>
                </Col>
                <Col xs={10} sm={10} md={6} lg={6} className="margin-bottom">
                  <Button
                    bsStyle="primary"
                    onClick={() => this.lineP()}
                    block
                  >
                    {/* <div><i className="fa fa-arrow-circle-down fa-lg" aria-hidden="true" /></div> */}
                    <div>Add Line</div>
                  </Button>
                </Col>
              </Row>
              <br />
              <Row>
                <Col xs={10} sm={10} md={10} lg={12} className="padding2">
                  <Button
                    bsStyle="warning"
                    onClick={() => {}}
                    block
                  >
                    {/* <div><i className="fa fa-paper-plane fa-lg" aria-hidden="true" /></div> */}
                    <div>Show<br />Photocenters</div>
                  </Button>
                </Col>
              </Row>
              <br />
              <Row>
                <Col xs={10} sm={10} md={10} lg={12} className="padding2">
                  <Button
                    bsStyle="success"
                    onClick={() => this.props.syncTrue()}
                    block
                  >
                    {/* <div><i className="fa fa-superpowers fa-lg" aria-hidden="true" /></div> */}
                    <div>Synchronize<br />Timeline</div>
                  </Button>
                </Col>
              </Row>
              <br />
              <Row>
                <Col xs={10} sm={10} md={10} lg={12} className="padding2">
                  <Button
                    bsStyle="danger"
                    onClick={() => this.props.syncFalse()}
                    block
                  >
                    {/* <div><i className="fa fa-map-marker fa-lg" aria-hidden="true" /></div> */}
                    <div>Unsynchronize<br />Timeline</div>
                  </Button>
                </Col>
              </Row>
            </Col>
          </Row>
        </div>
        <div className="Map" id="Map" />
        <div className="TxtVideoDiv" id="TxtVideoDiv" ref={(c) => { this.myTxtVideoDiv = c; }}>
          <video
            id="TxtVideo"
            ref={(c) => { this.myTxtVideo = c; }}
            autoPlay
            muted
            src="http://stemkoski.github.io/Three.js/videos/sintel.ogv"
            type="video/mp4"
            style={{ opacity: 0.5 }}
          ><track kind="captions" />Video not found
          </video>
        </div>
        <video
          id="Video"
          ref={(c) => { this.myVideo = c; }}
          autoPlay
          muted
          src="http://stemkoski.github.io/Three.js/videos/sintel.ogv"
          type="video/mp4"
          onClick={this.getCoords}
        ><track kind="captions" />Video not found
        </video>
      </div>
    );
  }
}

MissionVideo.propTypes = {
  videoTime: PropTypes.number.isRequired,
  logTime: PropTypes.number.isRequired,
  speed: PropTypes.number.isRequired,
  frequency: PropTypes.number.isRequired,
  syncTrue: PropTypes.func.isRequired,
  syncFalse: PropTypes.func.isRequired,
};

export default MissionVideo;
