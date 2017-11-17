import React, { Component } from 'react';
import PropTypes from 'prop-types';

const xCenter = 400;
const yCenter = 350;
const speedArray = [0.001, 0.002, 0.005, 0.01, 0.015, 0.02, 0.025, (1 / 30).toFixed(3), 0.05,
  (1 / 15).toFixed(3), 0.075, 0.09, 0.1, 0.125, (1 / 6).toFixed(3), 0.25, (1 / 3).toFixed(2),
  0.5, (2 / 3).toFixed(2), 0.8, 1, 1.25, 1.5, 2, 3, 4, 6, 8, 10, 12, 15, 18, 20, 24, 36, 50,
  75, 100, 200, 500, 1000];
let i = 20;
let currentSpeed = speedArray[i];
let indicator = null;
let rot = 0;

class TimeControlComponent extends Component {
  constructor(props) {
    super(props);
    this.drawRect = this.drawRect.bind(this);
    this.drawTriangle = this.drawTriangle.bind(this);
    this.incrementCurrentSpeed = this.incrementCurrentSpeed.bind(this);
    this.reduceCurrentSpeed = this.reduceCurrentSpeed.bind(this);
    this.stop = this.stop.bind(this);
    this.rotateIndicator = this.rotateIndicator.bind(this);
    this.state = {
      rotation: 0,
      textFirstLine: '1x',
      textSecondLine: 'Oct 18 2017',
      textThridLine: '13:28:01 UTC',
    };
  }
  defGradients() {
    return (
      <defs>
        <linearGradient id="lgrad1" x1="0%" y1="0%" x2="0%" y2="200%">
          <stop offset="0%" style={{ stopColor: '#4F6228', stopOpacity: 0.5 }} />
          <stop offset="100%" style={{ stopColor: '#C4D79B', stopOpacity: 1 }} />
        </linearGradient>
        <linearGradient id="lgrad2" x1="0%" y1="0%" x2="75%" y2="0%">
          <stop offset="0%" style={{ stopColor: '#C4D79B', stopOpacity: 1 }} />
          <stop offset="100%" style={{ stopColor: '#4F6228', stopOpacity: 1 }} />
        </linearGradient>
        <radialGradient id="rgrad1" cx="75%" cy="75%" r="90%" fx="80%" fy="80%">
          <stop offset="0%" style={{ stopColor: '#C4D79B', stopOpacity: 1 }} />
          <stop offset="100%" style={{ stopColor: '#4F6228', stopOpacity: 1 }} />
        </radialGradient>
        <radialGradient id="rgrad2" cx="25%" cy="25%" r="90%" fx="20%" fy="20%">
          <stop offset="0%" style={{ stopColor: '#C4D79B', stopOpacity: 1 }} />
          <stop offset="100%" style={{ stopColor: '#4F6228', stopOpacity: 1 }} />
        </radialGradient>
      </defs>);
  }
  drawEllipses(rx, ry, fill, stroke, strokeWidth, callback) {
    const ellipseStyle = {
      fill,
      stroke,
      strokeWidth,
    };
    return (
      <ellipse
        cx={xCenter}
        cy={yCenter}
        rx={rx}
        ry={ry}
        style={ellipseStyle}
        onMouseDown={event => callback(event)}
      />);
  }

  drawIndicator(xy1, xy2, xy3, fill, stroke, strokeWidth, callback) {
    const triangleStyle = {
      fill,
      stroke,
      strokeWidth,
      transformOrigin: 'bottom',
      transform: `translate(0, 0) rotate(${this.state.rotation}deg)`,
    };
    const points = `${xy1[0]},${xy1[1]} ${xy2[0]},${xy2[1]} ${xy3[0]},${xy3[1]}`;
    return (
      <polygon points={points} style={triangleStyle} onMouseDown={event => callback(event)} />);
  }
  drawTriangle(xy1, xy2, xy3, fill, stroke, strokeWidth, callback) {
    const triangleStyle = {
      fill,
      stroke,
      strokeWidth,
    };
    const points = `${xy1[0]},${xy1[1]} ${xy2[0]},${xy2[1]} ${xy3[0]},${xy3[1]}`;
    return (<polygon points={points} style={triangleStyle} onClick={() => callback(this)} />);
  }
  drawRect(x, y, width, height, fill, stroke, strokeWidth, rounded, callback) {
    const recStyle = {
      fill,
      stroke,
      strokeWidth,
    };
    return (
      <rect
        x={x}
        y={y}
        rx={rounded}
        ry={rounded}
        width={width}
        height={height}
        style={recStyle}
        onClick={() => callback(this)}
      />);
  }
  drawText(id, x, y, text) {
    const svgText = (
      <text
        key={id}
        x={x}
        y={y}
        fontSize="44"
        fontFamily="Arial"
        color="white"
        textAnchor="middle"
        alignmentBaseline="middle"
      >
        {text}
      </text>
    );
    return svgText;
  }
  incrementCurrentSpeed(parent) {
    if (currentSpeed === 0) {
      i = 20;
      currentSpeed = speedArray[i];
    } else if (i < 40) {
      i = parseFloat(i) + 1;
      currentSpeed = speedArray[i];
      rot = parent.state.rotation > 100 ? parent.state.rotation : parent.state.rotation + 5;
    }
    parent.setState({ rotation: rot, textFirstLine: `${currentSpeed}x` });
    this.props.changeSpeed(currentSpeed);
  }
  reduceCurrentSpeed(parent) {
    if (currentSpeed === 0) {
      i = 20;
      currentSpeed = speedArray[i];
    } else if (i > 0) {
      i -= 1;
      currentSpeed = speedArray[i];
      rot = parent.state.rotation < -100 ? parent.state.rotation : parent.state.rotation - 5;
    }
    parent.setState({ rotation: rot, textFirstLine: `${currentSpeed}x` });
    this.props.changeSpeed(currentSpeed);
  }
  stop(parent) {
    rot = 0;
    currentSpeed = 0;
    parent.setState({ rotation: rot, textFirstLine: `${currentSpeed}x` });
    this.props.changeSpeed(currentSpeed);
  }
  rotateIndicator(e) {
    let coordinates = [0, 100];
    coordinates = [e.pageX - 115, window.innerHeight - 23.5 - e.pageY];
    const alpha = Math.atan2(coordinates[0], coordinates[1]);
    rot = Math.max(-100, Math.min(100, Math.round((alpha * 180) / Math.PI / 5) * 5));
    i = (0.2 * (rot + 100)).toFixed(0);
    currentSpeed = speedArray[i];
    this.setState({ rotation: rot, textFirstLine: `${currentSpeed}x` });
    this.props.changeSpeed(currentSpeed);
  }
  paint() {
    const svgStyle = {
      height: this.props.height,
      width: this.props.width,
    };
    const svgElements = [];
    svgElements.push(this.defGradients());
    svgElements.push(this.drawEllipses(350, 350, 'white', '#bbbbbb', 2, event => this.rotateIndicator(event)));
    svgElements.push(this.drawEllipses(320, 320, 'url(#lgrad1)', 'white', 0, event => this.rotateIndicator(event)));
    svgElements.push(this.drawEllipses(290, 320, 'white', 'white', 0, event => this.rotateIndicator(event)));
    svgElements.push(this.drawEllipses(250, 250, 'url(#rgrad2)', 'white', 1, () => {}));
    indicator = this.drawIndicator([xCenter - 150, yCenter], [xCenter, yCenter - 350], [xCenter + 150, yCenter], 'url(#lgrad2)', 'white', 1, event => this.rotateIndicator(event));
    svgElements.push(indicator);
    svgElements.push(this.drawEllipses(210, 210, 'url(#rgrad1)', 'white', 1, () => {}));
    svgElements.push(this.drawEllipses(210, 210, 'url(#rgrad1)', 'white', 1, () => {}));
    const btnSize = 100;
    const btnDist = 20;
    const btnXinit1 = btnSize + (btnSize / 2) + btnDist;
    const btnXinit2 = (btnSize / 2);
    const btnXinit3 = (btnSize / 2) + btnDist;
    const btnYinit = 10;
    svgElements.push(this.drawRect(xCenter - btnXinit1, yCenter - btnYinit, btnSize, btnSize, '#205020', 'white', 1, 10, this.reduceCurrentSpeed));
    svgElements.push(this.drawRect(xCenter - btnXinit2, yCenter - btnYinit, btnSize, btnSize, '#205020', 'white', 1, 10, this.stop));
    svgElements.push(this.drawRect(xCenter + btnXinit3, yCenter - btnYinit, btnSize, btnSize, '#205020', 'white', 1, 10, this.incrementCurrentSpeed));
    svgElements.push(this.drawText('tx1', xCenter, yCenter - 150, this.state.textFirstLine));
    svgElements.push(this.drawText('tx2', xCenter, yCenter - 100, this.state.textSecondLine));
    svgElements.push(this.drawText('tx3', xCenter, yCenter - 50, this.state.textThridLine));

    svgElements.push(this.drawTriangle(
      [xCenter + (-btnXinit1) + (btnSize / 3), yCenter + (-btnYinit) + (btnSize / 2)],
      [xCenter + (-btnXinit1) + ((btnSize / 3) * 2), yCenter + (-btnYinit) + ((btnSize / 3) * 2)],
      [xCenter + (-btnXinit1) + ((btnSize / 3) * 2), yCenter + (-btnYinit) + ((btnSize / 3))],
      'white', 'white', 1,
      this.reduceCurrentSpeed,
    ));

    svgElements.push(this.drawTriangle(
      [xCenter + btnXinit3 + ((btnSize / 3) * 2), yCenter + (-btnYinit) + (btnSize / 2)],
      [xCenter + btnXinit3 + ((btnSize / 3)), yCenter + (-btnYinit) + ((btnSize / 3) * 2)],
      [xCenter + btnXinit3 + ((btnSize / 3)), yCenter + (-btnYinit) + (btnSize / 3)],
      'white', 'white', 1,
      this.incrementCurrentSpeed,
    ));

    svgElements.push(this.drawRect(
      xCenter + (-btnXinit2) + (btnSize / 3),
      yCenter + (-btnYinit) + (btnSize / 3),
      btnSize / 9,
      btnSize / 3,
      'white', 'white', 1, 0,
      this.stop,
    ));
    svgElements.push(this.drawRect(
      xCenter + (-btnXinit2) + ((btnSize / 3) + ((btnSize / 9) * 2)),
      yCenter + (-btnYinit) + (btnSize / 3),
      btnSize / 9,
      btnSize / 3,
      'white', 'white', 1, 0,
      this.stop,
    ));

    // viewBox  x,y, width, height
    return (
      <svg className="SvgContainer" style={svgStyle} viewBox="0 0 800 300">
        {svgElements}
      </svg>);
  }
  render() {
    return this.paint();
  }
}

TimeControlComponent.defaultProps = {
  height: 150,
  width: 200,
};
TimeControlComponent.propTypes = {
  height: PropTypes.number,
  width: PropTypes.number,
  changeSpeed: PropTypes.func.isRequired,
};

export default TimeControlComponent;
