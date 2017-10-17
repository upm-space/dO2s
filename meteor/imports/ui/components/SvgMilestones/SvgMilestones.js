import React, { Component } from 'react';
import { Meteor } from 'meteor/meteor';
import PropTypes from 'prop-types';


class SvgMilestones extends Component {
  constructor(props) {
    super(props);
  }

  paintCircle(id, x, y, r, fill) {
    const circleStyle = {
      fill,
    };
    const circle = <circle key={id} cx={x} cy={y} r={r} style={circleStyle} />;
    return circle;
  }

  paintText(id, fontSize, x, y, text, leftSide) {
    let textAnchor = 'middle';
    let alignmentBaseline = 'middle';
    if (this.props.rightSide) {
      x = leftSide + 10;
      textAnchor = 'left';
      alignmentBaseline = 'left';
    }
    const svgText = (<text
      key={id}
      x={x}
      y={y}
      fontSize={fontSize}
      fontFamily="Arial"
      textAnchor={textAnchor}
      alignmentBaseline={alignmentBaseline}
    >
      {text}</text>);
    return svgText;
  }

  paintLine(p1, p2, width) {
    const lineStyle = {
      stroke: this.props.cBorder,
      strokeWidth: `${width}px`,
    };
    return <line x1={p1[0]} y1={p1[1]} x2={p2[0]} y2={p2[1]} style={lineStyle} />;
  }
  paint() {
    const numberOfCircles = this.props.elements.length;
    const centroidsDis = Math.round(this.props.height / numberOfCircles);
    const lineP1XY = [centroidsDis / 2, centroidsDis / 2];
    const lineP2XY = [centroidsDis / 2, ((centroidsDis * numberOfCircles) -
      (centroidsDis * this.props.radioRatio))];
    const lineWidth = Math.round(centroidsDis * this.props.lineWidthRatio);
    const lineSvg = this.paintLine(lineP1XY, lineP2XY, lineWidth);

    let counter = 0;
    const svgCricle = [];
    this.props.elements.forEach((item) => {
      let backColor = '';
      counter === this.props.index ? backColor = this.props.cEnable : backColor = this.props.cDisable;
      const x = centroidsDis / 2;
      const y = (centroidsDis / 2) + (centroidsDis * counter);
      const innerRadius = Math.round((centroidsDis / 2) * this.props.radioRatio);
      svgCricle.push(this.paintCircle(`idICircA${counter.toString()}`, x, y, (innerRadius + lineWidth), this.props.cBorder));
      svgCricle.push(this.paintCircle(`idICircB${counter.toString()}`, x, y, innerRadius, backColor));
      svgCricle.push(this.paintText(`idIText${counter.toString()}`, 15, x, y, item, (x + innerRadius + lineWidth)));
      counter += 1;
    });

    const svgStyle = {
      height: this.props.height,
      width: this.props.width,
    };
    return (<svg className="SvgContainer" style={svgStyle}>
      {lineSvg} + {svgCricle}
    </svg>);
  }
  render() {
    return this.paint();
  }
}

SvgMilestones.defaultProps = {
  cEnable: '#009900',
  cDisable: '#D9ffB3',
  cBorder: '#F2FFE6',
  lineWidthRatio: 0.03, // keep relation with radioRatio
  radioRatio: 0.5, // if = 1 circles will touch between them
  height: 500,
  width: 200,
  rightSide: true,
};
SvgMilestones.PropTypes = {
  divIdContainer: PropTypes.number,
  height: PropTypes.number,
  width: PropTypes.string,
  elements: PropTypes.array.isRequired,
  index: PropTypes.number.isRquired,
};

export default SvgMilestones;
