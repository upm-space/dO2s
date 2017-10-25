import React, { Component } from 'react';
import PropTypes from 'prop-types';


class SvgMilestones extends Component {
  paintCircle(id, x, y, r, fill, callback) {
    const circleStyle = {
      fill,
    };
    const circle = <circle key={id} cx={x} cy={y} r={r} style={circleStyle} onClick={x => callback()} />;
    return circle;
  }

  paintText(id, fontSize, x, y, text, leftSide) {
    let axisV = 0;
    let textAnchor = 'middle';
    let alignmentBaseline = 'middle';
    if (this.props.rightSide) {
      axisV = leftSide + 10;
      textAnchor = 'left';
      alignmentBaseline = 'left';
    }
    const svgText = (
      <text
        key={id}
        x={axisV}
        y={y}
        fontSize={fontSize}
        fontFamily="Arial"
        textAnchor={textAnchor}
        alignmentBaseline={alignmentBaseline}
      >
        {text}
      </text>);
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
      const backColor = item.checked ? this.props.cChecked : this.props.cUnchecked;
      const borderColor = item.selected ? this.props.cSelected : this.props.cBorder;
      const x = centroidsDis / 2;
      const y = (centroidsDis / 2) + (centroidsDis * counter);
      const innerRadius = Math.round((centroidsDis / 2) * this.props.radioRatio);
      svgCricle.push(this.paintCircle(`idICircA${counter.toString()}`, x, y, (innerRadius + lineWidth), borderColor, item.callback));
      svgCricle.push(this.paintCircle(`idICircB${counter.toString()}`, x, y, innerRadius, backColor, item.callback));
      svgCricle.push(this.paintText(`idIText${counter.toString()}`, 15, x, y, item.text, (x + innerRadius + lineWidth)));
      counter += 1;
    });

    const svgStyle = {
      height: this.props.height,
      width: this.props.width,
    };
    return (
      <svg className="SvgContainer" style={svgStyle}>
        {lineSvg} + {svgCricle}
      </svg>);
  }
  render() {
    return this.paint();
  }
}

SvgMilestones.defaultProps = {
  cChecked: '#5cb85c',
  cWarning: '#f0ad4e',
  cUnchecked: '#d9534f',
  cBorder: '#eee',
  cSelected: '#337ab7',
  lineWidthRatio: 0.02, // keep relation with radioRatio
  radioRatio: 0.2, // if = 1 circles will touch between them
  height: 600,
  width: 200,
  rightSide: true,
};
SvgMilestones.propTypes = {
  cChecked: PropTypes.string,
  cWarning: PropTypes.string,
  cUnchecked: PropTypes.string,
  cBorder: PropTypes.string,
  cSelected: PropTypes.string,
  lineWidthRatio: PropTypes.number,
  // divIdContainer: PropTypes.number,
  radioRatio: PropTypes.number,
  height: PropTypes.number,
  width: PropTypes.number,
  elements: PropTypes.array.isRequired,
  rightSide: PropTypes.bool,
};

export default SvgMilestones;
