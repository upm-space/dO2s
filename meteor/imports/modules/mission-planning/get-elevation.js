import { Bert } from 'meteor/themeteorchef:bert';
import { Meteor } from 'meteor/meteor';

const calculateAltitudes = (waypointFeatureCollection) => {
  const resultList = JSON.parse(JSON.stringify(waypointFeatureCollection));
  const takeoffElevation = waypointFeatureCollection.features[0].geometry.coordinates[2];

  resultList.features.forEach((feature) => {
    const waypointProps = feature.properties;
    const waypointElevation = feature.geometry.coordinates[2];
    const waypointHeight = waypointProps.altAbsolute;
    if (waypointProps.type === 1) {
      waypointProps.altGround = waypointElevation;
      waypointProps.altRelative = 50;
    } else if (waypointProps.type === 2) {
      waypointProps.altGround = waypointElevation;
      waypointProps.altRelative = waypointElevation - takeoffElevation;
    } else {
      waypointProps.altGround = waypointElevation;
      waypointProps.altRelative = waypointHeight + (waypointElevation - takeoffElevation);
    }
  });
  return resultList;
};

const getElevation = (missionID, flightHeight, waypointFeatureCollection) => {
  const elevationUrl = 'https://data.cykelbanor.se/elevation/geojson';
  const elevationHeaders = new Headers({
    'Content-Type': 'application/json',
  });

  const myInit = {
    method: 'POST',
    body: JSON.stringify(waypointFeatureCollection),
    headers: elevationHeaders,
  };

  fetch(elevationUrl, myInit)
    .then((response) => {
      const contentType = response.headers.get('content-type');
      if (contentType && contentType.includes('application/json')) {
        return response.json();
      }
      throw new TypeError("Oops, we haven't got JSON!");
    }).then((myWaypointsWithAlts) => {
      const myNewWaypointList = calculateAltitudes(myWaypointsWithAlts);
      Meteor.call('missions.editWayPointList', missionID, myNewWaypointList, (error) => {
        if (error) {
          Bert.alert(error.reason, 'danger');
        } else {
          Bert.alert('Mission Altitudes Calculated', 'success');
        }
      });
    })
    .catch(error => Bert.alert(`Elevation Request Error: ${error}`, 'warning'));
};

export default getElevation;
