import React, { Component } from 'react';
import PropTypes from 'prop-types';
import L from 'leaflet';
import { Button, FormGroup, InputGroup } from 'react-bootstrap';
import { Bert } from 'meteor/themeteorchef:bert';

import { featurePoint2latlong, latlong2featurePoint, featurePointGetZoom, featurePointSetZoom, featurePointGetLongitude, featurePointGetLatitude } from '../../../modules/geojson-utilities';


import './MapComponent.scss';

class MapComponent extends Component {
  constructor(props) {
    super(props);
    this.searchLocation = this.searchLocation.bind(this);
    this.handleChange = this.handleChange.bind(this);
    this.state = {
      searchLoc: '',
    };
  }
  componentDidMount() {
    let currentLocation = this.props.location;
    const mymap = L.map('mymap').setView(featurePoint2latlong(currentLocation), featurePointGetZoom(currentLocation));
    this.mymap = mymap;
    L.tileLayer('http://{s}.tile.osm.org/{z}/{x}/{y}.png', {
      attribution: '&copy; <a href="http://osm.org/copyright">OpenStreetMap</a> contributors',
    }).addTo(mymap);

    mymap.on('moveend', () => {
      currentLocation = latlong2featurePoint(mymap.getCenter().wrap());
      featurePointSetZoom(currentLocation, mymap.getZoom());
      this.props.onLocationChange(currentLocation);
    });
  }

  componentDidUpdate(prevProps) {
    const oldLocation = prevProps.location;
    const newLocation = this.props.location;
    const isLongSame =
      featurePointGetLongitude(newLocation) === featurePointGetLongitude(oldLocation);
    const isLatSame = featurePointGetLatitude(newLocation) === featurePointGetLatitude(oldLocation);
    const isZoomSame = featurePointGetZoom(newLocation) === featurePointGetZoom(oldLocation);
    if (!isLongSame || !isLatSame || !isZoomSame) {
      this.mymap.setView(featurePoint2latlong(newLocation), featurePointGetZoom(newLocation));
    }
  }

  handleChange(event) {
    this.setState({ searchLoc: event.target.value });
  }

  searchLocation() {
    const urlforPlace = location => `http://nominatim.openstreetmap.org/search?format=json&limit=5&q=${location}`;
    fetch(urlforPlace(this.state.searchLoc.trim()))
      .then(d => d.json())
      .then((d) => {
        this.mymap.setView([d[0].lat, d[0].lon], 15);
        this.setState({ searchLoc: d[0].display_name });
      })
      .catch(() => {
        Bert.alert('Location not found', 'warning');
      });
  }

  render() {
    return (
      <div className="MapComponent" style={{ height: this.props.height }}>
        <div id="mymap" style={{ height: (!this.props.searchItem ? '100%' : '90%') }} />
        {this.props.searchItem ? (
          <FormGroup>
            <InputGroup>
              <input
                type="text"
                className="form-control"
                name="searchLoc"
                value={this.state.searchLoc}
                onChange={this.handleChange}
              />
              <InputGroup.Button>
                <Button onClick={this.searchLocation}>Search</Button>
              </InputGroup.Button>
            </InputGroup>
          </FormGroup>) : ''}
      </div>);
  }
}

MapComponent.defaultProps = {
  location: {
    type: 'Feature',
    geometry: {
      type: 'Point',
      coordinates: [-3.7038, 40.4168],
    },
    properties: {
      zoom: 12,
    },
  },
  searchItem: false,
};

MapComponent.propTypes = {
  location: PropTypes.object,
  onLocationChange: PropTypes.func.isRequired,
  searchItem: PropTypes.bool,
  height: PropTypes.string.isRequired,
};

export default MapComponent;
