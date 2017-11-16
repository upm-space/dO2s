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

/**
 * Removes the number waypoint/s starting at the specified index
 * @param {Feature Collection} waypointList GeoJSON Feature Collection with the waypoints
 * @param {Integer} waypointIndex the index of the waypoint to remove
 * @param {Integer} numberOfWaypointsToDelete the number of waypoints to delete starting at index
 * @returns {Feature Collection} a new GeoJSON Feature Collection with the waypoints removed
 */
export const editWayPointType = (waypointList, waypointIndex, newWayPointType) => {
  let newWaypointList = JSON.parse(JSON.stringify(waypointList));
  newWaypointList.features[waypointIndex].properties.type = newWayPointType;
  newWaypointList = setWaypointNumbers(newWaypointList);
  return newWaypointList;
};

/**
 * Inserts the waypoint/s starting at the specified index
 * @param {Feature Collection} waypointList GeoJSON Feature Collection with the waypoints
 * @param {Integer} insertIndex the index to inser the waypoint
 * @param {Feature} newWaypoints the new feature waypoint to insert
 * @param {Array} newWaypoints an array of features of waypoints to insert
 * @returns {Feature Collection} a new GeoJSON Feature Collection with the waypoints inserted
 */
export const insertNewWaypointsAtIndex = (waypointList, insertIndex, newWaypoints) => {
  const newWaypointList = JSON.parse(JSON.stringify(waypointList));
  if (newWaypoints instanceof Array) {
    newWaypointList.features.splice(insertIndex, 0, ...newWaypoints);
  } else {
    newWaypointList.features.splice(insertIndex, 0, newWaypoints);
  }
  return newWaypointList;
};

/**
 * Removes the number waypoint/s starting at the specified index
 * @param {Feature Collection} waypointList GeoJSON Feature Collection with the waypoints
 * @param {Integer} waypointIndex the index of the waypoint to remove
 * @param {Integer} numberOfWaypointsToDelete the number of waypoints to delete starting at index
 * @returns {Feature Collection} a new GeoJSON Feature Collection with the waypoints removed
 */
export const removeWaypoint = (waypointList, waypointIndex, numberOfWaypointsToDelete = 1) => {
  const newWaypointList = JSON.parse(JSON.stringify(waypointList));
  newWaypointList.features.splice(waypointIndex, numberOfWaypointsToDelete);
  return newWaypointList;
};

/**
 * Changes the Feature of the waypoint moved in the list
 * @param {Feature Collection} waypointList GeoJSON Feature Collection with the waypoints
 * @param {Integer} waypointIndex the index of the waypoint moved
 * @param {Feature} movedWaypoint The Feature with the moved waypoint
 * @returns {Feature Collection} a new GeoJSON Feature Collection with the waypoints changed
 */
export const moveWaypoint = (waypointList, waypointIndex, movedWaypoint) => {
  const newWaypointList = JSON.parse(JSON.stringify(waypointList));
  newWaypointList.features.splice(waypointIndex, 1, movedWaypoint);
  return newWaypointList;
};


/**
 * Return the bearing for landing in degrees
 * @param {Feature} landingBearing a GeoJSON Feature representing the landing bearing
 * @returns {Number} The landing bearing in degrees
 */
const getLandingBearing = (landingBearing) => {
  if (!landingBearing) {
    return 0;
  }

  const landingLatLon = new LatLon(
    landingBearing.geometry.coordinates[0][1],
    landingBearing.geometry.coordinates[0][0],
  );

  const toPointLatLon = new LatLon(
    landingBearing.geometry.coordinates[1][1],
    landingBearing.geometry.coordinates[1][0],
  );

  return landingLatLon.bearingTo(toPointLatLon);
};

/**
 * Creates the array of feature points for the landing path
 * @param {Feature} landingPoint a GeoJSON Feature
 * @param {Number} landingBearing the bearing in degrees measured from magnetic north
 * @param {number} segmentSize the size of the segment for the landint path in metres
 * @param {number} landingSlope the slope for the landing path in percentage
 * @param {number} flightHeight the height specified for the flight
 * @param {boolean} isClockWise flag to indicate the rotation of the path
 * @returns {Array} An new array of Feture Points with the landing path
 */
const calculateLandingPath = (
  landingPointFeature,
  landingBearing,
  segmentSize,
  landingSlope,
  flightHeight,
  isClockWise = false,
) => {
  const landingPathFeaturePoints = [];
  const heightPerSegment = (segmentSize * landingSlope) / 100;
  let currentHeight = landingPointFeature.properties.altRelative;
  let currentBearing = landingBearing;
  while (currentHeight < flightHeight) {
    let currentLatLon = '';
    if (currentHeight === landingPointFeature.properties.altRelative) {
      currentLatLon = new LatLon(
        landingPointFeature.geometry.coordinates[1],
        landingPointFeature.geometry.coordinates[0],
      );
    } else {
      currentLatLon = new LatLon(
        landingPathFeaturePoints[0].geometry.coordinates[1],
        landingPathFeaturePoints[0].geometry.coordinates[0],
      );
    }

    const nextLandingPathWP = currentLatLon.destinationPoint(currentBearing, segmentSize / 1000);
    currentHeight += heightPerSegment;
    currentBearing += isClockWise ? -90 : 90;
    if (currentBearing > 360) {
      currentBearing -= 360;
    } else if (currentBearing < 0) {
      currentBearing += 360;
    }
    const nextWPFeature = {
      type: 'Feature',
      geometry: {
        type: 'Point',
        coordinates: nextLandingPathWP.latLonToPositionArray(),
      },
      properties: {
        type: 5,
        altRelative: (currentHeight < flightHeight) ? currentHeight : flightHeight,
        altAbsolute: (currentHeight < flightHeight) ? currentHeight : flightHeight,
        altGround: 0,
        isLandingPath: true,
      },
    };
    landingPathFeaturePoints.unshift(nextWPFeature);
  }
  return landingPathFeaturePoints;
};

/**
 * Check if the landing path is defined
 * @param {Feature Collection} waypointList the waypoint List
 * @returns {boolean} True if landing path is defined, false otherwise
 */
const checkforLandingPath = (waypointList) => {
  let numberOfWPLandingPath = 0;
  const isLandingPath = waypointFeature => (
    waypointFeature.properties.isLandingPath !== undefined &&
    waypointFeature.properties.isLandingPath);
  const filterByLandingPath = (waypointFeature) => {
    if (!isLandingPath(waypointFeature)) {
      return true;
    }
    numberOfWPLandingPath += 1;
    return false;
  };
  const featuresArray = waypointList.features;
  featuresArray.filter(filterByLandingPath);
  if (numberOfWPLandingPath === 0) {
    return false;
  }
  return true;
};


/**
 * Takes in the waypoint list and return this waypoint list with the landing path added
 * @param {Feature Collection} waypointList the waypoint List
 * @param {Feature} landingPoint a GeoJSON Feature
 * @param {Feature} landingBearing a LineString representing the landing bearing
 * @param {number} segmentSize the size of the segment for the landint path in metres
 * @param {number} landingSlope the slope for the landing path in percentage
 * @param {number} flightHeight the height specified for the flight
 * @param {boolean} isClockWise flag to indicate the rotation of the path
 * @returns {Feature Collection} The waypoint list with the landing path inserted or 0 if the
 * landing path already exists
 */
export const addLandingPath = (
  waypointList,
  landingBearing,
  segmentSize,
  landingSlope,
  flightHeight,
  isClockWise = false,
) => {
  if (checkforLandingPath(waypointList)) {
    return 0;
  }

  const altRelOfLastWP =
  waypointList.features[waypointList.features.length - 2].properties.altRelative;

  const landingPathArray = calculateLandingPath(
    waypointList.features[waypointList.features.length - 1],
    getLandingBearing(landingBearing),
    segmentSize,
    landingSlope,
    (altRelOfLastWP === flightHeight) ? flightHeight : altRelOfLastWP,
    isClockWise,
  );
  let newWaypointList = insertNewWaypointsAtIndex(waypointList, -1, landingPathArray);
  newWaypointList = setWaypointNumbers(newWaypointList);
  return newWaypointList;
};


/**
 * Removes the landing path from the waypoint list
 * @param {Feature Collection} waypointList the waypoint List
 * @returns {Feature Collection} The waypoint list without the landing path or
 the number 0 if there is no landing path
 */
export const deleteLandingPath = (waypointList) => {
  const newWaypointList = JSON.parse(JSON.stringify(waypointList));
  if (checkforLandingPath(newWaypointList)) {
    const featuresArray = newWaypointList.features;
    const filteredWaypointArray =
    featuresArray.filter((waypointFeature => !waypointFeature.properties.isLandingPath));
    newWaypointList.features = filteredWaypointArray;
    return newWaypointList;
  }
  return 0;
};
