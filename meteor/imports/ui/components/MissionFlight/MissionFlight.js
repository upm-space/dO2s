import React from 'react';
import PropTypes from 'prop-types';
import WidgetAirSpeed from '../FlightWidgets/WidjetAirSpeed.js';
import WidgetAltimeter from '../FlightWidgets/WidjetAltimeter.js';
import WidgetAttitude from '../FlightWidgets/WidjetAttitude.js';
import SvgMilestones from '../SvgMilestones/SvgMilestones.js';

class MissionFlight extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      speed: 10,
    };
  }

  render() {
    return (<div>
      <h1>MissionFlight1</h1>
      <p>{JSON.stringify(this.props.mission)}</p>
      <input
        type="number"
        name="speed"
        value={this.state.speed}
        ref={speed => (this.speed = speed)}
        onChange={() => this.setState({ speed: Number(this.speed.value) })}
      />
      <WidgetAirSpeed instSize="400" id="wAirSpeed" speedProp={this.state.speed} />
      <WidgetAltimeter instSize="400" id="wAltimeter" altitudeProp={this.state.speed} />
      <WidgetAttitude instSize="400" id="wAltimeter" pitchProp={this.state.speed} rollProp={this.state.speed} />
      <SvgMilestones elements={['element1', 'el2', 'element3']} index={1} />
      <input type="button" value="set speed" />
    </div>);
  }
}


MissionFlight.propTypes = {
  mission: PropTypes.object.isRequired,
};

export default MissionFlight;
