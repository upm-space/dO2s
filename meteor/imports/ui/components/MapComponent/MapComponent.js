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
    this.handleChange = this.handleChange.bind(this);
    this.state = {
      searchLoc: '',
    };
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

  handleChange(event) {
    this.setState({ searchLoc: event.target.value });
  }

  searchLocation() {
    const urlforPlace = location => `http://nominatim.openstreetmap.org/search?format=json&limit=5&q=${location}`;
    fetch(urlforPlace(this.state.searchLoc.trim()))
    .then(d => d.json())
    // .then(d => console.log(d[0].display_name))
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
        {this.props.searchItem ? (<FormGroup>
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
