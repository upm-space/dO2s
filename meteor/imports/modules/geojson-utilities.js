/* eslint-disable no-param-reassign */

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
  alt: featurePoint.geometry.coordinates[2],
});

export const latlong2featurePoint = latlong => ({
  type: 'Feature',
  geometry: {
    type: 'Point',
    coordinates: [latlong.lng, latlong.lat, (latlong.alt === undefined) ? 0 : latlong.alt],
  },
});

export const featurePointGetZoom = featurePoint => (
  featurePoint.properties && featurePoint.properties.zoom
);

export const featurePointGetLongitude = featurePoint => (
  featurePoint.geometry && featurePoint.geometry.coordinates && featurePoint.geometry.coordinates[0]
);

export const featurePointGetLatitude = featurePoint => (
  featurePoint.geometry && featurePoint.geometry.coordinates && featurePoint.geometry.coordinates[1]
);

export const featurePointGetAltitude = featurePoint => (
  featurePoint.geometry && featurePoint.geometry.coordinates && featurePoint.geometry.coordinates[2]
);

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
