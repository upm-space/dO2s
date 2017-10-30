import React, { Component } from 'react';
import { Bert } from 'meteor/themeteorchef:bert';
import PropTypes from 'prop-types';
import { ButtonToolbar, Button } from 'react-bootstrap';
import L from 'leaflet';

import './MissionVideo.scss';

let features;
let coordinates0;
let Lng0;
let Lat0;
let mymap;
let l = 0;
let coordinates;
let p0;
let p1;
let p2;
let p3;

class MissionVideo extends Component {
  constructor(props) {
    super(props);

    this.initiate = this.initiate.bind(this);
    this.transformVideo = this.transformVideo.bind(this);
  }

  componentDidMount() {
    this.myVideo.addEventListener('loadedmetadata', () => {
    });
    const a = this;
    this.initiate(a);
  }

  componentDidUpdate() {
    this.myVideo.currentTime = this.props.videoTime * 1e-6;
    this.myTxtVideo.currentTime = this.props.videoTime * 1e-6;
    this.myVideo.playbackRate = this.props.speed;
    this.myTxtVideo.playbackRate = this.props.speed;
    this.myVideo.play();
    this.myTxtVideo.play();
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
        features = data.features;
        coordinates0 = features[0].geometry.coordinates[0];
        Lng0 = (coordinates0[0][0] + coordinates0[1][0] +
          coordinates0[2][0] + coordinates0[3][0]) / 4;
        Lat0 = (coordinates0[0][1] + coordinates0[1][1] +
          coordinates0[2][1] + coordinates0[3][1]) / 4;

        mymap = L.map('Map').setView([Lat0, Lng0], 15);
        L.tileLayer('http://{s}.tile.osm.org/{z}/{x}/{y}.png', {
          attribution: '&copy; <a href="http://osm.org/copyright">OpenStreetMap</a> contributors',
        }).addTo(mymap);

        setInterval(() => {
          // if (features[l].TimeUS < this.props.logTime) { l += 1; }
          l += 2;
          coordinates = features[l].geometry.coordinates[0];
          p0 = mymap.latLngToContainerPoint(new L.LatLng(coordinates[0][1], coordinates[0][0]));
          p1 = mymap.latLngToContainerPoint(new L.LatLng(coordinates[1][1], coordinates[1][0]));
          p2 = mymap.latLngToContainerPoint(new L.LatLng(coordinates[2][1], coordinates[2][0]));
          p3 = mymap.latLngToContainerPoint(new L.LatLng(coordinates[3][1], coordinates[3][0]));
          a.transformVideo(p1.x, p1.y, p2.x, p2.y, p0.x, p0.y, p3.x, p3.y);
        }, this.props.frequency);
      })
      .catch(error => Bert.alert(`Coordinates Request Error: ${error}`, 'warning'))
    ;
  }

  transformVideo(x1, y1, x2, y2, x3, y3, x4, y4) {
    this.myTxtVideo.style['-webkit-transform-origin'] = '0 0';
    this.myTxtVideo.style['-moz-transform-origin'] = '0 0';
    this.myTxtVideo.style['-o-transform-origin'] = '0 0';
    this.myTxtVideo.style.transformOrigin = '0 0';
    const w = this.myTxtVideo.videoWidth;
    const h = this.myTxtVideo.videoHeight;
    let t = this.general2DProjection(0, 0, x1, y1, w, 0, x2, y2, 0, h, x3, y3, w, h, x4, y4);
    for (let i = 0; i < 9; i += 1) t[i] /= t[8];
    t = [t[0], t[3], 0, t[6],
      t[1], t[4], 0, t[7],
      0, 0, 1, 0,
      t[2], t[5], 0, t[8]];
    const tTransform = `matrix3d(${t.join(',')})`;
    this.myTxtVideo.style['-webkit-transform'] = tTransform;
    this.myTxtVideo.style['-moz-transform'] = tTransform;
    this.myTxtVideo.style['-o-transform'] = tTransform;
    this.myTxtVideo.style.transform = tTransform;
  }

  transformGeoJson(x1, y1, x2, y2, x3, y3, x4, y4, videoCoords) {
    const w = this.myVideo.offsetWidth;
    const h = this.myVideo.offsetHeight;
    const tV = this.general2DProjection(0, 0, x1, y1, w, 0, x2, y2, 0, h, x3, y3, w, h, x4, y4);
    for (let i = 0; i < 9; i += 1) tV[i] /= tV[8];
    const tMatrix = [tV[0], tV[3], 0, tV[6],
      tV[1], tV[4], 0, tV[7],
      0, 0, 1, 0,
      tV[2], tV[5], 0, tV[8]];
    const tP = [
      (tMatrix[0] * videoCoords[0]) + (tMatrix[1] * videoCoords[1]) +
      (tMatrix[2] * videoCoords[2]) + (tMatrix[3] * videoCoords[3]),
      (tMatrix[4] * videoCoords[0]) + (tMatrix[5] * videoCoords[1]) +
      (tMatrix[6] * videoCoords[2]) + (tMatrix[7] * videoCoords[3]),
      (tMatrix[8] * videoCoords[0]) + (tMatrix[9] * videoCoords[1]) +
      (tMatrix[10] * videoCoords[2]) + (tMatrix[11] * videoCoords[3]),
      (tMatrix[12] * videoCoords[0]) + (tMatrix[13] * videoCoords[1]) +
      (tMatrix[14] * videoCoords[2]) + (tMatrix[15] * videoCoords[3]),
    ];
    for (let j = 0; j < 4; j += 1) tP[j] /= tV[3];
    return tP;
  }

  general2DProjection(x1s, y1s, x1d, y1d, x2s, y2s, x2d, y2d,
    x3s, y3s, x3d, y3d, x4s, y4s, x4d, y4d) {
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

  adj(m) { // Compute the adjugate of m
    return [
      (m[4] * m[8]) - (m[5] * m[7]), (m[2] * m[7]) - (m[1] * m[8]), (m[1] * m[5]) - (m[2] * m[4]),
      (m[5] * m[6]) - (m[3] * m[8]), (m[0] * m[8]) - (m[2] * m[6]), (m[2] * m[3]) - (m[0] * m[5]),
      (m[3] * m[7]) - (m[4] * m[6]), (m[1] * m[6]) - (m[0] * m[7]), (m[0] * m[4]) - (m[1] * m[3]),
    ];
  }

  multmm(a, b) { // multiply two matrices
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

  multmv(m, v) { // multiply matrix and vector
    return [
      (m[0] * v[0]) + (m[1] * v[1]) + (m[2] * v[2]),
      (m[3] * v[0]) + (m[4] * v[1]) + (m[5] * v[2]),
      (m[6] * v[0]) + (m[7] * v[1]) + (m[8] * v[2]),
    ];
  }

  render() {
    return (
      <div className="MissionVideo" id="MissionVideo">
        <div className="Buttons">
          <ButtonToolbar>
            <Button>Point</Button>
            <Button bsStyle="primary">Line</Button>
          </ButtonToolbar>
        </div>
        <div className="Map" id="Map">Map</div>
        <video
          id="Video"
          ref={(c) => { this.myVideo = c; }}
          autoPlay
          muted
          src="http://stemkoski.github.io/Three.js/videos/sintel.ogv"
          type="video/mp4"
        ><track kind="captions" />Video not found</video>
        <video
          id="TxtVideo"
          ref={(c) => { this.myTxtVideo = c; }}
          autoPlay
          loop
          muted
          src="http://stemkoski.github.io/Three.js/videos/sintel.ogv"
          type="video/mp4"
        ><track kind="captions" />Video not found</video>
      </div>
    );
  }
}

MissionVideo.propTypes = {
  videoTime: PropTypes.number.isRequired,
  logTime: PropTypes.number.isRequired,
  speed: PropTypes.number.isRequired,
  frequency: PropTypes.number.isRequired,
};

export default MissionVideo;
