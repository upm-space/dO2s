import React, { Component } from 'react';
import * as d3 from 'd3';

import './Zoom.scss';

let handle;
let chart;
let x;
let axis;
let startText;
let endText;

const usToHHMMSS = (time) => {
  const usSecNum = parseInt(time, 10) / 1e6;
  let hours = Math.floor(usSecNum / 3600);
  let minutes = Math.floor((usSecNum - (hours * 3600)) / 60);
  let seconds = Math.floor(usSecNum - (hours * 3600) - (minutes * 60));
  if (hours < 10) { hours = `0${hours}`; }
  if (minutes < 10) { minutes = `0${minutes}`; }
  if (seconds < 10) { seconds = `0${seconds}`; }
  return `${hours}:${minutes}:${seconds}`;
};

class Zoom extends Component {
  componentDidMount() {
    this.zoom(this.props.start, this.props.end, this.props.width);
  }

  componentDidUpdate() {
    startText.text(usToHHMMSS(this.props.start));
    endText.text(usToHHMMSS(this.props.end));
    handle.attr('x', x(this.props.time));
    x.domain([this.props.start, this.props.end]);
    handle.opacity = this.props.time > x.domain()[0] && this.props.time < x.domain()[1] ? 1 : 0;
    chart.selectAll('.axis').remove();
    chart.append('g')
      .attr('class', 'axis')
      .attr('transform', 'translate(60, 55)')
      .call(axis)
      .selectAll('text')
      .style('text-anchor', 'start')
      .attr('transform', 'rotate(-45)')
    ;
  }

  zoom(startTime, endTime, chartWidth) {
    const axisWidth = chartWidth < 550 ? 550 : chartWidth;

    chart = d3.select('#chartContainer').append('svg')
      .attr('class', 'chart')
      .attr('width', axisWidth + 100)
      .attr('height', '100%')
    ;

    chart.append('text')
      .attr('class', 'label')
      .attr('x', 50)
      .attr('text-anchor', 'end')
      .attr('transform', 'translate(0, 80)')
      .text('Video')
    ;

    chart.append('text')
      .attr('class', 'label')
      .attr('x', 50)
      .attr('text-anchor', 'end')
      .attr('transform', 'translate(0, 120)')
      .text('Log')
    ;

    startText = chart.append('text')
      .attr('class', 'label')
      .attr('transform', 'translate(60, 25)')
      .text(usToHHMMSS(startTime))
    ;

    endText = chart.append('text')
      .attr('class', 'label')
      .attr('text-anchor', 'end')
      .attr('transform', `translate(${60 + axisWidth}, 25)`)
      .text(usToHHMMSS(endTime))
    ;

    x = d3.scaleLinear()
      .domain([startTime, endTime])
      .range([0, axisWidth])
      .clamp(true)
    ;

    axis = d3.axisTop(x)
      .ticks(10)
      .tickFormat(d => usToHHMMSS(d))
    ;


    chart.append('g')
      .attr('class', 'axis')
      .attr('transform', 'translate(60, 55)')
      .call(axis)
      .selectAll('text')
      .style('text-anchor', 'start')
      .attr('transform', 'rotate(-45)')
    ;

    const videoContainer = chart.append('g')
      .attr('class', 'plot-container')
      .attr('width', x.range()[1])
      .attr('height', 50)
      .attr('transform', 'translate(60, 55)')
      ;

    const logContainer = chart.append('g')
      .attr('class', 'plot-container')
      .attr('width', x.range()[1])
      .attr('height', 50)
      .attr('transform', 'translate(60, 95)')
      ;

    chart.append('line')
      .attr('class', 'line-separator')
      .attr('transform', 'translate(60, 95)')
      .attr('x1', x.range()[0])
      .attr('x2', x.range()[1])
    ;

    chart.append('line')
      .attr('class', 'line-separator')
      .attr('transform', 'translate(60, 135)')
      .attr('x1', x.range()[0])
      .attr('x2', x.range()[1])
    ;

    handle = chart.insert('rect')
      .attr('class', 'selector')
      .attr('transform', 'translate(60, 55)')
      .attr('x', x(this.props.time))
      .attr('width', 3)
      .attr('height', 80)
    ;
  }

  render() {
    return (
      <div className="chartContainer" id="chartContainer" style={{ width: '100%', height: '150px' }} />
    );
  }
}

export default Zoom;
