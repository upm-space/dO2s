/* eslint-disable max-len, no-return-assign */

import React from 'react';
import PropTypes from 'prop-types';
import { FormGroup, ControlLabel, Button, Row, Col } from 'react-bootstrap';
import { Meteor } from 'meteor/meteor';
import { Bert } from 'meteor/themeteorchef:bert';
import validate from '../../../modules/validate';

import MapComponent from '../MapComponent/MapComponent';

class ProjectEditor extends React.Component {
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
        location: {
          longitude: {
            required: true,
          },
          latitude: {
            required: true,
          },
          zoom: {
            required: true,
          },
        },
      },
      messages: {
        name: {
          required: 'Need a name in here, Seuss.',
        },
        description: {
          required: 'This needs a description, please.',
        },
        location: {
          longitude: {
            required: 'This needs a longitude, please.',
          },
          latitude: {
            required: 'This needs a latitude, please.',
          },
          zoom: {
            required: 'This needs a zoom, please.',
          },
        },
      },
      submitHandler() { component.handleSubmit(); },
    });
  }

  handleSubmit() {
    const { history } = this.props;
    const existingProject = this.props.project && this.props.project._id;
    const methodToCall = existingProject ? 'projects.update' : 'projects.insert';
    const project = {
      name: this.name.value.trim(),
      description: this.description.value.trim(),
      mapLocation: {
        longitude: Number(this.longitude.value),
        latitude: Number(this.latitude.value),
        zoom: Number(this.zoom.value),
      },
    };

    if (existingProject) project._id = existingProject;

    Meteor.call(methodToCall, project, (error, projectId) => {
      if (error) {
        Bert.alert(error.reason, 'danger');
      } else {
        const confirmation = existingProject ? 'Project updated!' : 'Project added!';
        this.form.reset();
        Bert.alert(confirmation, 'success');
        history.push(`/projects/${projectId}`);
      }
    });
  }

  render() {
    const { project } = this.props;
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
              defaultValue={project && project.name}
              placeholder="Oh, The Places You'll Go!"
            />
          </FormGroup>
          <FormGroup>
            <ControlLabel>Description</ControlLabel>
            <textarea
              className="form-control"
              name="description"
              ref={description => (this.description = description)}
              defaultValue={project && project.description}
              placeholder="Congratulations! Today is your day. You're off to Great Places! You're off and away!"
            />
          </FormGroup>
          <FormGroup>
            <ControlLabel>Longitude</ControlLabel>
            <input
              type="number"
              className="form-control"
              name="longitude"
              ref={longitude => (this.longitude = longitude)}
              defaultValue={project && project.mapLocation.longitude}
            />
          </FormGroup>
          <FormGroup>
            <ControlLabel>Latitude</ControlLabel>
            <input
              type="number"
              className="form-control"
              name="latitude"
              ref={latitude => (this.latitude = latitude)}
              defaultValue={project && project.mapLocation.latitude}
            />
          </FormGroup>
          <FormGroup>
            <ControlLabel>Zoom</ControlLabel>
            <input
              type="number"
              className="form-control"
              name="zoom"
              ref={zoom => (this.zoom = zoom)}
              defaultValue={project && project.mapLocation.zoom}
            />
          </FormGroup>
          <Button type="submit" bsStyle="success">
            {project && project._id ? 'Save Changes' : 'Add Project'}
          </Button>
        </Col>
          <Col xs={12} sm={8}>
            <MapComponent location={project && project.mapLocation} />
          </Col>
        </Row></form>);
  }
}

ProjectEditor.defaultProps = {
  project: { name: '', description: '', mapLocation: { longitude: 0, latitude: 0, zoom: 0 } },
};

ProjectEditor.propTypes = {
  project: PropTypes.object,
  history: PropTypes.object.isRequired,
};

export default ProjectEditor;
