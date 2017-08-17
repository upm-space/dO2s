/* eslint-disable max-len, no-return-assign */

import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { FormGroup, ControlLabel, Button, Row, Col } from 'react-bootstrap';
import { Meteor } from 'meteor/meteor';
import { Bert } from 'meteor/themeteorchef:bert';
import validate from '../../../modules/validate';

class MissionEditor extends Component {
  componentDidMount() {
    const component = this;
    validate(component.form, {
      rules: {
        name: {
          required: true,
        },
        description: {
          required: false,
        },
        rpaType: {
          required: true,
        },
        type: {
          required: true,
        },
      },
      messages: {
        name: {
          required: 'Need a name in here, Seuss.',
        },
        rpaType: {
          required: 'This needs a RPA type, please.',
        },
        type: {
          required: 'This needs a mission type, please.',
        },
      },
      submitHandler() { component.handleSubmit(); },
    });
  }

  handleSubmit() {
    const { history } = this.props;
    const existingMission = this.props.mission && this.props.mission._id;
    const methodToCall = existingMission ? 'missions.update' : 'missions.insert';
    const mission = {
      name: this.name.value.trim(),
      description: this.description.value.trim(),
      project: this.props.match.params.project_id,
      rpaType: this.rpaType.value.trim(),
      type: this.type.value.trim(),
    };

    if (existingMission) mission._id = existingMission;
    Meteor.call(methodToCall, mission, (error, missionId) => {
      if (error) {
        Bert.alert(error.reason, 'danger');
      } else {
        const confirmation = existingMission ? 'Mission updated!' : 'Mission added!';
        this.form.reset();
        Bert.alert(confirmation, 'success');
        history.push(`/projects/${this.props.match.params.project_id}/${missionId}`);
      }
    });
  }

  render() {
    const { mission } = this.props;
    return (
      <form ref={form => (this.form = form)} onSubmit={event => event.preventDefault()}>
        <Row><Col xs={12} sm={4}>
          <FormGroup>
            <ControlLabel>Name</ControlLabel>
            <input
              type="text"
              className="form-control"
              name="name"
              ref={name => (this.name = name)}
              defaultValue={mission && mission.name}
              placeholder="Oh, The Places You'll Go!"
            />
          </FormGroup>
          <FormGroup>
            <ControlLabel>Description</ControlLabel>
            <textarea
              className="form-control"
              name="description"
              ref={description => (this.description = description)}
              defaultValue={mission && mission.description}
              placeholder="Congratulations! Today is your day. You're off to Great Places! You're off and away!"
            />
          </FormGroup>
          <FormGroup>
            <ControlLabel>RPA Type</ControlLabel>
            <select
              type="text"
              className="form-control"
              name="rpaType"
              ref={rpaType => (this.rpaType = rpaType)}
              defaultValue={mission && mission.rpaType}
              placeholder="Congratulations! Today is your day. You're off to Great Places! You're off and away!"
            >
              <option value="fixed-wing">Fixed Wing</option>
            </select>
          </FormGroup>
          <FormGroup>
            <ControlLabel>Mission Type</ControlLabel>
            <select
              type="text"
              className="form-control"
              name="type"
              ref={type => (this.type = type)}
              defaultValue={mission && mission.type}
              placeholder="Congratulations! Today is your day. You're off to Great Places! You're off and away!"
            >
              <option value="surface-area">Surface Area</option>
            </select>
          </FormGroup>
          <Button type="submit" bsStyle="success">
            {mission && mission._id ? 'Save Changes' : 'Add Mission'}
          </Button>
        </Col>
        </Row></form>);
  }
}

MissionEditor.defaultProps = {
  mission: { name: '', description: '', rpaType: 'fixed-wing', type: 'surface-area', project: '' },
};

MissionEditor.propTypes = {
  mission: PropTypes.object,
  history: PropTypes.object.isRequired,
  match: PropTypes.object.isRequired,
};

export default MissionEditor;
