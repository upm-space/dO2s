import React, { Component } from 'react';
import PropTypes from 'prop-types';
import L from 'leaflet';
import { Button, FormGroup, InputGroup } from 'react-bootstrap';
import { Bert } from 'meteor/themeteorchef:bert';


import './MapComponent.scss';

class MapComponent extends Component {
  constructor(props) {
    super(props);
    this.searchLocation = this.searchLocation.bind(this);
  }
  componentDidMount() {
    let currentLocation = this.props.location;
    const mymap = L.map('mymap').setView([currentLocation.latitude, currentLocation.longitude], currentLocation.zoom);
    this.mymap = mymap;
    L.tileLayer('http://{s}.tile.osm.org/{z}/{x}/{y}.png', {
      attribution: '&copy; <a href="http://osm.org/copyright">OpenStreetMap</a> contributors',
    }).addTo(mymap);

    mymap.on('moveend', () => {
      currentLocation = {
        longitude: mymap.getCenter().wrap().lng,
        latitude: mymap.getCenter().wrap().lat,
        zoom: mymap.getZoom(),
      };
      this.props.onLocationChange(currentLocation);
    });
  }

  componentDidUpdate(prevProps) {
    const oldLocation = prevProps.location;
    const newLocation = this.props.location;
    const isLongSame = newLocation.longitude === oldLocation.longitude;
    const isLatSame = newLocation.latitude === oldLocation.latitude;
    const isZoomSame = newLocation.zoom === oldLocation.zoom;
    if (!isLongSame || !isLatSame || !isZoomSame) {
      this.mymap.setView([newLocation.latitude, newLocation.longitude], newLocation.zoom);
    }
  }

  searchLocation() {
    const urlforPlace = location => `http://nominatim.openstreetmap.org/search?format=json&limit=5&q=${location}`;
        // see https://derickrethans.nl/leaflet-and-nominatim.html
    fetch(urlforPlace(this.searchLoc.value.trim()))
    .then(d => d.json())
    .then(d => this.mymap.setView([d[0].lat, d[0].lon], 15))
    .catch((error) => {
      Bert.alert('Location not found', 'warning');
    });
  }

  render() {
    return (
      <div className="MapComponent" style={{ height: this.props.height }}>
        <div id="mymap" />
        {this.props.searchItem ? (<FormGroup>
          <InputGroup>
            <input
              type="text"
              className="form-control"
              name="searchLoc"
              ref={searchLoc => (this.searchLoc = searchLoc)}
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
  location: { longitude: 3.7038, latitude: 40.4168, zoom: 12 },
  searchItem: false,
};

MapComponent.propTypes = {
  location: PropTypes.object,
  onLocationChange: PropTypes.func.isRequired,
  searchItem: PropTypes.bool,
  height: PropTypes.string.isRequired,
};

export default MapComponent;
