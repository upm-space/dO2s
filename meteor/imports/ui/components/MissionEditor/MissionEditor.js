/* eslint-disable max-len, no-return-assign */

import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { createContainer } from 'meteor/react-meteor-data';
import { FormGroup, ControlLabel, Button, Row, Col, HelpBlock } from 'react-bootstrap';
import { LinkContainer } from 'react-router-bootstrap';
import { Meteor } from 'meteor/meteor';
import { Bert } from 'meteor/themeteorchef:bert';
import validate from '../../../modules/validate';

import RPASCollection from '../../../api/RPAs/RPAs';
import PayloadsCollection from '../../../api/Payloads/Payloads';

class MissionEditor extends Component {
  constructor(props) {
    super(props);

    this.renderRPAsSelect = this.renderRPAsSelect.bind(this);
    this.renderPayloadsSelect = this.renderPayloadsSelect.bind(this);
  }
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
        rpa: {
          required: true,
        },
        payload: {
          required: true,
        },
        missionType: {
          required: true,
        },
      },
      messages: {
        name: {
          required: 'Need a name in here, Seuss.',
        },
        rpa: {
          required: 'This needs a RPA, please.',
        },
        payload: {
          required: 'This needs a Payload, please.',
        },
        missionType: {
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
      rpa: this.rpa.value.trim(),
      payload: this.payload.value.trim(),
      missionType: this.missionType.value.trim(),
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
  renderRPAsSelect(rpas) {
    return rpas.map(({ _id, name, rpaType }) => (
      <option key={_id} value={_id}>{name} ({rpaType})</option>));
  }

  renderPayloadsSelect(payloads) {
    return payloads.map(({ _id, name, model }) => (
      <option key={_id} value={_id}>{name} {model ? ({ model }) : ''}</option>));
  }

  render() {
    const { mission, rpas, payloads } = this.props;
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
            <ControlLabel>RPA</ControlLabel>
            <select
              type="text"
              className="form-control"
              name="rpa"
              ref={rpa => (this.rpa = rpa)}
              defaultValue={mission && mission.rpa}
            >
              {this.renderRPAsSelect(rpas)}
            </select>
            {!rpas.length ? <HelpBlock><p>You don't have any RPAs saved.</p><LinkContainer to="/hangar/rpas/new">
              <a>Add new RPA</a>
            </LinkContainer></HelpBlock> : ''}
          </FormGroup>
          <FormGroup>
            <ControlLabel>Payload</ControlLabel>
            <select
              type="text"
              className="form-control"
              name="payload"
              ref={payload => (this.payload = payload)}
              defaultValue={mission && mission.payload}
            >
              {this.renderPayloadsSelect(payloads)}
            </select>
            {!payloads.length ? <HelpBlock><p>You don't have any Payloads saved.</p><LinkContainer to="/hangar/payloads/new">
              <a>Add new Payload</a>
            </LinkContainer></HelpBlock> : ''}
          </FormGroup>
          <FormGroup>
            <ControlLabel>Mission Type</ControlLabel>
            <select
              type="text"
              className="form-control"
              name="missionType"
              ref={missionType => (this.missionType = missionType)}
              defaultValue={mission && mission.missionType}
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
  mission: { name: '', description: '', rpa: '', payload: '', missionType: 'surface-area', project: '' },
};

MissionEditor.propTypes = {
  mission: PropTypes.object,
  history: PropTypes.object.isRequired,
  match: PropTypes.object.isRequired,
  rpas: PropTypes.array.isRequired,
  payloads: PropTypes.array.isRequired,
};

export default createContainer(() => {
  const rpasSub = Meteor.subscribe('rpas.mission');
  const payloadsSub = Meteor.subscribe('payloads.mission');
  return {
    loading: !rpasSub.ready() && !payloadsSub.ready(),
    rpas: RPASCollection.find().fetch(),
    payloads: PayloadsCollection.find().fetch(),
  };
}, MissionEditor);
