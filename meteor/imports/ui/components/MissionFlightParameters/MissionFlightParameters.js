/* eslint-disable max-len, no-return-assign */

import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { FormGroup, ControlLabel, Button, Row, Col } from 'react-bootstrap';
import { Meteor } from 'meteor/meteor';
import { Bert } from 'meteor/themeteorchef:bert';
import validate from '../../../modules/validate';

class MissionFlightParameters extends Component {
  componentDidMount() {
    const component = this;
    const missionType = this.props.mission.missionType;
    validate(component.form, {
      rules: {
        height: {
          required: true,
        },
        speed: {
          required: true,
        },
        entryMargin: {
          required: true,
        },
        axisBuffer: {
          required: missionType === 'Linear Area',
        },
      },
      messages: {
        height: {
          required: 'The altitude of the flight above ground',
        },
        speed: {
          required: 'The speed of the RPA',
        },
        entryMargin: {
          required: 'The margin for the fixed wing to turn',
        },
        axisBuffer: {
          required: 'The buffer for the axis to map',
        },
      },
      submitHandler() { component.handleSubmit(); },
    });
  }

  handleSubmit() {
    const missionType = this.props.mission.missionType;
    const flightParams = {
      height: Number(this.height.value),
      speed: Number(this.speed.value),
      entryMargin: Number(this.entryMargin.value),
    };
    if (missionType === 'Linear Area') {
      flightParams.axisBuffer = Number(this.axisBuffer.value);
    }

    Meteor.call('missions.setFlightParams', this.props.mission._id, flightParams, (error) => {
      if (error) {
        Bert.alert(error.reason, 'danger');
      } else {
        Bert.alert('Flight Parameters Updated', 'success');
      }
    });
  }

  render() {
    const { mission } = this.props;
    return (
      <form
        ref={form => (this.form = form)}
        onSubmit={event => event.preventDefault()}
      >
        <Row><Col xs={12} sm={6} md={6} lg={6}>
          <FormGroup>
            <ControlLabel>Height of flight above ground (m)</ControlLabel>
            <input
              type="number"
              className="form-control"
              name="height"
              ref={height => (this.height = height)}
              defaultValue={mission && mission.flightPlan && mission.flightPlan.flightParameters && mission.flightPlan.flightParameters.height}
            />
          </FormGroup>
          <FormGroup>
            <ControlLabel>Speed (m/s)</ControlLabel>
            <input
              type="number"
              className="form-control"
              name="speed"
              ref={speed => (this.speed = speed)}
              defaultValue={mission && mission.flightPlan && mission.flightPlan.flightParameters && mission.flightPlan.flightParameters.speed}
            />
          </FormGroup>
          <FormGroup>
            <ControlLabel>Entry Margin for Fixed Wing (m)</ControlLabel>
            <input
              type="number"
              className="form-control"
              name="entryMargin"
              ref={entryMargin => (this.entryMargin = entryMargin)}
              defaultValue={mission && mission.flightPlan && mission.flightPlan.flightParameters && mission.flightPlan.flightParameters.entryMargin}
            />
          </FormGroup>
          {(mission && mission.missionType && mission.missionType === 'Linear Area') ?
            <FormGroup>
              <ControlLabel>Axis Buffer for Linear Mission (m)</ControlLabel>
              <input
                type="number"
                className="form-control"
                name="axisBuffer"
                ref={axisBuffer => (this.axisBuffer = axisBuffer)}
                defaultValue={mission && mission.flightPlan && mission.flightPlan.flightParameters && mission.flightPlan.flightParameters.axisBuffer}
              />
            </FormGroup> : ''}
        </Col>
        </Row>
        <Button type="submit" bsStyle="success">
          Save Changes
        </Button>
      </form>);
  }
}

MissionFlightParameters.propTypes = {
  mission: PropTypes.object.isRequired,
};

export default MissionFlightParameters;
