/* eslint-disable max-len, no-return-assign */

import React from 'react';
import PropTypes from 'prop-types';
import { FormGroup, ControlLabel, Button, Row, Col } from 'react-bootstrap';
import { Meteor } from 'meteor/meteor';
import { Bert } from 'meteor/themeteorchef:bert';
import validate from '../../../modules/validate';

import MapComponent from '../MapComponent/MapComponent';

import { featurePoint2latlong, latlong2featurePoint, featurePointGetZoom, featurePointSetZoom, featurePointSetLatitude, featurePointSetLongitude, featurePointGetLongitude, featurePointGetLatitude } from '../../../modules/geojson-converter';


class ProjectEditor extends React.Component {
  constructor(props) {
    super(props);
    this.changeProjectLocation = this.changeProjectLocation.bind(this);
    this.state = {
      location: props.project && props.project.mapLocation,
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

  changeProjectLocation(location) {
    this.setState({
      location: {
        type: 'Feature',
        geometry: {
          type: 'Point',
          coordinates: [featurePointGetLongitude(location), featurePointGetLatitude(location), 0],
        },
        properties: {
          zoom: featurePointGetZoom(location),
        },
      } });
  }

  handleSubmit() {
    const { history } = this.props;
    const existingProject = this.props.project && this.props.project._id;
    const methodToCall = existingProject ? 'projects.update' : 'projects.insert';
    const project = {
      name: this.name.value.trim(),
      description: this.description.value.trim(),
      mapLocation: {
        type: 'Feature',
        geometry: {
          type: 'Point',
          coordinates: [Number(this.longitude.value), Number(this.latitude.value), 0],
        },
        properties: {
          zoom: Number(this.zoom.value),
        },
      },
    };
    this.setState({
      location: {
        type: 'Feature',
        geometry: {
          type: 'Point',
          coordinates: [Number(this.longitude.value), Number(this.latitude.value), 0],
        },
        properties: {
          zoom: Number(this.zoom.value),
        },
      } });

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
        <Row>
          <Col xs={12} sm={4} md={4} lg={4}>
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
                value={featurePointGetLongitude(this.state.location)}
                onChange={() => this.setState({ 'location.geometry.coordinates[0]': Number(this.longitude.value) })}
              />
            </FormGroup>
            <FormGroup>
              <ControlLabel>Latitude</ControlLabel>
              <input
                type="number"
                className="form-control"
                name="latitude"
                ref={latitude => (this.latitude = latitude)}
                value={featurePointGetLatitude(this.state.location)}
                onChange={() => this.setState({ 'location.geometry.coordinates[1]': Number(this.latitude.value) })}
              />
            </FormGroup>
            <FormGroup>
              <ControlLabel>Zoom</ControlLabel>
              <input
                type="number"
                className="form-control"
                name="zoom"
                ref={zoom => (this.zoom = zoom)}
                value={featurePointGetZoom(this.state.location)}
                onChange={() => this.setState({ 'location.properties.zoom': Number(this.zoom.value) })}
              />
            </FormGroup>
          </Col>
          <Col xs={12} sm={8} md={8} lg={8}>
            <MapComponent location={this.state.location} onLocationChange={this.changeProjectLocation} height="75vh" searchItem />
          </Col>

        </Row>
        <Row><Col xs={12} sm={4} md={4} lg={4}>
          <Button className="btn-xs-block" type="submit" bsStyle="success">
            {project && project._id ? 'Save Changes' : 'Add Project'}
          </Button>
        </Col></Row></form>);
  }
}

ProjectEditor.defaultProps = {
  project: {
    name: '',
    description: '',
    mapLocation: {
      type: 'Feature',
      geometry: {
        type: 'Point',
        coordinates: [-3.7038, 40.4168, 0],
      },
      properties: {
        zoom: 12,
      },
    } },
};

ProjectEditor.propTypes = {
  project: PropTypes.object,
  history: PropTypes.object.isRequired,
};

export default ProjectEditor;
