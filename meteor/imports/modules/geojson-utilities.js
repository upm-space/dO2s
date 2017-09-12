/* eslint-disable no-param-reassign */

export const newEmptyFeaturePoint = () => ({
  type: 'Feature',
  geometry: {
    type: 'Point',
    coordinates: [],
  },
});

export const featurePoint2latlong = featurePoint => ({
  lat: featurePoint.geometry.coordinates[1],
  lng: featurePoint.geometry.coordinates[0],
});

export const latlong2featurePoint = latlong => ({
  type: 'Feature',
  geometry: {
    type: 'Point',
    coordinates: [latlong.lng, latlong.lat, 0],
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
