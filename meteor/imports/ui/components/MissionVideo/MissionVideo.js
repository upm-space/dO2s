import React, { Component } from 'react';
import { ButtonToolbar, Button } from 'react-bootstrap';
// import L from 'leaflet';
// import MissionMap from '../MissionMap/MissionMap';

import './MissionVideo.scss';

class MissionVideo extends Component {
  componentDidMount() {
    this.myVideo.addEventListener('loadedmetadata', () => {
      this.props.getLength(this.myVideo.duration * 1e6);
    });
  }

  componentDidUpdate() {
    this.myVideo.currentTime = this.props.time * 1e-6;
    this.myTxtVideo.currentTime = this.props.time * 1e-6;
    this.myVideo.playbackRate = this.props.speed;
    this.myTxtVideo.playbackRate = this.props.speed;
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
        <div className="Map">Map</div>
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
          muted
          src="http://stemkoski.github.io/Three.js/videos/sintel.ogv"
          type="video/mp4"
        ><track kind="captions" />Video not found</video>
      </div>
    );
  }
}

export default MissionVideo;
