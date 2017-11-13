import React, { Component } from 'react';
import PropTypes from 'prop-types';
import * as d3 from 'd3';

import './Zoom.scss';

const width = 50;
let handleRed;
let handleGreen;
let chart;
let x;
let i = 0;
let n = 0;
let axis;
let chartAxis;

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
    if (this.props.synchrony) {
      i = this.props.videoTime;
    }
    handleRed.attr('x', x(this.props.logTime) - 1.5);
    n = parseFloat(this.props.logTime);
    x.domain([this.props.start, this.props.end]);
    chart.selectAll('.axis').remove();
    chartAxis.append('g')
      .attr('class', 'axis')
      .attr('transform', 'translate(0, 40)')
      .call(axis)
      .selectAll('text')
      .style('text-anchor', 'start')
      .attr('transform', 'rotate(-30) translate(-10, -5)');
  }

  zoom(startTime, endTime, chartWidth) {
    const axisWidth = chartWidth - 70;
    const f = this.props.frequency;

    chart = d3.select('#chartContainer').append('svg')
      .attr('class', 'ZoomChart')
      .attr('width', chartWidth)
      .attr('height', '100%');
    chart.append('text')
      .attr('class', 'chart-label')
      .attr('x', width - 10)
      .attr('text-anchor', 'end')
      .attr('transform', 'translate(0, 55)')
      .text('Video');
    chart.append('text')
      .attr('class', 'chart-label')
      .attr('x', width - 10)
      .attr('text-anchor', 'end')
      .attr('transform', 'translate(0, 75)')
      .text('Log');
    x = d3.scaleLinear()
      .domain([startTime, endTime])
      .range([0, axisWidth])
      .clamp(true);
    axis = d3.axisTop(x)
      .ticks(10)
      .tickFormat(d => usToHHMMSS(d));
    const drag = d3.drag()
      .on('start.interrupt', () => { chartAxis.interrupt(); })
      .on('start drag', () => {
        handleGreen.attr('x', x(x.invert(d3.event.x)) - 1.5);
        i = x.invert(handleGreen.attr('x'));
        this.props.changeVideoTime(i);
        if (this.props.synchrony) {
          handleRed.attr('x', x(x.invert(d3.event.x) + this.props.timeGap) - 1.5);
          this.props.changeLogTime(i + this.props.timeGap);
        }
      });
    chartAxis = chart.append('g')
      .attr('class', 'plot-container')
      .attr('width', x.range()[1])
      .attr('height', 85)
      .attr('transform', `translate(${width}, 0)`);
    chartAxis.append('g')
      .attr('class', 'axis')
      .attr('transform', 'translate(0, 40)')
      .call(axis)
      .selectAll('text')
      .style('text-anchor', 'start')
      .attr('transform', 'rotate(-30) translate(-10, -5)');
    chartAxis.append('line')
      .attr('class', 'line-separator')
      .attr('transform', 'translate(0, 60)')
      .attr('x1', x.range()[0])
      .attr('x2', x.range()[1]);
    chartAxis.append('line')
      .attr('class', 'line-separator')
      .attr('transform', 'translate(0, 80)')
      .attr('x1', x.range()[0])
      .attr('x2', x.range()[1]);
    handleRed = chartAxis.insert('rect')
      .attr('class', 'ZoomRedSelector')
      .attr('transform', 'translate(0, 40)')
      .attr('x', x(this.props.logTime) - 1.5)
      .attr('width', 3)
      .attr('height', 40);
    chartAxis.append('circle')
      .attr('class', 'circle-red')
      .attr('cx', x(this.props.logTime))
      .attr('cy', 30)
      .attr('r', 3)
      .attr('transform', 'translate(0, 40)');
    handleGreen = chartAxis.insert('rect')
      .attr('class', 'ZoomGreenSelector')
      .attr('transform', 'translate(0, 40)')
      .attr('x', x(this.props.logTime) - 1.5)
      .attr('width', 3)
      .attr('height', 40)
      .call(drag);
    chartAxis.append('circle')
      .attr('class', 'circle-green')
      .attr('cx', x(this.props.logTime))
      .attr('cy', 10)
      .attr('r', 3)
      .attr('transform', 'translate(0, 40)');
    setInterval(() => {
      i += f * 1000 * this.props.speed;
      n += f * 1000 * this.props.speed;
      handleGreen.attr('x', x(i) - 1.5);
      handleRed.attr('x', x(n) - 1.5);
      this.props.changeVideoTime(i);
    }, f);
  }

  render() {
    return (
      <div
        className="chartContainer"
        id="chartContainer"
        ref={(c) => { this.chartContainer = c; }}
      />
    );
  }
}

Zoom.propTypes = {
  start: PropTypes.number.isRequired,
  end: PropTypes.number.isRequired,
  logTime: PropTypes.number.isRequired,
  videoTime: PropTypes.number.isRequired,
  speed: PropTypes.number.isRequired,
  synchrony: PropTypes.number.isRequired,
  timeGap: PropTypes.number.isRequired,
  frequency: PropTypes.number.isRequired,
  // features: PropTypes.array.isRequired,
  changeLogTime: PropTypes.func.isRequired,
  changeVideoTime: PropTypes.func.isRequired,
};

export default Zoom;
