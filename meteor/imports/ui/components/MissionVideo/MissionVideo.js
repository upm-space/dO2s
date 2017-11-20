/* eslint-disable max-len */
import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { Button, Row, Col } from 'react-bootstrap';
import L from 'leaflet';

import './MissionVideo.scss';

let mymap;
let trajectory;
let trajectoryOn = false;
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
const dataSetPhotocenters = {
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

    this.initiate = this.initiate.bind(this);
    this.transformVideo = this.transformVideo.bind(this);
    this.getCoords = this.getCoords.bind(this);
    this.pointP = this.pointP.bind(this);
    this.lineP = this.lineP.bind(this);
    this.showTrajectory = this.showTrajectory.bind(this);

    this.state = {
      featureArray: [],
    };
  }

  componentDidMount() {
    setTimeout(this.initiate, 500);
    this.myVideo.addEventListener('loadeddata', () => {
      // console.log(this.myVideo.readyState);
    });
    this.myTxtVideo.addEventListener('loadeddata', () => {
      // console.log(this.myTxtVideo.readyState);
    });
  }

  componentDidUpdate() {
    n = this.props.logTime;
    // console.log(this.myTxtVideo.readyState);
    this.myVideo.playbackRate = this.props.speed;
    if (this.myVideo.readyState > 2) {
      this.myVideo.currentTime = this.props.videoTime * 1e-6;
      this.myVideo.play();
    }
    this.myTxtVideo.playbackRate = this.props.speed;
    if (this.myTxtVideo.readyState > 2) {
      this.myTxtVideo.currentTime = this.props.videoTime * 1e-6;
      this.myTxtVideo.play();
    }
  }

  getCoords(e) {
    timeIndex += 1;
    timeVector.push(new Date().getTime());
    const videoCoords = [e.screenY - this.myVideo.offsetTop - 131, e.screenX - this.myVideo.offsetLeft - 15, 0];
    const newData = this.transformGeoJson(p1.x, p1.y, p2.x, p2.y, p0.x, p0.y, p3.x, p3.y, videoCoords);
    const newDataTxt = mymap.containerPointToLatLng(new L.Point(newData[1] + p1.x, newData[0] + p1.y));
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
      dataSetLineString.features[0].geometry.coordinates.push([newDataTxt.lng, newDataTxt.lat]);
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

  showTrajectory() {
    if (!trajectoryOn) {
      trajectory = L.geoJSON(dataSetPhotocenters, {
        style: {
          color: '#ffbb00',
          weight: 4,
          opacity: 1,
          fillOpacity: 0,
        },
      }).addTo(mymap);
      trajectoryOn = true;
    } else {
      trajectory.clearLayers();
      trajectoryOn = false;
    }
  }

  initiate() {
    this.setState({
      featureArray: this.props.features,
    });
    for (let i = 0; i < this.state.featureArray.length; i += 1) {
      const [coords] = this.state.featureArray[i].geometry.coordinates;
      const Lng = (coords[0][0] + coords[1][0] + coords[2][0] + coords[3][0]) / 4;
      const Lat = (coords[0][1] + coords[1][1] + coords[2][1] + coords[3][1]) / 4;
      dataSetPhotocenters.features[0].geometry.coordinates.push([Lng, Lat]);
    }
    const [[Lng0, Lat0]] = dataSetPhotocenters.features[0].geometry.coordinates;

    mymap = L.map('Map').setView([Lat0, Lng0], 15);
    // L.tileLayer('http://{s}.tile.osm.org/{z}/{x}/{y}.png', {
    L.tileLayer('http://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}', {
      attribution: '&copy; <a href="http://osm.org/copyright">OpenStreetMap</a> contributors', minZoom: 1, maxZoom: 27,
    }).addTo(mymap);

    setInterval(() => {
      n += this.props.frequency * 1000 * this.props.speed;
      function isBigger(element) { return element.TimeUS >= n; }
      const elt = this.state.featureArray.find(isBigger);
      l = this.state.featureArray.indexOf(elt);
      [coordinates] = this.state.featureArray[l].geometry.coordinates;
      p0 = mymap.latLngToContainerPoint(new L.LatLng(coordinates[0][1], coordinates[0][0]));
      p1 = mymap.latLngToContainerPoint(new L.LatLng(coordinates[1][1], coordinates[1][0]));
      p2 = mymap.latLngToContainerPoint(new L.LatLng(coordinates[2][1], coordinates[2][0]));
      p3 = mymap.latLngToContainerPoint(new L.LatLng(coordinates[3][1], coordinates[3][0]));
      this.transformVideo(p1.x, p1.y, p2.x, p2.y, p0.x, p0.y, p3.x, p3.y);
      L.geoJSON(dataSetLineString, {
        style: myStyle,
      }).addTo(mymap);
      L.geoJSON(dataSetPoint, {
        style: myStyle,
      }).addTo(mymap);
    }, this.props.frequency);
  }

  transformVideo(x1, y1, x2, y2, x3, y3, x4, y4) {
    this.myTxtVideo.style['-webkit-transform-origin'] = '0 0';
    this.myTxtVideo.style['-moz-transform-origin'] = '0 0';
    this.myTxtVideo.style['-o-transform-origin'] = '0 0';
    this.myTxtVideo.style.transformOrigin = '0 0';
    const w = this.myTxtVideo.offsetWidth;
    const h = this.myTxtVideo.offsetHeight;
    let t = this.general2DProjection(0, 0, x1, y1, w, 0, x2, y2, 0, h, x3, y3, w, h, x4, y4);
    for (let i = 0; i < 9; i += 1) t[i] /= t[8];
    t = [t[0], t[3], 0, t[6],
      t[1], t[4], 0, t[7],
      0, 0, 1, 0,
      t[2], t[5], 0, t[8]];
    const tTxt = `matrix3d(${t.join(',')})`;
    this.myTxtVideo.style['-webkit-transform'] = tTxt;
    this.myTxtVideo.style['-moz-transform'] = tTxt;
    this.myTxtVideo.style['-o-transform'] = tTxt;
    this.myTxtVideo.style.transform = tTxt;
  }

  transformGeoJson(x1, y1, x2, y2, x3, y3, x4, y4, videoCoords) {
    const w = this.myVideo.offsetWidth;
    const h = this.myVideo.offsetHeight;
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
            <Col xs={12} sm={12} md={12} lg={12}>
              <Row>
                <Col xs={12} sm={12} md={12} lg={12}>
                  <Button
                    bsStyle="primary"
                    onClick={() => this.pointP()}
                    block
                  >
                    <div><span className="fa fa-map-marker fa-lg" aria-hidden="true" /></div>
                    <div>Add Point</div>
                  </Button>
                </Col>
                <Col xs={12} sm={12} md={12} lg={12}>
                  <Button
                    bsStyle="primary"
                    onClick={() => this.lineP()}
                    block
                  >
                    <div><span className="fa fa-line-chart fa-lg" aria-hidden="true" /></div>
                    <div>Add Line</div>
                  </Button>
                </Col>
              </Row>
              <br />
              <Row>
                <Col xs={12} sm={12} md={12} lg={12}>
                  <Button
                    bsStyle="warning"
                    onClick={() => this.showTrajectory()}
                    block
                  >
                    <div><span className="fa fa-paper-plane fa-lg" aria-hidden="true" /></div>
                    <div>Trajectory</div>
                  </Button>
                </Col>
              </Row>
              <br />
              <Row>
                <Col xs={12} sm={12} md={12} lg={12}>
                  <Button
                    bsStyle="success"
                    onClick={() => this.props.syncTrue()}
                    block
                  >
                    <div><span className="fa fa-link fa-lg" aria-hidden="true" /></div>
                    <div>Link<br />Timelines</div>
                  </Button>
                </Col>
              </Row>
              <br />
              <Row>
                <Col xs={12} sm={12} md={12} lg={12}>
                  <Button
                    bsStyle="danger"
                    onClick={() => this.props.syncFalse()}
                    block
                  >
                    <div>
                      <span className="fa fa-stack fa-lg" aria-hidden="true">
                        <i className="fa fa-link fa-stack-1x" aria-hidden="true" />
                        <i className="fa fa-ban fa-stack-2x" aria-hidden="true" />
                      </span>
                    </div>
                    <div>Unlink<br />Timelines</div>
                  </Button>
                </Col>
              </Row>
            </Col>
          </Row>
        </div>
        <div className="Map" id="Map" />
        <video
          id="TxtVideo"
          ref={(c) => { this.myTxtVideo = c; }}
          autoPlay
          muted
          preload
          // src="http://192.168.1.251:8080/logVideo.mp4"
          src="https://stemkoski.github.io/Three.js/videos/sintel.ogv"
          type="video/mp4"
          style={{ opacity: 0.5 }}
        ><track kind="captions" />Video not found
        </video>
        <video
          id="Video"
          ref={(c) => { this.myVideo = c; }}
          autoPlay
          muted
          preload
          src="https://stemkoski.github.io/Three.js/videos/sintel.ogv"
          // src="http://192.168.1.251:8080/logVideo.mp4"
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
  features: PropTypes.array.isRequired,
  syncTrue: PropTypes.func.isRequired,
  syncFalse: PropTypes.func.isRequired,
};

export default MissionVideo;
