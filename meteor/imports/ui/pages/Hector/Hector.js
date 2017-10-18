import React, { Component } from 'react';
import MissionVideo from '../../components/MissionVideo/MissionVideo';
import Slider from '../../components/FligthTime/Slider';
import Zoom from '../../components/FligthTime/Zoom';

import './Hector.scss';

class Hector extends Component {
  constructor(props) {
    super(props);

    this.changeRange = this.changeRange.bind(this);
    this.changeTime = this.changeTime.bind(this);
    this.getLength = this.getLength.bind(this);

    this.state = {
      time0: 0,
      time1: 608399957,
      time2: 0,
      domain: 608399957,
      speed: 2,
    };
  }

  getLength(d) {
    this.setState({
      time1: d,
      domain: d,
    });
    this.forceUpdate();
  }

  changeRange(a, b) {
    this.setState({
      time0: a,
      time1: b,
    });
    this.forceUpdate();
  }

  changeTime(c) {
    this.setState({
      time2: c,
    });
    this.forceUpdate();
  }

  renderMissionVideo() {
    return (
      <MissionVideo
        time={this.state.time2}
        speed={this.state.speed}
        getLength={this.getLength}
      />);
  }

  renderSlider() {
    return (
      <Slider
        end={this.state.time1}
        domain={this.state.domain}
        speed={this.state.speed}
        changeRange={this.changeRange}
        changeTime={this.changeTime}
      />);
  }

  renderZoom() {
    return (
      <Zoom
        start={this.state.time0}
        end={this.state.time1}
        time={this.state.time2}
        speed={this.state.speed}
      />);
  }

  render() {
    return (
      <div className="Hector" id="Hector">
        {this.renderMissionVideo()}
        {this.renderZoom()}
        {this.renderSlider()}
        {/* {this.state.time0}<br />
        {this.state.time1}<br />
        {this.state.time2}<br /> */}
      </div>
    );
  }
}

export default Hector;
