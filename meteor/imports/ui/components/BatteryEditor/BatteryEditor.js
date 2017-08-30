/* eslint-disable max-len, no-return-assign */

import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { FormGroup, ControlLabel, Button, Row, Col, FormControl } from 'react-bootstrap';
import { Meteor } from 'meteor/meteor';
import { Bert } from 'meteor/themeteorchef:bert';
import validate from '../../../modules/validate';

class BatteryEditor extends Component {
  componentDidMount() {
    const component = this;
    validate(component.form, {
      rules: {
        name: {
          required: true,
        },
        model: {
          required: true,
        },
        registrationNumber: {
          required: true,
        },
        amperes: {
          required: true,
        },
        cellNumber: {
          required: true,
        },
        weight: {
          required: false,
        },
        logData: {
          required: false,
        },
      },
      messages: {
        name: {
          required: 'Need a name in here, Seuss.',
        },
        model: {
          required: 'This needs a model please',
        },
        registrationNumber: {
          required: 'This needs a resgistration number, please.',
        },
        amperes: {
          required: 'This needs some amperes, please.',
        },
        cellNumber: {
          required: 'This needs the number of cells, please.',
        },
      },
      submitHandler() { component.handleSubmit(); },
    });
  }

  handleSubmit() {
    const { history } = this.props;
    const existingBattery = this.props.battery && this.props.battery._id;
    const methodToCall = existingBattery ? 'batteries.update' : 'batteries.insert';
    const battery = {
      name: this.name.value.trim(),
      model: this.model.value.trim(),
      registrationNumber: this.registrationNumber.value.trim(),
      amperes: Number(this.amperes.value),
      cellNumber: Number(this.cellNumber.value),
      weight: Number(this.weight.value),
    };

    if (existingBattery) battery._id = existingBattery;

    Meteor.call(methodToCall, battery, (error, batteryId) => {
      if (error) {
        Bert.alert(error.reason, 'danger');
      } else {
        const confirmation = existingBattery ? 'Battery updated!' : 'Battery added!';
        this.form.reset();
        Bert.alert(confirmation, 'success');
        history.push(`/hangar/batteries/${batteryId}`);
      }
    });
  }

  render() {
    const { battery } = this.props;
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
              defaultValue={battery && battery.name}
              placeholder="Name you battery"
            />
          </FormGroup>
          <FormGroup>
            <ControlLabel>Model</ControlLabel>
            <input
              type="text"
              className="form-control"
              name="model"
              ref={model => (this.model = model)}
              defaultValue={battery && battery.model}
              placeholder="The model of your battery"
            />
          </FormGroup>
          <FormGroup>
            <ControlLabel>Registration Number</ControlLabel>
            <input
              type="text"
              className="form-control"
              name="registrationNumber"
              ref={registrationNumber => (this.registrationNumber = registrationNumber)}
              defaultValue={battery && battery.registrationNumber}
              placeholder="A registration number for your battery"
            />
          </FormGroup>
          <FormGroup>
            <ControlLabel>Amperes (A)</ControlLabel>
            <input
              type="number"
              className="form-control"
              name="amperes"
              ref={amperes => (this.amperes = amperes)}
              defaultValue={battery && battery.amperes}
              placeholder="Your battery's amperes"
            />
          </FormGroup>
          <FormGroup>
            <ControlLabel>Cell Number</ControlLabel>
            <input
              type="number"
              className="form-control"
              name="cellNumber"
              ref={cellNumber => (this.cellNumber = cellNumber)}
              defaultValue={battery && battery.cellNumber}
              placeholder="The number of cells in your battery"
            />
          </FormGroup>
          <FormGroup>
            <ControlLabel>Weight (g)</ControlLabel>
            <input
              type="number"
              className="form-control"
              name="weight"
              ref={weight => (this.weight = weight)}
              defaultValue={battery && battery.weight}
              placeholder="Please input the weight of your battery in grams"
            />
          </FormGroup>
          <FormGroup>
            <ControlLabel>Log Data</ControlLabel>
            <FormControl.Static>
              Some Log data button
            </FormControl.Static>
          </FormGroup>
        </Col>
        </Row>
        <Button type="submit" bsStyle="success">
          {battery && battery._id ? 'Save Changes' : 'Add Battery'}
        </Button>
      </form>);
  }
}

BatteryEditor.defaultProps = {
  battery: {
    name: '',
    model: '',
    registrationNumber: '',
    amperes: '',
    cellNumber: '',
    weight: '',
    logData: '',
  },
};

BatteryEditor.propTypes = {
  battery: PropTypes.object,
  history: PropTypes.object.isRequired,
};

export default BatteryEditor;
