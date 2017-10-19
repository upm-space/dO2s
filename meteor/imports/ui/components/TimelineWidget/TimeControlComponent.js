import React, { Component } from 'react';
import { Meteor } from 'meteor/meteor';
import PropTypes from 'prop-types';

const xCenter = 400;
const yCenter = 700;
const currentSpeed = 0;
let indicator = null;
let progressText = null;

class TimeControlComponent extends Component {
  constructor() {
    super();
    this.state = {
      color: '#0000FF',
      xTranslation: 0,
      yTranslation: 0,
      rotation: 0,
      textFirstLine: '0x',
      textSecondLine: 'Oct 18 2017',
      textThridLine: '13:28:01 UTC',
    };
  }
  defGradients() {
    return (<defs>
      <linearGradient id="lgrad1" x1="0%" y1="0%" x2="0%" y2="200%">
        <stop offset="0%" style={{ stopColor: '#202050', stopOpacity: 0.5 }} />
        <stop offset="100%" style={{ stopColor: '#9090FF', stopOpacity: 1 }} />
      </linearGradient>
      <linearGradient id="lgrad2" x1="0%" y1="0%" x2="75%" y2="0%">
        <stop offset="0%" style={{ stopColor: '#9090FF', stopOpacity: 1 }} />
        <stop offset="100%" style={{ stopColor: '#0000FF', stopOpacity: 1 }} />
      </linearGradient>
      <radialGradient id="rgrad1" cx="75%" cy="75%" r="90%" fx="80%" fy="80%">
        <stop offset="0%" style={{ stopColor: '#9090FF', stopOpacity: 1 }} />
        <stop offset="100%" style={{ stopColor: '#0000FF', stopOpacity: 1 }} />
      </radialGradient>
      <radialGradient id="rgrad2" cx="25%" cy="25%" r="90%" fx="20%" fy="20%">
        <stop offset="0%" style={{ stopColor: '#9090FF', stopOpacity: 1 }} />
        <stop offset="100%" style={{ stopColor: '#0000FF', stopOpacity: 1 }} />
      </radialGradient>


    </defs>);
  }
  drawEllipses(rx, ry, fill, stroke, strokeWidth) {
    const ellipseStyle = {
      fill,
      stroke,
      strokeWidth,
    };
    return (<ellipse
      cx={xCenter}
      cy={yCenter}
      rx={rx}
      ry={ry}
      style={ellipseStyle}
    />);
  }

  drawIndicator(xy1, xy2, xy3, fill, stroke, strokeWidth) {
    const triangleStyle = {
      fill,
      stroke,
      strokeWidth,
      transformOrigin: 'bottom',
      transform: `translate(${this.state.xTranslation}px, ${this.state.yTranslation}px) rotate(${this.state.rotation}deg)`,
    };
    const points = `${xy1[0]},${xy1[1]} ${xy2[0]},${xy2[1]} ${xy3[0]},${xy3[1]}`;
    return (<polygon points={points} style={triangleStyle} />);
  }
  drawTriangle(xy1, xy2, xy3, fill, stroke, strokeWidth) {
    const triangleStyle = {
      fill,
      stroke,
      strokeWidth,
    };
    const points = `${xy1[0]},${xy1[1]} ${xy2[0]},${xy2[1]} ${xy3[0]},${xy3[1]}`;
    return (<polygon points={points} style={triangleStyle} />);
  }
  drawRect(x, y, width, height, fill, stroke, strokeWidth, rounded, callback) {
    const recStyle = {
      fill,
      stroke,
      strokeWidth,
    };
    const parent = this;
    return (<rect x={x} y={y} rx={rounded} ry={rounded} width={width} height={height} style={recStyle} onClick={() => callback(parent)} />);
  }
  drawText(id, x, y, text) {
    const textAnchor = 'middle';
    const alignmentBaseline = 'middle';

    const svgText = (<text
      key={id}
      x={x}
      y={y}
      fontSize="44"
      fontFamily="Arial"
      textAnchor="middle"
      alignmentBaseline="middle"
    >
      {text}</text>);
    return svgText;
  }
  incrementCurrentSpeed(parent) {
    // console.log('Hola Mundo');
    // indicator.style.transform = 'rotate(45deg)';
    // indicator.props.style.fill = '#FF0000';
    // progressText.x = 20;
    const rot = parent.state.rotation + 5;
    parent.setState({ rotation: rot, textThridLine: rot });
  }
  paint() {
    const svgStyle = {
      height: this.props.height,
      width: this.props.width,
      backgroundColor: 'black',
    };
    const svgElements = [];
    svgElements.push(this.defGradients());
    svgElements.push(this.drawEllipses(350, 350, 'black', '#505050', 2));
    svgElements.push(this.drawEllipses(320, 320, 'url(#lgrad1)', 'white', 0));
    svgElements.push(this.drawEllipses(290, 320, 'black', 'white', 0));
    svgElements.push(this.drawEllipses(250, 250, 'url(#rgrad2)', 'white', 1));
    indicator = this.drawIndicator([xCenter - 150, yCenter], [xCenter, yCenter - 350], [xCenter + 150, yCenter], 'url(#lgrad2)', 'white', 1);
    svgElements.push(indicator);
    svgElements.push(this.drawEllipses(210, 210, 'url(#rgrad1)', 'white', 1));
    svgElements.push(this.drawEllipses(210, 210, 'url(#rgrad1)', 'white', 1));
    const btnSize = 100;
    const btnDist = 20;
    const btnXinit1 = btnSize + (btnSize / 2) + btnDist;
    const btnXinit2 = (btnSize / 2);
    const btnXinit3 = (btnSize / 2) + btnDist;
    const btnYinit = 10;
    svgElements.push(this.drawRect(xCenter - btnXinit1, yCenter - btnYinit, btnSize, btnSize, '#0000FF', 'white', 1, 10, this.incrementCurrentSpeed));
    svgElements.push(this.drawRect(xCenter - btnXinit2, yCenter - btnYinit, btnSize, btnSize, '#0000FF', 'white', 1, 10, () => {}));
    svgElements.push(this.drawRect(xCenter + btnXinit3, yCenter - btnYinit, btnSize, btnSize, '#0000FF', 'white', 1, 10, () => {}));
    progressText = this.drawText('tx1', xCenter, yCenter - 150, this.state.textFirstLine);
    svgElements.push(progressText);
    svgElements.push(this.drawText('tx2', xCenter, yCenter - 100, this.state.textSecondLine));
    svgElements.push(this.drawText('tx3', xCenter, yCenter - 50, this.state.textThridLine));

    svgElements.push(this.drawTriangle([xCenter - btnXinit1 + (btnSize / 3), yCenter - btnYinit + (btnSize / 2)],
      [xCenter - btnXinit1 + ((btnSize / 3) * 2), yCenter - btnYinit + ((btnSize / 3) * 2)],
      [xCenter - btnXinit1 + ((btnSize / 3) * 2), yCenter - btnYinit + ((btnSize / 3))], 'white', 'white', 1));

    svgElements.push(this.drawTriangle([xCenter + btnXinit3 + ((btnSize / 3) * 2), yCenter - btnYinit + (btnSize / 2)],
      [xCenter + btnXinit3 + ((btnSize / 3)), yCenter - btnYinit + ((btnSize / 3) * 2)],
      [xCenter + btnXinit3 + ((btnSize / 3)), yCenter - btnYinit + (btnSize / 3)], 'white', 'white', 1));

    svgElements.push(this.drawRect(xCenter - btnXinit2 + (btnSize / 3), yCenter - btnYinit + (btnSize / 3), btnSize / 9, btnSize / 3, 'white', 'white', 1, 0, () => {}));
    svgElements.push(this.drawRect(xCenter - btnXinit2 + ((btnSize / 3) + ((btnSize / 9) * 2)), yCenter - btnYinit + (btnSize / 3), btnSize / 9, btnSize / 3, 'white', 'white', 1, 0, () => {}));


    // viewBox  x,y, width, height
    return <svg className="SvgContainer" style={svgStyle} viewBox="0 0 800 800">{svgElements}</svg>;
  }
  render() {
    return this.paint();
  }
}

TimeControlComponent.defaultProps = {
  height: 1000,
  width: 1000,
};
TimeControlComponent.PropTypes = {
  height: PropTypes.number,
  width: PropTypes.string,
};

export default TimeControlComponent;
