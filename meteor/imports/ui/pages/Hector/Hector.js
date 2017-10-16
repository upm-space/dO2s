import React, { Component } from 'react';
import * as d3 from 'd3';
// import MissionVideo from '../../components/MissionVideo/MissionVideo';
import Slider from '../../components/Slider/Slider';
import Zoom from '../../components/Zoom/Zoom';

import './Hector.scss';

// const Hector = MissionVideo;
class Hector extends Component {
  constructor(props) {
    super(props);

    this.changeRange = this.changeRange.bind(this);
    this.changeTime = this.changeTime.bind(this);

    this.state = {
      time0: 0,
      time1: 608399957,
      time2: 0,
      domain: 608399957,
      width: 500,
    };
  }
  componentDidMount() {
    return 0;
  }

  changeRange(a, b) {
    this.setState({
      time0: a,
      time1: b,
    });
    this.forceUpdate();
  }

  changeTime(a) {
    this.setState({
      time2: a,
    });
  }

  renderSlider() {
    return (
      <Slider
        domain={this.state.domain}
        changeRange={this.changeRange}
        changeTime={this.changeTime}
        width={this.state.width}
      />);
  }

  renderZoom() {
    return (
      <Zoom
        start={this.state.time0}
        end={this.state.time1}
        time={this.state.time2}
        width={this.state.width}
      />);
  }

  render() {
    return (
      <div className="Hector" id="Hector" style={{ width: '100%', height: '100%' }}>
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
