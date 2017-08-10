import React from 'react';
import PropTypes from 'prop-types';
import faker from 'faker';
import { Image } from 'react-bootstrap';

import './MapComponent.scss';

const MapComponent = ({ location }) => (
  <div className="MapComponent">
    <div>{`This is the item location: (longitude:${location.longitude}) (latitude:${location.latitude}) (zoom:${location.zoom})`}</div>
    <div className="map">
      <Image className="center-block" src={faker.image.image()} rounded responsive />
    </div>
  </div>
);

MapComponent.defaultProps = {
  location: { lontitude: 0, latitude: 0, zoom: 0 },
};

MapComponent.propTypes = {
  location: PropTypes.object,
};

export default MapComponent;
