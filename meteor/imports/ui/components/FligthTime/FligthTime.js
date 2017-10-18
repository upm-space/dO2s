import React, { Component } from 'react';
import Slider from './Slider';
import Zoom from './Zoom';

import './FligthTime.scss';

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
      />);
  }

  renderZoom() {
    return (
      <Zoom
        start={this.state.time0}
        end={this.state.time1}
        time={this.state.time2}
      />);
  }

  render() {
    return (
      <div className="Hector" id="Hector" style={{ width: '100%', height: '100%' }}>
        {this.renderZoom()}
        {this.renderSlider()}
      </div>
    );
  }
}

export default Hector;
