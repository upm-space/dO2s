import React, { Component } from 'react';
import { ButtonToolbar, Button } from 'react-bootstrap';
// import L from 'leaflet';
// import MissionMap from '../MissionMap/MissionMap';

import './MissionVideo.scss';

class MissionVideo extends Component {
  constructor(props) {
    super(props);
    this.state = {
      duration: 30000000,
    };
  }

  componentDidMount() {
    this.props.getLength(this.state.duration);
  }

  onLoad(data) {
    this.setState({ duration: data.duration });
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
          ref={(c) => { this.video = c; }}
          // onLoad={this.onLoad()}
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
      </div>
    );
  }
}

export default MissionVideo;
