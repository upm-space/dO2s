import L from 'leaflet';

const getWaypointType = (waypointType = 0) => {
  switch (waypointType) {
  case 1: return 'take-off';
  case 2: return 'landing';
  case 3: return 'camera';
  case 4: return 'camera';
  case 5: return 'waypoint';
  default: return '';
  }
};

const waypointHtml = (waypointType, waypointNumber = 0) => {
  switch (waypointType) {
  case 1: return '<span class="fa fa-arrow-circle-up fa-4x" aria-hidden="true"></span>';
  case 2: return '<span class="fa fa-arrow-circle-down fa-4x" aria-hidden="true"></span>';
  case 3: return '<span class="fa fa-camera fa-3x" aria-hidden="true"></span>';
  case 4: return '<span class="fa-stack fa-2x"><span class="fa fa-camera fa-stack-1x"></span><span class="fa fa-ban fa-stack-2x ban"></span></span>';
  case 5: return `<span class="fa-stack fa-2x"><span class="fa fa-flag fa-2x" aria-hidden="true"></span><strong class="fa-stack-1x calendar-text">${waypointNumber}</strong></span>`;
  default: return '<span class="fa fa-map-marker fa-4x" aria-hidden="true"></span>';
  }
};

const waypointSize = (waypointType) => {
  switch (waypointType) {
  case 1: return [41.16, 48];
  case 2: return [41.16, 48];
  case 3: return [38.57, 36];
  case 4: return [48, 48];
  case 5: return [48, 48];
  default: return [27.43, 48];
  }
};

const waypointAnchor = (waypointType) => {
  switch (waypointType) {
  case 1: return [20.3, 38];
  case 2: return [20.3, 38];
  case 3: return [19.5, 20];
  case 4: return [24, 26];
  case 5: return [5, 45];
  default: return [13, 46];
  }
};

export const waypointListOptions = {
  pointToLayer(feature, latlng) {
    return L.marker(latlng, {
      icon: L.divIcon({
        html: waypointHtml(feature.properties.type, feature.properties.webNumber),
        iconSize: waypointSize(feature.properties.type),
        iconAnchor: waypointAnchor(feature.properties.type),
        className: `wayPointIcon ${getWaypointType(feature.properties.type)}`,
      }),
    });
  },
};

export const rpaPathStyle = {
  style: { color: '#d9534f' },
};

export const bearingPathStyle = {
  sytle: { color: '#FFCF50' },
};
