/* eslint-disable max-len, no-return-assign */

import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { FormGroup, ControlLabel, Button, Row, Col } from 'react-bootstrap';
import { Meteor } from 'meteor/meteor';
import { Bert } from 'meteor/themeteorchef:bert';
import validate from '../../../modules/validate';

class MissionPictureGrid extends Component {
  componentDidMount() {
    const component = this;
    validate(component.form, {
      rules: {
        overlap: {
          required: true,
        },
        sidelap: {
          required: true,
        },
      },
      messages: {
        overlap: {
          required: 'The overlap for the pictures',
        },
        sidelap: {
          required: 'The overlap for the pictures',
        },
      },
      submitHandler() { component.handleSubmit(); },
    });
  }

  handleSubmit() {
    const pictureGrid = {
      overlap: Number(this.overlap.value),
      sidelap: Number(this.sidelap.value),
    };

    Meteor.call('missions.setPictureGrid', this.props.mission._id, pictureGrid, (error) => {
      if (error) {
        Bert.alert(error.reason, 'danger');
      } else {
        Bert.alert('Picture Grid Updated', 'success');
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
            <ControlLabel>Overlap (%)</ControlLabel>
            <input
              type="number"
              className="form-control"
              name="overlap"
              ref={overlap => (this.overlap = overlap)}
              defaultValue={mission && mission.flightPlan && mission.flightPlan.pictureGrid && mission.flightPlan.pictureGrid.overlap}
            />
          </FormGroup>
          <FormGroup>
            <ControlLabel>Sidelap (%)</ControlLabel>
            <input
              type="number"
              className="form-control"
              name="sidelap"
              ref={sidelap => (this.sidelap = sidelap)}
              defaultValue={mission && mission.flightPlan && mission.flightPlan.pictureGrid && mission.flightPlan.pictureGrid.sidelap}
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

MissionPictureGrid.propTypes = {
  mission: PropTypes.object.isRequired,
};

export default MissionPictureGrid;
