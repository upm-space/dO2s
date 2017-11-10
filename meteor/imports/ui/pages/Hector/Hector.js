import React, { Component } from 'react';
import { Bert } from 'meteor/themeteorchef:bert';
import MissionVideo from '../../components/MissionVideo/MissionVideo';
import Slider from '../../components/FligthTime/Slider';
import Zoom from '../../components/FligthTime/Zoom';
import TimeControlComponent from '../../components/TimelineWidget/TimeControlComponent';

import './Hector.scss';

import FileTransferUi from '../../components/FileTransfer/FileTransferUi';

const Hector = FileTransferUi;

// const coordinateUrl = 'http://localhost:3000/images/logJson2.json';
// const frequency = 200;
// let featureArray;
// let last;
//
// class Hector extends Component {
//   constructor(props) {
//     super(props);
//
//     this.changeRange = this.changeRange.bind(this);
//     this.changeSpeed = this.changeSpeed.bind(this);
//     this.changeLogTime = this.changeLogTime.bind(this);
//     this.changeVideoTime = this.changeVideoTime.bind(this);
//     this.syncTrue = this.syncTrue.bind(this);
//     this.syncFalse = this.syncFalse.bind(this);
//
//     this.state = {
//       timeRangeStart: 0,
//       timeRangeEnd: 0,
//       logTime: 0,
//       videoTime: 0,
//       speed: 1,
//       domain: 60000000,
//       synchrony: false,
//       timeGap: 0,
//     };
//   }
//
//   componentWillMount() {
//     const a = this;
//     fetch(coordinateUrl)
//       .then((response) => {
//         const contentType = response.headers.get('content-type');
//         if (contentType && contentType.includes('application/json')) {
//           return response.json();
//         }
//         throw new TypeError("Oops, we haven't got JSON!");
//       }).then((data) => {
//         featureArray = data.features;
//         last = data.features.length - 1;
//         a.setState({
//           timeRangeEnd: featureArray[last].TimeUS,
//           domain: featureArray[last].TimeUS,
//         });
//         a.forceUpdate();
//       })
//       .catch(error => Bert.alert(`Coordinates Request Error: ${error}`, 'warning'))
//     ;
//   }
//
//   changeVideoTime(f) {
//     this.setState({
//       videoTime: f,
//     });
//     this.forceUpdate();
//   }
//
//   changeRange(a, b) {
//     this.setState({
//       timeRangeStart: a,
//       timeRangeEnd: b,
//     });
//     this.forceUpdate();
//   }
//
//   changeLogTime(c) {
//     this.setState({
//       logTime: c,
//     });
//     this.forceUpdate();
//   }
//
//   changeSpeed(e) {
//     this.setState({
//       speed: e,
//     });
//     this.forceUpdate();
//   }
//
//   syncTrue() {
//     this.setState({
//       timeGap: this.state.logTime - this.state.videoTime,
//       synchrony: true,
//     });
//     this.forceUpdate();
//   }
//
//   syncFalse() {
//     this.setState({
//       synchrony: false,
//     });
//     this.forceUpdate();
//   }
//
//   renderMissionVideo(freq) {
//     return (
//       <MissionVideo
//         videoTime={this.state.videoTime}
//         logTime={this.state.logTime}
//         speed={this.state.speed}
//         frequency={freq}
//         features={featureArray}
//         syncTrue={this.syncTrue}
//         syncFalse={this.syncFalse}
//       />);
//   }
//
//   renderSlider(freq) {
//     return (
//       <Slider
//         end={this.state.timeRangeEnd}
//         domain={this.state.domain}
//         logTime={this.state.logTime}
//         speed={this.state.speed}
//         synchrony={this.state.synchrony}
//         timeGap={this.state.timeGap}
//         frequency={freq}
//         features={featureArray}
//         changeRange={this.changeRange}
//         changeLogTime={this.changeLogTime}
//         changeVideoTime={this.changeVideoTime}
//       />);
//   }
//
//   renderZoom(freq) {
//     return (
//       <Zoom
//         start={this.state.timeRangeStart}
//         end={this.state.timeRangeEnd}
//         logTime={this.state.logTime}
//         videoTime={this.state.videoTime}
//         speed={this.state.speed}
//         synchrony={this.state.synchrony}
//         timeGap={this.state.timeGap}
//         frequency={freq}
//         features={featureArray}
//         changeLogTime={this.changeLogTime}
//         changeVideoTime={this.changeVideoTime}
//       />);
//   }
//
//   renderTimeControl() {
//     return (
//       <div className="Dial" id="Dial">
//         <TimeControlComponent
//           features={featureArray}
//           changeSpeed={this.changeSpeed}
//         />
//       </div>
//     );
//   }
//
//   render() {
//     return (
//       <div className="Hector" id="Hector">
//         {this.renderMissionVideo(frequency)}
//         {this.renderZoom(frequency)}
//         {this.renderSlider(frequency)}
//         {this.renderTimeControl()}
//       </div>
//     );
//   }
// }

export default Hector;
