/* eslint-disable no-return-assign, no-unneeded-ternary */

import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { withTracker } from 'meteor/react-meteor-data';
import { FormGroup, ControlLabel, Button, Row, Col, HelpBlock } from 'react-bootstrap';
import { Link } from 'react-router-dom';
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
    this.handleRPAChange = this.handleRPAChange.bind(this);
    this.handlePayloadChange = this.handlePayloadChange.bind(this);
    this.state = {
      missionRPA: (this.props.mission && this.props.mission.rpa) ?
        this.props.mission && this.props.mission.rpa : '',
      missionPayload: (this.props.mission && this.props.mission.payload) ?
        this.props.mission && this.props.mission.payload : '',
    };
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
    if (this.state.missionRPA === '') {
      this.setState({ missionRPA: this.rpa.value.trim() });
    }
    if (this.state.missionPayload === '') {
      this.setState({ missionPayload: this.payload.value.trim() });
    }
    const mission = {
      name: this.name.value.trim(),
      description: this.description.value.trim(),
      project: this.props.match.params.project_id,
      rpa: this.state.missionRPA,
      payload: this.state.missionPayload,
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

  handleRPAChange(newPRA) {
    this.setState({ missionRPA: newPRA });
  }

  handlePayloadChange(newPayload) {
    this.setState({ missionPayload: newPayload });
  }
  renderRPAsSelect(rpas) {
    return rpas.map(({ _id, name, rpaType }) => (
      <option key={_id} value={_id}>{name} ({rpaType})</option>));
  }

  renderPayloadsSelect(payloads) {
    return payloads.map(({ _id, name, model }) => (
      <option key={_id} value={_id}>{name} {model ? `(${model})` : ''}</option>));
  }

  render() {
    const { mission, rpas, payloads } = this.props;
    return (
      <form ref={form => (this.form = form)} onSubmit={event => event.preventDefault()}>
        <Row>
          <Col xs={12} sm={4}>
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
                placeholder="Congratulations! Today is your day. You're off to Great Places! You're
              off and away!"
              />
            </FormGroup>
            <FormGroup>
              <ControlLabel>RPA</ControlLabel>
              <select
                type="text"
                className="form-control"
                name="rpa"
                ref={rpa => (this.rpa = rpa)}
                value={this.state.missionRPA}
                onChange={event => this.handleRPAChange(event.target.value)}
              >
                {this.renderRPAsSelect(rpas)}
              </select>
              {!rpas.length ?
                <HelpBlock>
                  <p>{'You don\u0027t have any RPAs saved.'}</p>
                  <Link to="/hangar/rpas/new">Add new RPA</Link>
                </HelpBlock>
                : ''}
            </FormGroup>
            <FormGroup>
              <ControlLabel>Payload</ControlLabel>
              <select
                type="text"
                className="form-control"
                name="payload"
                ref={payload => (this.payload = payload)}
                value={this.state.missionPayload}
                onChange={event => this.handlePayloadChange(event.target.value)}
              >
                {this.renderPayloadsSelect(payloads)}
              </select>
              {!payloads.length ?
                <HelpBlock>
                  <p>{'You don\u0027t have any Payloads saved.'}</p>
                  <Link to="/hangar/payloads/new">Add new Payload</Link>
                </HelpBlock>
                : ''}
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
                <option value="Surface Area">Surface Area</option>
                <option value="Linear Area">Linear Area</option>
              </select>
            </FormGroup>
            <Button type="submit" bsStyle="success">
              {mission && mission._id ? 'Save Changes' : 'Add Mission'}
            </Button>
          </Col>
        </Row>
      </form>);
  }
}

MissionEditor.defaultProps = {
  mission: {
    name: '', description: '', rpa: '', payload: '', missionType: 'surface-area', project: '',
  },
};

MissionEditor.propTypes = {
  mission: PropTypes.object,
  history: PropTypes.object.isRequired,
  match: PropTypes.object.isRequired,
  rpas: PropTypes.array.isRequired,
  payloads: PropTypes.array.isRequired,
};

export default withTracker(() => {
  const rpasSub = Meteor.subscribe('rpas.mission');
  const payloadsSub = Meteor.subscribe('payloads.mission');
  return {
    loading: !rpasSub.ready() && !payloadsSub.ready(),
    rpas: RPASCollection.find().fetch(),
    payloads: PayloadsCollection.find().fetch(),
  };
})(MissionEditor);
