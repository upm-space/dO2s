import React, { Component } from 'react';
import { ButtonToolbar, Button } from 'react-bootstrap';
// import L from 'leaflet';
// import MissionMap from '../MissionMap/MissionMap';
import Slider from '../Slider/Slider';

import './MissionVideo.scss';

const MissionVideo = () => (
  <div className="MissionVideo">
    <div className="Buttons">
      <ButtonToolbar>
        <Button>Point</Button>
        <Button bsStyle="primary">Line</Button>
      </ButtonToolbar>
    </div>
    <div className="Map">Map</div>
    <video
      id="Video"
      autoPlay
      loop
      muted
      src="http://stemkoski.github.io/Three.js/videos/sintel.ogv"
      type="video/mp4"
    ><track kind="captions" />Video not found</video>
    <video
      id="TxtVideo"
      autoPlay
      loop
      muted
      src="http://stemkoski.github.io/Three.js/videos/sintel.ogv"
      type="video/mp4"
    ><track kind="captions" />Video not found</video>
    <Slider />
  </div>
);

export default MissionVideo;
