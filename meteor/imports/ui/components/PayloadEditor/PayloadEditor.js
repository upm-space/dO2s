/* eslint-disable max-len, no-return-assign */

import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { FormGroup, ControlLabel, Button, Row, Col } from 'react-bootstrap';
import { Meteor } from 'meteor/meteor';
import { Bert } from 'meteor/themeteorchef:bert';
import validate from '../../../modules/validate';

class PayloadEditor extends Component {
  constructor(props) {
    super(props);
    this.renderCameraParameters = this.renderCameraParameters.bind(this);

    this.state = {
      payloadType: props.payload && props.payload.payloadType,
    };
  }

  componentDidMount() {
    const component = this;
    validate(component.form, {
      rules: {
        name: {
          required: true,
        },
        payloadType: {
          required: true,
        },
        model: {
          required: true,
        },
        registrationNumber: {
          required: false,
        },
        weight: {
          required: false,
        },
        focalLength: {
          required: this.state.payloadType === 'Camera',
        },
        sensorWidth: {
          required: this.state.payloadType === 'Camera',
        },
        sensorHeight: {
          required: this.state.payloadType === 'Camera',
        },
        imageWidth: {
          required: this.state.payloadType === 'Camera',
        },
        imageHeight: {
          required: this.state.payloadType === 'Camera',
        },
      },
      messages: {
        name: {
          required: 'Need a name in here, Seuss.',
        },
        model: {
          required: 'We need a model for this payload.',
        },
        payloadType: {
          required: 'This needs a Payload type, please.',
        },
        focalLength: {
          required: 'This needs the focal length.',
        },
        sensorWidth: {
          required: 'This needs the sensor width.',
        },
        sensorHeight: {
          required: 'This needs the sensor height.',
        },
        imageWidth: {
          required: 'This needs the image width.',
        },
        imageHeight: {
          required: 'This needs the image height.',
        },
      },
      submitHandler() { component.handleSubmit(); },
    });
  }

  handleSubmit() {
    const { history } = this.props;
    const existingPayload = this.props.payload && this.props.payload._id;
    const methodToCall = existingPayload ? 'payloads.update' : 'payloads.insert';
    const payload = {
      name: this.name.value.trim(),
      payloadType: this.payloadType.value,
      model: this.model.value.trim(),
      registrationNumber: this.registrationNumber.value.trim(),
      weight: Number(this.weight.value),
    };

    this.setState({
      payloadType: this.payloadType.value,
    });

    if (this.state.payloadType === 'Camera') {
      payload.sensorParameters = {
        focalLength: Number(this.focalLength.value),
        sensorWidth: Number(this.sensorWidth.value),
        sensorHeight: Number(this.sensorHeight.value),
        imageWidth: Number(this.imageWidth.value),
        imageHeight: Number(this.imageHeight.value),
      };
    }

    if (existingPayload) payload._id = existingPayload;
    Meteor.call(methodToCall, payload, (error, payloadId) => {
      if (error) {
        Bert.alert(error.reason, 'danger');
      } else {
        const confirmation = existingPayload ? 'Payload updated!' : 'Payload added!';
        this.form.reset();
        Bert.alert(confirmation, 'success');
        history.push(`/hangar/payloads/${payloadId}`);
      }
    });
  }

  renderCameraParameters(payload) {
    return (
      <div>
        <FormGroup>
          <ControlLabel>Focal Length (mm)</ControlLabel>
          <input
            type="number"
            className="form-control"
            name="focalLength"
            ref={focalLength => (this.focalLength = focalLength)}
            defaultValue={(payload && payload.sensorParameters.focalLength)}
          />
        </FormGroup>
        <FormGroup>
          <ControlLabel>Sensor Width (mm)</ControlLabel>
          <input
            type="number"
            className="form-control"
            name="sensorWidth"
            ref={sensorWidth => (this.sensorWidth = sensorWidth)}
            defaultValue={(payload && payload.sensorParameters.sensorWidth)}
          />
        </FormGroup>
        <FormGroup>
          <ControlLabel>Sensor Height (mm)</ControlLabel>
          <input
            type="number"
            className="form-control"
            name="sensorHeight"
            ref={sensorHeight => (this.sensorHeight = sensorHeight)}
            defaultValue={(payload && payload.sensorParameters.sensorHeight)}
          />
        </FormGroup>
        <FormGroup>
          <ControlLabel>Image Height (px)</ControlLabel>
          <input
            type="number"
            className="form-control"
            name="imageHeight"
            ref={imageHeight => (this.imageHeight = imageHeight)}
            defaultValue={(payload && payload.sensorParameters.imageHeight)}
          />
        </FormGroup>
        <FormGroup>
          <ControlLabel>Image Width (px)</ControlLabel>
          <input
            type="number"
            className="form-control"
            name="imageWidth"
            ref={imageWidth => (this.imageWidth = imageWidth)}
            defaultValue={(payload && payload.sensorParameters.imageWidth)}
          />
        </FormGroup></div>);
  }

  render() {
    const { payload } = this.props;
    return (
      <form
        ref={form => (this.form = form)}
        onSubmit={event => event.preventDefault()}
      >
        <Row><Col xs={12} sm={6} md={6} lg={6}>
          <FormGroup>
            <ControlLabel>Name</ControlLabel>
            <input
              type="text"
              className="form-control"
              name="name"
              ref={name => (this.name = name)}
              defaultValue={payload && payload.name}
              placeholder="Give a name to your payload"
            />
          </FormGroup>
          <FormGroup>
            <ControlLabel>Model</ControlLabel>
            <input
              type="text"
              className="form-control"
              name="model"
              ref={model => (this.model = model)}
              defaultValue={payload && payload.model}
              placeholder="The model of your payload"
            />
          </FormGroup>
          <FormGroup>
            <ControlLabel>Registration Number</ControlLabel>
            <input
              type="text"
              className="form-control"
              name="registrationNumber"
              ref={registrationNumber => (this.registrationNumber = registrationNumber)}
              defaultValue={payload && payload.registrationNumber}
              placeholder="The registration number of your payload"
            />
          </FormGroup>
          <FormGroup>
            <ControlLabel>Weight (g)</ControlLabel>
            <input
              type="number"
              className="form-control"
              name="weight"
              ref={weight => (this.weight = weight)}
              defaultValue={payload && payload.weight}
              placeholder="The weight of your payload"
            />
          </FormGroup>
          <FormGroup>
            <ControlLabel>Payload Type</ControlLabel>
            <select
              type="text"
              className="form-control"
              name="payloadType"
              ref={payloadType => (this.payloadType = payloadType)}
              value={this.state.payloadType}
              onChange={() => this.setState({ payloadType: this.payloadType.value })}
            >
              <option value="Camera">Camera</option>
            </select>
          </FormGroup>
        </Col>
          <Col xs={12} sm={6} md={6} lg={6}>
            <h3><small>Sensor Parameters</small></h3>
            {(this.state.payloadType === 'Camera') ? this.renderCameraParameters(payload) : ''}
          </Col>
        </Row>
        <Button type="submit" bsStyle="success">
          {payload && payload._id ? 'Save Changes' : 'Add Payload'}
        </Button>
      </form>);
  }
}

PayloadEditor.defaultProps = {
  payload: {
    name: '',
    payloadType: 'Camera',
    model: '',
    registrationNumber: '',
    weight: '',
    sensorParameters: {},
  },
};

PayloadEditor.propTypes = {
  payload: PropTypes.object,
  history: PropTypes.object.isRequired,
};

export default PayloadEditor;
