import React, { Component } from 'react';
import * as d3 from 'd3';

import './Zoom.scss';

const width = 50;
let handle;
let chart;
let x;
let axis;
// let startText;
// let endText;

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
    this.zoom(this.props.start, this.props.end, this.chartContainer.offsetWidth);
  }

  componentDidUpdate() {
    // startText.text(usToHHMMSS(this.props.start));
    // endText.text(usToHHMMSS(this.props.end));
    handle.attr('x', x(this.props.time));
    x.domain([this.props.start, this.props.end]);
    handle.opacity = this.props.time > x.domain()[0] && this.props.time < x.domain()[1] ? 1 : 0;
    chart.selectAll('.axis').remove();
    chart.append('g')
      .attr('class', 'axis')
      .attr('transform', `translate(${width}, 40)`)
      .call(axis)
      .selectAll('text')
      .style('text-anchor', 'start')
      .attr('transform', 'rotate(-30) translate(-10, -5)')
    ;
  }

  zoom(startTime, endTime, chartWidth) {
    // const axisWidth = chartWidth < 550 ? 550 : chartWidth;
    const axisWidth = chartWidth - 80;

    chart = d3.select('#chartContainer').append('svg')
      .attr('class', 'chart')
      .attr('width', chartWidth)
      .attr('height', '100%')
    ;

    chart.append('text')
      .attr('class', 'label')
      .attr('x', width - 10)
      .attr('text-anchor', 'end')
      .attr('transform', 'translate(0, 55)')
      .text('Video')
    ;

    chart.append('text')
      .attr('class', 'label')
      .attr('x', width - 10)
      .attr('text-anchor', 'end')
      .attr('transform', 'translate(0, 75)')
      .text('Log')
    ;

    // startText = chart.append('text')
    //   .attr('class', 'label')
    //   .attr('transform', `translate(${width}, 20)`)
    //   .text(usToHHMMSS(startTime))
    // ;
    //
    // endText = chart.append('text')
    //   .attr('class', 'label')
    //   .attr('text-anchor', 'end')
    //   .attr('transform', `translate(${width + axisWidth}, 20)`)
    //   .text(usToHHMMSS(endTime))
    // ;

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
      .attr('transform', `translate(${width}, 40)`)
      .call(axis)
      .selectAll('text')
      .style('text-anchor', 'start')
      .attr('transform', 'rotate(-30) translate(-10, -5)')
    ;

    const videoContainer = chart.append('g')
      .attr('class', 'plot-container')
      .attr('width', x.range()[1])
      .attr('height', 50)
      .attr('transform', `translate(${width}, 40)`)
      ;

    const logContainer = chart.append('g')
      .attr('class', 'plot-container')
      .attr('width', x.range()[1])
      .attr('height', 50)
      .attr('transform', `translate(${width}, 20)`)
      ;

    chart.append('line')
      .attr('class', 'line-separator')
      .attr('transform', `translate(${width}, 60)`)
      .attr('x1', x.range()[0])
      .attr('x2', x.range()[1])
    ;

    chart.append('line')
      .attr('class', 'line-separator')
      .attr('transform', `translate(${width}, 80)`)
      .attr('x1', x.range()[0])
      .attr('x2', x.range()[1])
    ;

    handle = chart.insert('rect')
      .attr('class', 'selector')
      .attr('transform', `translate(${width}, 40)`)
      .attr('x', x(this.props.time))
      .attr('width', 3)
      .attr('height', 40)
    ;
  }

  render() {
    return (
      <div className="chartContainer" id="chartContainer" ref={(c) => { this.chartContainer = c; }} />
    );
  }
}

export default Zoom;
