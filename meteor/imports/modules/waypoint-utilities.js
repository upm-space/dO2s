export const createRPAPath = (wayPointList) => {
  const rpaPath = {
    type: 'Feature',
    geometry: {
      type: 'LineString',
      coordinates: [],
    },
    properties: {},
  };
  // this waypoint list is an array of features
  wayPointList.forEach((feature) => {
    rpaPath.geometry.coordinates.push(feature.geometry.coordinates);
  });

  return rpaPath;
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
    }
  });
  return waypointFeatureCollectionCopy;
};

export const getOperationType = (currentRPAPath, newRPAPath) => {
  const oldWaypointCount = currentRPAPath.geometry.coordinates.length;
  const newWaypointCount = newRPAPath.geometry.coordinates.length;
  if (oldWaypointCount === newWaypointCount) {
    return 'move';
  } else if (oldWaypointCount < newWaypointCount) {
    return 'add';
  } else if (oldWaypointCount > newWaypointCount) {
    return 'delete';
  }
  return 'nothing';
};

export const arrayEquals = (array1, array2) => {
  // if the other array is a falsy value, return
  if (!array2) { return false; }

  // compare lengths - can save a lot of time
  if (array1.length !== array2.length) { return false; }

  for (let i = 0; i < array1.length; i += 1) {
    // Check if we have nested arrays
    if (array1[i] instanceof Array && array2[i] instanceof Array) {
      // recurse into the nested arrays
      if (!arrayEquals(array1[i], array2[i])) { return false; }
    } else if (array1[i] !== array2[i]) {
      // Warning - two different object instances will never be equal: {x:20} != {x:20}
      return false;
    }
  }
  return true;
};

export const arrayContains = (item, array) => {
  // if the other array is a falsy value, return false
  if (!array) { return false; }

  // start by assuming the array doesn't contain the thing
  let result = false;
  for (let i = 0; i < array.length; i += 1) {
    // if anything in the array is the thing then change our mind from before
    if (array[i] instanceof Array) {
      if (arrayEquals(item, array[i])) { result = true; }
    } else if (array[i] === item) { result = true; }
  }
  // return the decision we left in the variable, result
  return result;
};

export const insertNewWaypoint = (oldWaypointList, newRPAPath) => {
  const newWaypointList = JSON.parse(JSON.stringify(oldWaypointList));
  const oldRPAPathfromWaypoints = createRPAPath(oldWaypointList.features);
  const oldWaypointArray = oldRPAPathfromWaypoints.geometry.coordinates;
  const newRpaArray = newRPAPath.geometry.coordinates;
  for (let i = 0; i < newRpaArray.length; i += 1) {
    const currentWaypointProperties = oldWaypointList.features[i].properties;
    const currentRPAPosition = newRpaArray[i];
    if (!arrayContains(currentRPAPosition, oldWaypointArray)) {
      const newWaypoint = {
        type: 'Feature',
        properties: {
          altRelative: currentWaypointProperties.altRelative,
          altAbsolute: currentWaypointProperties.altAbsolute,
          altGround: currentWaypointProperties.altGround,
          type: 5,
        },
        geometry: {
          type: 'Point',
          coordinates: currentRPAPosition,
        },
      };
      newWaypointList.features.splice(i, 0, newWaypoint);
      break;
    }
  }
  return newWaypointList;
};

export const removeWaypoint = (oldWaypointList, newRPAPath) => {
  const newWaypointList = JSON.parse(JSON.stringify(oldWaypointList));
  const oldRPAPathfromWaypoints = createRPAPath(oldWaypointList.features);
  const oldWaypointArray = oldRPAPathfromWaypoints.geometry.coordinates;
  const newRpaArray = newRPAPath.geometry.coordinates;

  for (let i = 0; i < oldWaypointArray.length; i += 1) {
    const currentWaypointPosition = oldWaypointArray[i];
    if (!arrayContains(currentWaypointPosition, newRpaArray)) {
      newWaypointList.features.splice(i, 1);
      break;
    }
  }
  return newWaypointList;
};

export const moveWaypoint = (oldWaypointList, newRPAPath) => {
  const newWaypointList = JSON.parse(JSON.stringify(oldWaypointList));
  const oldRPAPathfromWaypoints = createRPAPath(oldWaypointList.features);
  const oldWaypointArray = oldRPAPathfromWaypoints.geometry.coordinates;
  const newRpaArray = newRPAPath.geometry.coordinates;

  for (let i = 0; i < newRpaArray.length; i += 1) {
    const currentWaypointPosition = oldWaypointArray[i];
    const currentRPAPosition = newRpaArray[i];
    if (!arrayEquals(currentWaypointPosition, currentRPAPosition)) {
      newWaypointList.features[i].geometry.coordinates = currentRPAPosition;
      break;
    }
  }
  return newWaypointList;
};
