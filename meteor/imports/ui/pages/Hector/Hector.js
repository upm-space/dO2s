import React, { Component } from 'react';
import { Bert } from 'meteor/themeteorchef:bert';
import MissionVideo from '../../components/MissionVideo/MissionVideo';
import Slider from '../../components/Slider/Slider';
import Zoom from '../../components/Zoom/Zoom';
import TimeControlComponent from '../../components/TimelineWidget/TimeControlComponent';

import './Hector.scss';

const coordinateUrl = 'http://localhost:3000/images/logJson2.json';
let featureArray;
let last;

class Hector extends Component {
  constructor(props) {
    super(props);

    this.changeRange = this.changeRange.bind(this);
    this.changeSpeed = this.changeSpeed.bind(this);
    this.changeLogTime = this.changeLogTime.bind(this);
    this.changeVideoTime = this.changeVideoTime.bind(this);
    this.syncTrue = this.syncTrue.bind(this);
    this.syncFalse = this.syncFalse.bind(this);

    this.state = {
      timeRangeStart: 0,
      timeRangeEnd: 0,
      logTime: 0,
      videoTime: 0,
      speed: 1,
      frequency: 200,
      domain: 60000000,
      synchrony: false,
      timeGap: 0,
    };
  }

  componentWillMount() {
    fetch(coordinateUrl)
      .then((response) => {
        const contentType = response.headers.get('content-type');
        if (contentType && contentType.includes('application/json')) {
          return response.json();
        }
        throw new TypeError("Oops, we haven't got JSON!");
      }).then((data) => {
        featureArray = data.features;
        last = data.features.length - 1;
        this.setState({
          timeRangeEnd: featureArray[last].TimeUS,
          domain: featureArray[last].TimeUS,
        });
      })
      .catch(error => Bert.alert(`Coordinates Request Error: ${error}`, 'warning'));
  }

  changeVideoTime(a) {
    this.setState({
      videoTime: a,
    });
  }

  changeRange(a, b) {
    this.setState({
      timeRangeStart: a,
      timeRangeEnd: b,
    });
  }

  changeLogTime(a) {
    this.setState({
      logTime: a,
    });
  }

  changeSpeed(a) {
    this.setState({
      speed: a,
    });
  }

  syncTrue() {
    this.setState({
      timeGap: this.state.logTime - this.state.videoTime,
      synchrony: true,
    });
  }

  syncFalse() {
    this.setState({
      synchrony: false,
    });
  }

  renderMissionVideo() {
    return (
      <MissionVideo
        videoTime={this.state.videoTime}
        logTime={this.state.logTime}
        speed={this.state.speed}
        frequency={this.state.frequency}
        features={featureArray}
        syncTrue={this.syncTrue}
        syncFalse={this.syncFalse}
      />);
  }

  renderSlider() {
    return (
      <Slider
        end={this.state.timeRangeEnd}
        domain={this.state.domain}
        logTime={this.state.logTime}
        speed={this.state.speed}
        synchrony={this.state.synchrony}
        timeGap={this.state.timeGap}
        frequency={this.state.frequency}
        changeRange={this.changeRange}
        changeLogTime={this.changeLogTime}
        changeVideoTime={this.changeVideoTime}
      />);
  }

  renderZoom() {
    return (
      <Zoom
        start={this.state.timeRangeStart}
        end={this.state.timeRangeEnd}
        logTime={this.state.logTime}
        videoTime={this.state.videoTime}
        speed={this.state.speed}
        synchrony={this.state.synchrony}
        timeGap={this.state.timeGap}
        frequency={this.state.frequency}
        changeLogTime={this.changeLogTime}
        changeVideoTime={this.changeVideoTime}
      />);
  }

  renderTimeControl() {
    return (
      <div className="Dial" id="Dial">
        <TimeControlComponent
          changeSpeed={this.changeSpeed}
        />
      </div>
    );
  }

  render() {
    return (
      <div className="Hector" id="Hector">
        {this.renderMissionVideo()}
        {this.renderZoom()}
        {this.renderSlider()}
        {this.renderTimeControl()}
      </div>
    );
  }
}

export default Hector;
