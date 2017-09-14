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
    validate(component.form, {
      rules: {
        altitude: {
          required: true,
        },
        speed: {
          required: true,
        },
        entryMargin: {
          required: true,
        },
      },
      messages: {
        altitude: {
          required: 'The altitude of the flight',
        },
        speed: {
          required: 'The speed of the RPA',
        },
        entryMargin: {
          required: 'The margin for the fixed wing to turn',
        },
      },
      submitHandler() { component.handleSubmit(); },
    });
  }

  handleSubmit() {
    const flightParams = {
      altitude: Number(this.altitude.value),
      speed: Number(this.speed.value),
      entryMargin: Number(this.entryMargin.value),
    };

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
            <ControlLabel>Altitude (m)</ControlLabel>
            <input
              type="number"
              className="form-control"
              name="altitude"
              ref={altitude => (this.altitude = altitude)}
              defaultValue={mission && mission.flightPlan && mission.flightPlan.flightParameters && mission.flightPlan.flightParameters.altitude}
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
