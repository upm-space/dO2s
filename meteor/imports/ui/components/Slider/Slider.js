import React, { Component } from 'react';
import * as d3 from 'd3';

import './Slider.scss';

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

// const styles = { width: (0.85 * window.innerWidth) - 45, height: 50 };

class Slider extends Component {
  componentDidMount() {
    this.slider();
  }

  slider() {
    const svg = d3.select('#svg');
    const margin = { right: 50, left: 50 };
    const width = this.props.width < 650 ? 550 : this.props.width - margin.left - margin.right;
    const height = 50;
    let active = 1;
    let range;
    let handle1;
    let handle2;
    let handle3;

    const x = d3.scaleLinear()
      .domain([0, this.props.domain])
      .range([0, width])
      .clamp(true)
      ;

    const axis = d3.axisBottom(x).ticks(10).tickFormat(d => usToHHMMSS(d));

    const slider = svg.append('g')
      .attr('class', 'slider')
      .attr('transform', `translate(${margin.left},${(height / 2) - 15})`)
      .call(axis)
      ;

    function hue(h) {
      if (active === 1) {
        if (handle2.attr('x') < x(h)) {
          handle1.attr('x', parseFloat(handle2.attr('x')) - 5);
        } else {
          handle1.attr('x', x(h) - 5);
        }
        d3.select('#SliderTextMin').text(usToHHMMSS(x.invert(range.attr('x1'))));
      }
      if (active === 2) {
        if (parseFloat(handle1.attr('x')) + 5 > x(h)) {
          handle2.attr('x', parseFloat(handle1.attr('x')) + 5);
        } else {
          handle2.attr('x', x(h));
        }
        d3.select('#SliderTextMax').text(usToHHMMSS(x.invert(range.attr('x2'))));
      }
      range.attr('x1', parseFloat(handle1.attr('x')) + 5);
      range.attr('x2', handle2.attr('x'));
      if (active === 3) { handle3.attr('x', x(h) - 2.5); }
    }

    const drag = d3.drag()
      .on('start.interrupt', () => { slider.interrupt(); })
      .on('start drag', () => {
        hue(x.invert(d3.event.x));
        this.props.changeRange(x.invert(range.attr('x1')), x.invert(range.attr('x2')));
        this.props.changeTime(x.invert(handle3.attr('x')));
      })
    ;

    slider.append('line')
      .attr('class', 'track')
      .attr('x1', x.range()[0])
      .attr('x2', x.range()[1])
      .select(function () { return this.parentNode.appendChild(this.cloneNode(true)); })
      .attr('class', 'track-inset')
      .select(function () { return this.parentNode.appendChild(this.cloneNode(true)); })
      .attr('class', 'track-overlay')
      .call(drag)
    ;

    range = slider.append('line')
      .attr('class', 'range')
      .attr('x1', x.range()[0])
      .attr('x2', x.range()[1])
      .call(drag)
    ;

    handle1 = slider.insert('rect')
      .attr('class', 'handle')
      .attr('x', -5)
      .attr('y', -10)
      .attr('width', 5)
      .attr('height', 20)
      .on('mouseover', () => { active = 1; })
      .call(drag)
    ;

    handle2 = slider.insert('rect')
      .attr('class', 'handle')
      .attr('x', width)
      .attr('y', -10)
      .attr('width', 5)
      .attr('height', 20)
      .on('mouseover', () => { active = 2; })
      .call(drag)
    ;

    handle3 = slider.insert('rect')
      .attr('class', 'selector')
      .attr('x', -1.5)
      .attr('y', -15)
      .attr('width', 3)
      .attr('height', 60)
      .on('mousedown', () => { active = 3; })
      .call(drag)
    ;
  }

  render() {
    return (
      <div className="wrapper" id="wrapper" style={{ width: '650px', height: '80px' }}>
        <h5 id="TimeRange">Time range: <span id="SliderTextMin">{usToHHMMSS(0)}</span> - <span id="SliderTextMax">{usToHHMMSS(608399957)}</span></h5>
        <svg id="svg" style={{ width: '100%', height: '45px' }} />
      </div>
    );
  }
}

export default Slider;
