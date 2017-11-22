import React, { Component } from 'react';
import PropTypes from 'prop-types';
import * as d3 from 'd3';

import './Slider.scss';

const margin = { right: 15, left: 20 };
const height = 50;
let x;
let axis;
let slider;
let i = 0;
let range;
let handle1;
let handle2;
let selector;

const usToHHMMSS = (time) => {
  const usSecNum = parseInt(time, 10) / 1e6;
  let hours = Math.floor(usSecNum / 3600);
  let minutes = Math.floor((usSecNum - (hours * 3600)) / 60);
  let seconds = Math.floor(usSecNum - (hours * 3600) - (minutes * 60));
  if (hours < 10) { hours = `0${hours}`; }
  if (minutes < 10) { minutes = `0${minutes}`; }
  if (seconds < 10) { seconds = `0${seconds}`; }
  return ` ${hours}:${minutes}:${seconds}`;
};

class Slider extends Component {
  componentDidMount() {
    this.slider();
  }

  componentDidUpdate() {
    if (this.props.synchrony) {
      i = this.props.logTime;
    }
    x.domain([0, this.props.domain]);
    slider.selectAll('.axis').remove();
    slider.append('g')
      .attr('class', 'axis')
      .call(axis)
      .lower();
    slider.selectAll('text').style('text-anchor', 'end').attr('transform', 'rotate(-30) translate(10, 5)');
  }

  slider() {
    const svg = d3.select('#SliderSvg');
    const width = this.wrapper.offsetWidth - margin.left - margin.right;

    x = d3.scaleLinear()
      .domain([0, this.props.domain])
      .range([0, width])
      .clamp(true);
    axis = d3.axisBottom(x).ticks(10).tickFormat(d => usToHHMMSS(d));

    slider = svg.append('g')
      .attr('class', 'slider')
      .attr('transform', `translate(${margin.left},${(height / 2) - 15})`);
    slider.append('g')
      .attr('class', 'axis')
      .call(axis);

    const dragLeft = d3.drag()
      .on('start.interrupt', () => { slider.interrupt(); })
      .on('start drag', () => {
        if (handle2.attr('x') < x(x.invert(d3.event.x))) {
          handle1.attr('x', parseFloat(handle2.attr('x')) - 5);
        } else {
          handle1.attr('x', x(x.invert(d3.event.x)) - 5);
        }
        d3.select('#SliderTextMin').text(usToHHMMSS(x.invert(range.attr('x1'))));
        range.attr('x1', parseFloat(handle1.attr('x')) + 5);
        this.props.changeRange(x.invert(range.attr('x1')), x.invert(range.attr('x2')));
      });

    const dragRight = d3.drag()
      .on('start.interrupt', () => { slider.interrupt(); })
      .on('start drag', () => {
        if (parseFloat(handle1.attr('x')) + 5 > x(x.invert(d3.event.x))) {
          handle2.attr('x', parseFloat(handle1.attr('x')) + 5);
        } else {
          handle2.attr('x', x(x.invert(d3.event.x)));
        }
        d3.select('#SliderTextMax').text(usToHHMMSS(x.invert(range.attr('x2'))));
        range.attr('x2', handle2.attr('x'));
        this.props.changeRange(x.invert(range.attr('x1')), x.invert(range.attr('x2')));
      });

    const dragRed = d3.drag()
      .on('start.interrupt', () => { slider.interrupt(); })
      .on('start drag', () => {
        selector.attr('x', x(x.invert(d3.event.x)) - 1.5);
        i = x.invert(selector.attr('x'));
        this.props.changeLogTime(x.invert(selector.attr('x')));
        if (this.props.synchrony) {
          this.props.changeVideoTime(i - this.props.timeGap);
        }
      });

    slider.append('line')
      .attr('class', 'track')
      .attr('x1', x.range()[0])
      .attr('x2', x.range()[1])
      .select(function a() { return this.parentNode.appendChild(this.cloneNode(true)); })
      .attr('class', 'track-inset')
      .select(function a() { return this.parentNode.appendChild(this.cloneNode(true)); })
      .attr('class', 'track-overlay')
      .call(dragRed);
    range = slider.append('line')
      .attr('class', 'track-range')
      .attr('x1', x.range()[0])
      .attr('x2', x.range()[1])
      .call(dragRed);
    handle1 = slider.insert('rect')
      .attr('class', 'SliderHandle')
      .attr('x', -5)
      .attr('y', -10)
      .attr('width', 5)
      .attr('height', 20)
      .call(dragLeft);
    handle2 = slider.insert('rect')
      .attr('class', 'SliderHandle')
      .attr('x', width)
      .attr('y', -10)
      .attr('width', 5)
      .attr('height', 20)
      .call(dragRight);
    selector = slider.insert('rect')
      .attr('class', 'SliderSelector')
      .attr('x', -1.5)
      .attr('y', -10)
      .attr('width', 3)
      .attr('height', 45)
      .call(dragRed);

    this.loop();

    slider.selectAll('text').style('text-anchor', 'end').attr('transform', 'rotate(-30) translate(10, 5)');
  }

  loop() {
    setInterval(() => {
      i += this.props.frequency * 1000 * this.props.speed;
      selector.attr('x', x(i) - 1.5);
      this.props.changeLogTime(i);
    }, this.props.frequency);
  }

  render() {
    return (
      <div className="SliderWrapper" id="SliderWrapper" ref={(c) => { this.wrapper = c; }}>
        <h5
          className="TimeRange"
          id="TimeRange"
        >Time range:
          <span
            id="SliderTextMin"
          >
            {usToHHMMSS(0)}
          </span> -
          <span
            id="SliderTextMax"
          >
            {usToHHMMSS(this.props.end)}
          </span>
        </h5>
        <svg className="SliderSvg" id="SliderSvg" />
      </div>
    );
  }
}

Slider.propTypes = {
  end: PropTypes.number.isRequired,
  domain: PropTypes.number.isRequired,
  logTime: PropTypes.number.isRequired,
  speed: PropTypes.number.isRequired,
  synchrony: PropTypes.bool.isRequired,
  timeGap: PropTypes.number.isRequired,
  frequency: PropTypes.number.isRequired,
  changeLogTime: PropTypes.func.isRequired,
  changeVideoTime: PropTypes.func.isRequired,
  changeRange: PropTypes.func.isRequired,
};

export default Slider;
