export const formatNum = (num, digits) => {
  const pow = 10 ** (digits || 6);
  return Math.round(num * pow) / pow;
};

export const newEmptyFeaturePoint = () => ({
  type: 'Feature',
  geometry: {
    type: 'Point',
    coordinates: [],
  },
});

export function featureSetAltitudeToZero(feature) {
  if ((feature.geometry) && (feature.geometry.type === 'Point')) {
    feature.geometry.coordinates[2] = 0;
  } else if ((feature.geometry) && (feature.geometry.type === 'LineString')) {
    for (let i = 0; i < feature.geometry.coordinates.length; i += 1) {
      feature.geometry.coordinates[i][2] = 0;
    }
  } else if ((feature.geometry) && (feature.geometry.type === 'Polygon')) {
    for (let i = 0; i < feature.geometry.coordinates.length; i += 1) {
      for (let j = 0; j < feature.geometry.coordinates[i].length; j += 1) {
        feature.geometry.coordinates[i][j][2] = 0;
      }
    }
  }
}

export const featurePoint2latlong = featurePoint => ({
  lat: featurePoint.geometry.coordinates[1],
  lng: featurePoint.geometry.coordinates[0],
  alt: (featurePoint.geometry.coordinates.length === 3) ? featurePoint.geometry.coordinates[2] : 0,
});

export const latlong2featurePoint = (latlong) => {
  let coords;
  if (latlong.alt !== undefined) {
    coords = [latlong.lng, latlong.lat, latlong.alt];
  } else {
    coords = [latlong.lng, latlong.lat];
  }
  return ({
    type: 'Feature',
    geometry: {
      type: 'Point',
      coordinates: coords,
    },
  });
};

export const featurePointGetZoom = featurePoint => (
  featurePoint.properties && featurePoint.properties.zoom
);

export const featurePointGetLongitude = featurePoint => (
  featurePoint.geometry && featurePoint.geometry.coordinates && featurePoint.geometry.coordinates[0]
);

export const featurePointGetLatitude = featurePoint => (
  featurePoint.geometry && featurePoint.geometry.coordinates && featurePoint.geometry.coordinates[1]
);

export const featurePointGetAltitude = (featurePoint) => {
  if (featurePoint.geometry &&
    featurePoint.geometry.coordinates &&
    featurePoint.geometry.coordinates.length === 3) {
    return featurePoint.geometry.coordinates[2];
  }
  return undefined;
};

export function featurePointSetZoom(featurePoint, zoom) {
  if (!featurePoint.properties) {
    featurePoint.properties = {};
    featurePoint.properties.zoom = zoom;
  }
  featurePoint.properties.zoom = zoom;
}

export function featurePointSetLongitude(featurePoint, long) {
  featurePoint.geometry.coordinates[0] = long;
}

export function featurePointSetLatitude(featurePoint, lat) {
  featurePoint.geometry.coordinates[0] = lat;
}

export function featurePointSetAltitude(featurePoint, alt) {
  featurePoint.geometry.coordinates[2] = alt;
}
