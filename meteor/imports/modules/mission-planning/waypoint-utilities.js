import LatLon from './GeoHelper';

export const pointsCollectionFeatureToLineString = (pointsCollectionFeature) => {
  const lineStringFeature = {
    type: 'Feature',
    geometry: {
      type: 'LineString',
      coordinates: [],
    },
    properties: {},
  };
  pointsCollectionFeature.features.forEach((feature) => {
    lineStringFeature.geometry.coordinates.push(feature.geometry.coordinates);
  });
  return lineStringFeature;
};

export const setWaypointNumbers = (waypointFeatureCollection) => {
  const waypointFeatureCollectionCopy =
  JSON.parse(JSON.stringify(waypointFeatureCollection));
  const waypointArray = waypointFeatureCollectionCopy.features;
  let totalNumber = 0;
  let webNumber = 1;
  waypointArray.forEach((feature) => {
    feature.properties.totalNumber = totalNumber;
    totalNumber += 1;
    if (feature.properties.type === 5) {
      feature.properties.webNumber = webNumber;
      webNumber += 1;
    } else if (feature.properties.webNumber) {
      delete feature.properties.webNumber;
    }
  });
  return waypointFeatureCollectionCopy;
};

export const getOperationType = (currentRPALineString, newRPALatLngs) => {
  const oldWaypointArray = currentRPALineString.geometry.coordinates;
  const oldMinusNew = oldWaypointArray.length - newRPALatLngs.length;
  const result = {
    operation: 'none', index: -1, lat: -1, lon: -1,
  };
  let wpIndex = 0;
  if (oldMinusNew === 0) {
    for (wpIndex = 0; wpIndex < newRPALatLngs.length; wpIndex += 1) {
      if ((newRPALatLngs[wpIndex].lng !== oldWaypointArray[wpIndex][0]) ||
         (newRPALatLngs[wpIndex].lat !== oldWaypointArray[wpIndex][1])) {
        result.index = wpIndex;
        result.operation = 'move';
        result.lat = newRPALatLngs[wpIndex].lat;
        result.lon = newRPALatLngs[wpIndex].lng;
        break;
      }
    }
    return result;
  } else if (oldMinusNew === -1) {
    for (wpIndex = 0; wpIndex < oldWaypointArray.length; wpIndex += 1) {
      if ((newRPALatLngs[wpIndex].lng !== oldWaypointArray[wpIndex][0]) ||
         (newRPALatLngs[wpIndex].lat !== oldWaypointArray[wpIndex][1])) {
        result.index = wpIndex;
        result.operation = 'add';
        result.lat = newRPALatLngs[wpIndex].lat;
        result.lon = newRPALatLngs[wpIndex].lng;
        break;
      }
    }
    return result;
  } else if (oldMinusNew === 1) {
    for (wpIndex = 0; wpIndex < newRPALatLngs.length; wpIndex += 1) {
      if ((newRPALatLngs[wpIndex].lng !== oldWaypointArray[wpIndex][0]) ||
           (newRPALatLngs[wpIndex].lat !== oldWaypointArray[wpIndex][1])) {
        result.index = wpIndex;
        result.operation = 'delete';
        break;
      }
    }
    return result;
  }
  return result;
};

export const arrayEqualsCoords = (array1, array2) => {
  // if the other array is a falsy value, return
  if (!array1) { return false; }
  if (!array2) { return false; }

  // compare lengths - can save a lot of time
  if (array1.length !== array2.length) { return false; }

  for (let i = 0; i < array1.length; i += 1) {
    // Check if we have nested arrays
    if (array1[i] instanceof Array && array2[i] instanceof Array) {
      // recurse into the nested arrays
      if (!arrayEqualsCoords(array1[i], array2[i])) { return false; }
    } else if (array1[i].toFixed(6) !== array2[i].toFixed(6)) {
      // Warning - two different object instances will never be equal: {x:20} != {x:20}
      return false;
    }
  }
  return true;
};

export const arrayContainsCoords = (item, array) => {
  // if the other array is a falsy value, return false
  if (!array) { return false; }
  if (!item) { return false; }

  // start by assuming the array doesn't contain the thing
  let result = false;
  for (let i = 0; i < array.length; i += 1) {
    // if anything in the array is the thing then change our mind from before
    if (array[i] instanceof Array) {
      if (arrayEqualsCoords(item, array[i])) { result = true; }
    } else if (array[i].toFixed(6) === item.toFixed(6)) { result = true; }
  }
  // return the decision we left in the variable, result
  return result;
};

export const editWayPointType = (waypointList, waypointIndex, newWayPointType) => {
  let newWaypointList = JSON.parse(JSON.stringify(waypointList));
  newWaypointList.features[waypointIndex].properties.type = newWayPointType;
  newWaypointList = setWaypointNumbers(newWaypointList);
  return newWaypointList;
};

export const insertNewWaypointsAtIndex = (waypointList, insertIndex, newWaypoints) => {
  const newWaypointList = JSON.parse(JSON.stringify(waypointList));
  if (newWaypoints instanceof Array) {
    newWaypointList.features.splice(insertIndex, 0, ...newWaypoints);
  } else {
    newWaypointList.features.splice(insertIndex, 0, newWaypoints);
  }
  return newWaypointList;
};

export const removeWaypoint = (waypointList, waypointIndex, numberOfWaypointsToDelete = 1) => {
  const newWaypointList = JSON.parse(JSON.stringify(waypointList));
  newWaypointList.features.splice(waypointIndex, numberOfWaypointsToDelete);
  return newWaypointList;
};

export const moveWaypoint = (waypointList, waypointIndex, movedWaypoint) => {
  const newWaypointList = JSON.parse(JSON.stringify(waypointList));
  newWaypointList.features.splice(waypointIndex, 1, movedWaypoint);
  return newWaypointList;
};

export const calculateLandingPath = (landingPointFeature, landingBearing, segmentSize, landingSlope, flightHeight, isClockWise = false) => {
  const landingPathFeaturePoints = [];
  const heightPerSegment = (segmentSize * landingSlope) / 100;
  let currentHeight = 0;
  let currentBearing = landingBearing;
  while (currentHeight < flightHeight) {
    let currentLatLon = '';
    if (currentHeight === 0) {
      currentLatLon = new LatLon(landingPointFeature.geometry.coordinates[1], landingPointFeature.geometry.coordinates[0]);
    } else {
      currentLatLon = new LatLon(landingPathFeaturePoints[0].geometry.coordinates[1], landingPathFeaturePoints[0].geometry.coordinates[0]);
    }
    const nextLandingPathWP = currentLatLon.destinationPoint(currentBearing, segmentSize);
    currentHeight += heightPerSegment;
    currentBearing += isClockWise ? 90 : -90;
    const nextWPFeature = {
      type: 'Feature',
      geometry: {
        type: 'Point',
        coordinates: nextLandingPathWP.latLonToPositionArray,
      },
      properties: {
        type: 5,
        altRelative: currentHeight,
        altAbsolute: currentHeight,
        altGround: 0,
        isLandingPath: true,
      },
    };
    landingPathFeaturePoints.unshift(nextWPFeature);
  }
  return landingPathFeaturePoints;
};


export const addLandingPath = (waypointList, landingBearing, segmentSize, landingSlope, flightHeight, isClockWise = false) => {
  const newWaypointList = JSON.parse(JSON.stringify(waypointList));
  const landingPathArray = calculateLandingPath(waypointList.features[waypointList.features.length - 1], landingBearing, segmentSize, landingSlope, flightHeight, isClockWise);
  const newWaypointFeatures = insertNewWaypointsAtIndex(waypointList.feaures, -1, landingPathArray);
};
