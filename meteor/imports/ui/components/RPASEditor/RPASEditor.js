/* eslint-disable max-len, no-return-assign */

import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { FormGroup, ControlLabel, Button, Row, Col } from 'react-bootstrap';
import { Meteor } from 'meteor/meteor';
import { Bert } from 'meteor/themeteorchef:bert';
import validate from '../../../modules/validate';

class RPASEditor extends Component {
  componentDidMount() {
    const component = this;
    validate(component.form, {
      rules: {
        name: {
          required: true,
        },
        rpasType: {
          required: true,
        },
        model: {
          required: false,
        },
        registrationNumber: {
          required: false,
        },
        constructionDate: {
          required: false,
        },
        serialNumber: {
          required: false,
        },
        weight: {
          required: false,
        },
        maxDescendSlope: {
          required: true,
        },
        maxAscendSlope: {
          required: true,
        },
        optimalLandingSlope: {
          required: true,
        },
        optimalTakeOffSlope: {
          required: true,
        },
        maxLandSpeed: {
          required: true,
        },
      },
      messages: {
        name: {
          required: 'Need a name in here, Seuss.',
        },
        rpasType: {
          required: 'This needs a RPAS type, please.',
        },
        maxDescendSlope: {
          required: 'We need the maximum descend slope',
        },
        maxAscendSlope: {
          required: 'We need the maximum ascend slope',
        },
        optimalLandingSlope: {
          required: 'We need the optimal landing slope',
        },
        optimalTakeOffSlope: {
          required: 'We need the optimal take off slope',
        },
        maxLandSpeed: {
          required: 'We need the maximum landing speed for multicopters',
        },
      },
      submitHandler() { component.handleSubmit(); },
    });
  }

  handleSubmit() {
    const { history } = this.props;
    const existingRPAS = this.props.rpas && this.props.rpas._id;
    const methodToCall = existingRPAS ? 'rpas.update' : 'rpas.insert';
    const rpas = {
      name: this.name.value.trim(),
      rpasType: this.rpasType.value.trim(),
      model: this.model.value.trim(),
      registrationNumber: this.registrationNumber.value.trim(),
      constructionDate: this.constructionDate.value.trim(),
      serialNumber: this.serialNumber.value.trim(),
      weight: Number(this.weight.value),
      flightParameters: {
        maxDescendSlope: Number(this.maxDescendSlope.value),
        maxAscendSlope: Number(this.maxAscendSlope.value),
        optimalLandingSlope: Number(this.optimalLandingSlope.value),
        optimalTakeOffSlope: Number(this.optimalTakeOffSlope.value),
        maxLandSpeed: Number(this.maxLandSpeed.value),
      },
    };

    if (existingRPAS) rpas._id = existingRPAS;
    Meteor.call(methodToCall, rpas, (error, rpasId) => {
      if (error) {
        Bert.alert(error.reason, 'danger');
      } else {
        const confirmation = existingRPAS ? 'RPAS updated!' : 'RPAS added!';
        this.form.reset();
        Bert.alert(confirmation, 'success');
        history.push(`/hangar/rpas/${rpasId}`);
      }
    });
  }

  render() {
    const { rpas } = this.props;
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
              defaultValue={rpas && rpas.name}
              placeholder="Oh, The Places You'll Go!"
            />
          </FormGroup>
          <FormGroup>
            <ControlLabel>Model</ControlLabel>
            <input
              type="text"
              className="form-control"
              name="model"
              ref={model => (this.model = model)}
              defaultValue={rpas && rpas.model}
              placeholder="The model of your RPAS"
            />
          </FormGroup>
          <FormGroup>
            <ControlLabel>Registration Number</ControlLabel>
            <input
              type="text"
              className="form-control"
              name="registrationNumber"
              ref={registrationNumber => (this.registrationNumber = registrationNumber)}
              defaultValue={rpas && rpas.registrationNumber}
              placeholder="The registrtaion number of your RPAS"
            />
          </FormGroup>
          <FormGroup>
            <ControlLabel>Construction Date</ControlLabel>
            <input
              type="date"
              className="form-control"
              name="constructionDate"
              max={(new Date()).toISOString()}
              ref={constructionDate => (this.constructionDate = constructionDate)}
              defaultValue={rpas && rpas.constructionDate}
            />
          </FormGroup>
          <FormGroup>
            <ControlLabel>Serial Number</ControlLabel>
            <input
              type="text"
              className="form-control"
              name="serialNumber"
              ref={serialNumber => (this.serialNumber = serialNumber)}
              defaultValue={rpas && rpas.serialNumber}
              placeholder="The serial number of your RPAS"
            />
          </FormGroup>
          <FormGroup>
            <ControlLabel>Weight (g)</ControlLabel>
            <input
              type="text"
              className="form-control"
              name="weight"
              ref={weight => (this.weight = weight)}
              defaultValue={rpas && rpas.weight}
              placeholder="The weight of your RPAS"
            />
          </FormGroup>
          <FormGroup>
            <ControlLabel>RPAS Type</ControlLabel>
            <select
              type="text"
              className="form-control"
              name="rpasType"
              ref={rpasType => (this.rpasType = rpasType)}
              defaultValue={rpas && rpas.rpasType}
            >
              <option value="Plane">Plane</option>
              <option value="MultiCopter">MultiCopter</option>
            </select>
          </FormGroup>
        </Col>
          <Col xs={12} sm={6} md={6} lg={6}>
            <h3><small>Flight Parameters</small></h3>
            <FormGroup>
              <ControlLabel>Max Descend Slope (%)</ControlLabel>
              <input
                type="number"
                className="form-control"
                name="maxDescendSlope"
                ref={maxDescendSlope => (this.maxDescendSlope = maxDescendSlope)}
                defaultValue={(rpas && rpas.flightParameters.maxDescendSlope) || 0}
              />
            </FormGroup>
            <FormGroup>
              <ControlLabel>Max Ascend Slope (%)</ControlLabel>
              <input
                type="number"
                className="form-control"
                name="maxAscendSlope"
                ref={maxAscendSlope => (this.maxAscendSlope = maxAscendSlope)}
                defaultValue={(rpas && rpas.flightParameters.maxAscendSlope) || 0}
              />
            </FormGroup>
            <FormGroup>
              <ControlLabel>Optimal Landing Slope (%)</ControlLabel>
              <input
                type="number"
                className="form-control"
                name="optimalLandingSlope"
                ref={optimalLandingSlope => (this.optimalLandingSlope = optimalLandingSlope)}
                defaultValue={(rpas && rpas.flightParameters.optimalLandingSlope) || 0}
              />
            </FormGroup>
            <FormGroup>
              <ControlLabel>Optimal Take Off Slope (%)</ControlLabel>
              <input
                type="number"
                className="form-control"
                name="optimalTakeOffSlope"
                ref={optimalTakeOffSlope => (this.optimalTakeOffSlope = optimalTakeOffSlope)}
                defaultValue={(rpas && rpas.flightParameters.optimalTakeOffSlope) || 0}
              />
            </FormGroup>
            <FormGroup>
              <ControlLabel>Max Landing Speed (cm/s)</ControlLabel>
              <input
                type="number"
                className="form-control"
                name="maxLandSpeed"
                ref={maxLandSpeed => (this.maxLandSpeed = maxLandSpeed)}
                defaultValue={(rpas && rpas.flightParameters.maxLandSpeed) || 0}
              />
            </FormGroup>
          </Col>
        </Row>
        <Button type="submit" bsStyle="success">
          {rpas && rpas._id ? 'Save Changes' : 'Add RPAS'}
        </Button>
      </form>);
  }
}

RPASEditor.defaultProps = {
  rpas: {
    name: '',
    rpasType: 'Plane',
    model: '',
    registrationNumber: '',
    constructionDate: '',
    serialNumber: '',
    weight: '',
    flightParameters: {
      maxDescendSlope: 0,
      maxAscendSlope: 0,
      optimalLandingSlope: 0,
      optimalTakeOffSlope: 0,
      maxLandSpeed: 0,
    } },
};

RPASEditor.propTypes = {
  rpas: PropTypes.object,
  history: PropTypes.object.isRequired,
};

export default RPASEditor;
