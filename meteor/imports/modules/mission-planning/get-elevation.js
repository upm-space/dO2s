import { Bert } from 'meteor/themeteorchef:bert';
import { Meteor } from 'meteor/meteor';

const calculateAltitudes = (flightHeight, featureCollection) => {
  const resultList = JSON.parse(JSON.stringify(featureCollection));
  const takeoffElevation = Number(featureCollection.features[0].geometry.coordinates[2].toFixed(2));

  resultList.features.forEach((feature) => {
    const waypointElevation = Number(feature.geometry.coordinates[2].toFixed(2));
    if (feature.properties.type === 1) {
      feature.properties.altGround = waypointElevation;
      feature.properties.altRelative = 0;
    } else if (feature.properties.type === 2) {
      feature.properties.altGround = waypointElevation;
      feature.properties.altRelative = Number((waypointElevation - takeoffElevation).toFixed(2));
    } else {
      feature.properties.altGround = waypointElevation;
      feature.properties.altRelative = Number((flightHeight + (waypointElevation - takeoffElevation)).toFixed(2));
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
      const myNewWaypointList = calculateAltitudes(flightHeight, myWaypointsWithAlts);
      Meteor.call('missions.insertWaypointAltitudes', missionID, myNewWaypointList, (error) => {
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
