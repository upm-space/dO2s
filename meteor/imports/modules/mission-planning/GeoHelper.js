/* jshint strict: false */
/* global define:false */

/*----------------------------------------------------------------------------------------------*/
/* GeoHelper for spherical calcs V0.5                       Compilation Made by Luis Izquierdo--*/
/* See also http://www.movable-type.co.uk/scripts/latlong.html                                --*/
/*----------------------------------------------------------------------------------------------*/

/**
 * Creates a LatLon point on the earth's surface at the specified latitude / longitude.
 *
 * @classdesc Tools for geodetic calculations
 * @requires Geo
 *
 * @constructor
 * @param {number} lat - Latitude in degrees.
 * @param {number} lon - Longitude in degrees.
 * @param {number} [height=0] - Height above mean-sea-level in kilometres.
 * @param {number} [radius=6371] - (Mean) radius of earth in kilometres.
 *
 * @example
 *     var p1 = new LatLon(52.205, 0.119);
 */
export default function LatLon(lat, lon, height, radius) {
  // allow instantiation without 'new'
  if (!(this instanceof LatLon)) { return new LatLon(lat, lon, height, radius); }

  if (typeof height === 'undefined') { height = 0; }
  if (typeof radius === 'undefined') { radius = 6371; }
  radius = Math.min(Math.max(radius, 6353), 6384);

  this.lat = Number(lat);
  this.lon = Number(lon);
  this.height = Number(height);
  this.radius = Number(radius);
}


/**
 * Returns the distance from 'this' point to destination point (using haversine formula).
 *
 * @param   {LatLon} point - Latitude/longitude of destination point.
 * @returns {number}
 Distance between this point and destination point, in km (on sphere of 'this' radius).
 *
 * @example
 *     var p1 = new LatLon(52.205, 0.119), p2 = new LatLon(48.857, 2.351);
 *     var d = p1.distanceTo(p2); // d.toPrecision(4): 404.3
 */
LatLon.prototype.distanceTo = function distanceTo(point) {
  const R = this.radius;
  const phi1 = this.lat.toRadians();
  const lambda1 = this.lon.toRadians();
  const phi2 = point.lat.toRadians();
  const lambda2 = point.lon.toRadians();
  const Deltaphi = phi2 - phi1;
  const Deltalambda = lambda2 - lambda1;

  const a = (Math.sin(Deltaphi / 2) * Math.sin(Deltaphi / 2)) +
        (Math.cos(phi1) * Math.cos(phi2) *
        Math.sin(Deltalambda / 2) * Math.sin(Deltalambda / 2));
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  const d = R * c;

  return d;
};
/**
 * Returns the area of a polygon using the Simpson's law
 * @param {[LatLon]} points - Array of polygon points
 * @returns {number} Polygon's area
 */
LatLon.prototype.calculateSurface = function calculateSurface(points) {
  const minmax = this.calculateBoundingBox(points);
  const minPoint = minmax[0];
  // var maxPoint = minmax[1];
  const localPoints = [];
  points.forEach((point) => {
    const localPoint = new LatLon(0, 0);
    localPoint.lat = minPoint.distanceTo(new LatLon(point.lat, minPoint.lon));
    localPoint.lon = minPoint.distanceTo(new LatLon(minPoint.lat, point.lon));
    localPoints.push(localPoint);
  });

  let area = this.getDeterminant(localPoints[localPoints.length - 1], localPoints[0]);

  for (let i = 1; i < localPoints.length; i += 1) {
    area += this.getDeterminant(localPoints[i - 1], localPoints[i]);
  }
  return Math.abs(area / 2);
};

/**
 * Return de determinanat of two givent points (helper function for calculateSurface())
 * @param point1
 * @param point2
 * @returns {number}
 */
LatLon.prototype.getDeterminant = (point1, point2) =>
  (point1.lon * point2.lat) - (point2.lon * point1.lat);

/**
 * Return  the boundingBox of a array of points
 * @param {[LatLon]} points
 * @returns {*[LatLon]} - Two points, minimum and maximum
 */
LatLon.prototype.calculateBoundingBox = (points) => {
  let latMin = Number.MAX_VALUE;
  let lonMin = Number.MAX_VALUE;
  let latMax = -Number.MAX_VALUE;
  let lonMax = -Number.MAX_VALUE;
  points.forEach((point) => {
    if (point.lat < latMin) { latMin = point.lat; }
    if (point.lon < lonMin) { lonMin = point.lon; }
    if (point.lat > latMax) { latMax = point.lat; }
    if (point.lon > lonMax) { lonMax = point.lon; }
  });

  const pointMin = new LatLon(latMin, lonMin);
  const pointMax = new LatLon(latMax, lonMax);
  return [pointMin, pointMax];
};


/**
 * Returns the point of intersection of two paths defined by point and bearing.
 *
 * @param   {LatLon} p1 - First point.
 * @param   {number} brng1 - Initial bearing from first point.
 * @param   {LatLon} p2 - Second point.
 * @param   {number} brng2 - Initial bearing from second point.
 * @returns {LatLon} Destination point (null if no unique intersection defined).
 *
 * @example
 *     var p1 = LatLon(51.8853, 0.2545), brng1 = 108.547;
 *     var p2 = LatLon(49.0034, 2.5735), brng2 =  32.435;
 *     var pInt = LatLon.intersection(p1, brng1, p2, brng2);
 // pInt.toString(): 50.9076�N, 004.5084�E
 */
LatLon.intersection = (p1, brng1, p2, brng2) => {
  // see http://williams.best.vwh.net/avform.htm#Intersection

  const phi1 = p1.lat.toRadians();
  const lambda1 = p1.lon.toRadians();
  const phi2 = p2.lat.toRadians();
  const lambda2 = p2.lon.toRadians();
  const theta13 = Number(brng1).toRadians();
  const theta23 = Number(brng2).toRadians();
  const Deltaphi = phi2 - phi1;
  const Deltalambda = lambda2 - lambda1;

  const delta12 = 2 * Math.asin(Math.sqrt((Math.sin(Deltaphi / 2) * Math.sin(Deltaphi / 2)) +
            (Math.cos(phi1) *
              Math.cos(phi2) *
              Math.sin(Deltalambda / 2) *
              Math.sin(Deltalambda / 2))));
  if (delta12 === 0) { return null; }

  // initial/final bearings between points
  let theta1 = Math.acos((Math.sin(phi2) - (Math.sin(phi1) * Math.cos(delta12))) /
        (Math.sin(delta12) * Math.cos(phi1)));
  if (Number.isNaN(theta1)) { theta1 = 0; } // protect against rounding
  const theta2 = Math.acos((Math.sin(phi1) - (Math.sin(phi2) * Math.cos(delta12))) /
        (Math.sin(delta12) * Math.cos(phi2)));

  let theta12;
  let theta21;
  if (Math.sin(lambda2 - lambda1) > 0) {
    theta12 = theta1;
    theta21 = (2 * Math.PI) - theta2;
  } else {
    theta12 = (2 * Math.PI) - theta1;
    theta21 = theta2;
  }

  const alpha1 = (((theta13 - theta12) + Math.PI) % (2 * Math.PI)) - Math.PI; // angle 2-1-3
  const alpha2 = (((theta21 - theta23) + Math.PI) % (2 * Math.PI)) - Math.PI; // angle 1-2-3

  if (Math.sin(alpha1) === 0 && Math.sin(alpha2) === 0) { return null; } // infinite intersections
  // if (Math.sin(alpha1)*Math.sin(alpha2) < 0) return null;
  // comentado por LIM
  // ambiguous intersection

  // alpha1 = Math.abs(alpha1);
  // alpha2 = Math.abs(alpha2);
  // ... Ed Williams takes abs of alpha1/alpha2, but seems to break calculation?

  const alpha3 = Math.acos((-Math.cos(alpha1) * Math.cos(alpha2)) +
        (Math.sin(alpha1) * Math.sin(alpha2) * Math.cos(delta12)));
  const delta13 = Math.atan2(
    Math.sin(delta12) * Math.sin(alpha1) * Math.sin(alpha2),
    Math.cos(alpha2) + (Math.cos(alpha1) * Math.cos(alpha3)),
  );
  const phi3 = Math.asin((Math.sin(phi1) * Math.cos(delta13)) +
        (Math.cos(phi1) * Math.sin(delta13) * Math.cos(theta13)));
  const Deltalambda13 = Math.atan2(
    Math.sin(theta13) * Math.sin(delta13) * Math.cos(phi1),
    Math.cos(delta13) - (Math.sin(phi1) * Math.sin(phi3)),
  );
  let lambda3 = lambda1 + Deltalambda13;
  lambda3 = ((lambda3 + (3 * Math.PI)) % (2 * Math.PI)) - Math.PI; // normalise to -180..+180�

  return new LatLon(phi3.toDegrees(), lambda3.toDegrees());
};


/**
 * Returns the destination point from 'this' point having travelled the given distance on the
 * given initial bearing (bearing normally varies around path followed).
 *
 * @param   {number} brng - Initial bearing in degrees.
 * @param   {number} dist - Distance in km (on sphere of 'this' radius).
 * @returns {LatLon} Destination point.
 *
 * @example
 *     var p1 = new LatLon(51.4778, -0.0015);
 *     var p2 = p1.destinationPoint(300.7, 7.794); // p2.toString(): 51.5135�N, 000.0983�W
 */
LatLon.prototype.destinationPoint = function destinationPoint(brng, dist) {
  // see http://williams.best.vwh.net/avform.htm#LL

  const theta = Number(brng).toRadians();
  const delta = Number(dist) / this.radius; // angular distance in radians

  const phi1 = this.lat.toRadians();
  const lambda1 = this.lon.toRadians();

  const phi2 = Math.asin((Math.sin(phi1) * Math.cos(delta)) +
      (Math.cos(phi1) * Math.sin(delta) * Math.cos(theta)));
  let lambda2 = lambda1 + Math.atan2(
    Math.sin(theta) * Math.sin(delta) * Math.cos(phi1),
    Math.cos(delta) - (Math.sin(phi1) * Math.sin(phi2)),
  );
  lambda2 = ((lambda2 + (3 * Math.PI)) % (2 * Math.PI)) - Math.PI; // normalise to -180..+180�

  return new LatLon(phi2.toDegrees(), lambda2.toDegrees());
};

/**
 * Calculate the angle from this to the second pint in grades from 0 to
 * 360. 0 is the north
 * Funci�n duplicada con la siguiente 'bearingto', que es bastante m�s elegante
 * COmparar resultados y quedarnos con una
 * @param {LatLon} point
 * @returns {Number} from 0 to 360
 */
LatLon.prototype.calculateBearing = function calculateBearing(point) {
  const x1 = this.lon;
  const y1 = this.lat;
  const x2 = point.lon;
  const y2 = point.lat;
  const deltax = x2 - x1;
  const deltay = y2 - y1;

  let bearing;
  if (deltay !== 0) {
    bearing = (Math.atan(deltax / deltay) * 180) / Math.PI;
    // console.log(bearing);
    if (x2 > x1) {
      if (y2 > y1) {
        bearing = bearing;
      } else {
        bearing = 180 + bearing;
      }
    } else if (y2 > y1) {
      bearing = 360 + bearing;
    } else {
      bearing = 180 + bearing;
    }
  } else if (x1 > x2) {
    bearing = 270;
  } else {
    bearing = 90;
  }
  return bearing;
};

/**
 * Returns the (initial) bearing from 'this' point to destination point.
 *
 * @param   {LatLon} point - Latitude/longitude of destination point.
 * @returns {number} Initial bearing in degrees from north.
 *
 * @example
 *     var p1 = new LatLon(52.205, 0.119), p2 = new LatLon(48.857, 2.351);
 *     var b1 = p1.bearingTo(p2); // b1.toFixed(1): 156.2
 */
LatLon.prototype.bearingTo = function bearingTo(point) {
  const phi1 = this.lat.toRadians();
  const phi2 = point.lat.toRadians();
  const Deltalambda = (point.lon - this.lon).toRadians();

  // see http://mathforum.org/library/drmath/view/55417.html
  const y = Math.sin(Deltalambda) * Math.cos(phi2);
  const x = (Math.cos(phi1) * Math.sin(phi2)) -
        (Math.sin(phi1) * Math.cos(phi2) * Math.cos(Deltalambda));
  const theta = Math.atan2(y, x);

  return (theta.toDegrees() + 360) % 360;
};

/**
 * Returns the midpoint between 'this' point and the supplied point.
 *
 * @param   {LatLon} point - Latitude/longitude of destination point.
 * @returns {LatLon} Midpoint between this point and the supplied point.
 *
 * @example
 *     var p1 = new LatLon(52.205, 0.119), p2 = new LatLon(48.857, 2.351);
 *     var pMid = p1.midpointTo(p2); // pMid.toString(): 50.5363�N, 001.2746�E
 */
LatLon.prototype.midpointTo = function midpointTo(point) {
  // see http://mathforum.org/library/drmath/view/51822.html for derivation

  const phi1 = this.lat.toRadians();
  const lambda1 = this.lon.toRadians();
  const phi2 = point.lat.toRadians();
  const Deltalambda = (point.lon - this.lon).toRadians();

  const Bx = Math.cos(phi2) * Math.cos(Deltalambda);
  const By = Math.cos(phi2) * Math.sin(Deltalambda);

  const phi3 = Math.atan2(
    Math.sin(phi1) + Math.sin(phi2),
    Math.sqrt(((Math.cos(phi1) + Bx) * (Math.cos(phi1) + Bx)) + (By * By)),
  );
  let lambda3 = lambda1 + Math.atan2(By, Math.cos(phi1) + Bx);
  lambda3 = ((lambda3 + (3 * Math.PI)) % (2 * Math.PI)) - Math.PI; // normalise to -180..+180�

  return new LatLon(phi3.toDegrees(), lambda3.toDegrees());
};

/**
 * Return true if the curve formed by the points is clockWise
 * link http://stackoverflow.com/questions/1165647/how-to-determine-if-a-list-of-polygon-points-are-in-clockwise-order
 * @param {[LatLon]} points
 * @returns {boolean}
 */
LatLon.prototype.clockwise = (points) => {
  let accumulatedValue = 0;
  for (let i = 0; i < points.length - 1; i += 1) {
    const diffLat = points[i + 1].lat + points[i].lat;
    const diffLon = points[i + 1].lon - points[i].lon;
    const result = diffLat * diffLon;
    accumulatedValue += result;
  }
  if (accumulatedValue > 0) {
    return true;
  }

  return false;
};

/**
 * Returns the polygon points in clockWise order.
 * @param points
 * @returns {points}- Points in clockwise order
 */
LatLon.prototype.returnedClockwise = function returnedClockwise(points) {
  if (this.clockwise(points) === false) {
    const tempPoints = [];
    const num = points.length - 1;
    for (let i = 0; i < num + 1; i += 1) {
      const temp = points[num - i];
      tempPoints[i] = temp;
    }
    return tempPoints;
  }
  return points;
};

/**
 * Return the closest point from this
 * @param {[LatLon]} points - Array of points
 * @returns {LatLon} - The closest point
 */
LatLon.prototype.closestPoint = function closestPoint(points) {
  let minDistance = Number.MAX_VALUE;
  let selectedPoint = null;
  const parent = this;
  points.forEach((point) => {
    const distance = parent.distanceTo(point);
    if (distance < minDistance) {
      minDistance = distance;
      selectedPoint = point;
    }
  });
  return selectedPoint;
};

LatLon.prototype.furthestPoint = function furthestPoint(points) {
  let maxDistance = Number.MIN_VALUE;
  let selectedPoint = null;
  const parent = this;
  points.forEach((point) => {
    const distance = parent.distanceTo(point);
    if (distance > maxDistance) {
      maxDistance = distance;
      selectedPoint = point;
    }
  });
  return selectedPoint;
};

/**
 * Find the intersection point of two segments if not returns null
 * @param {LatLon} start1 -  Point 1 Line 1
 * @param {LatLon} end1 - Point 2 Line 1
 * @param {LatLon} start2 - Point 1 Line 2
 * @param {LatLon} end2 - Point 2 line 2
 * @returns {LatLon} - intersection point
 */
LatLon.prototype.findLineIntersection = (start1, end1, start2, end2) => {
  const denom = (
    (end1.lon - start1.lon) * (end2.lat - start2.lat)) -
    ((end1.lat - start1.lat) * (end2.lon - start2.lon)
    );
  //  AB & CD are parallel
  if (denom === 0) {
    return null;
  }
  const numer = (
    (start1.lat - start2.lat) * (end2.lon - start2.lon)) -
    ((start1.lon - start2.lon) * (end2.lat - start2.lat)
    );

  const r = numer / denom;
  const numer2 = (
    (start1.lat - start2.lat) * (end1.lon - start1.lon)) -
    ((start1.lon - start2.lon) * (end1.lat - start1.lat)
    );

  const s = numer2 / denom;
  if ((r < 0 || r > 1) || (s < 0 || s > 1)) {
    return null;
  }
  // Find intersection point
  const lat = start1.lat + (r * (end1.lat - start1.lat));
  const lon = start1.lon + (r * (end1.lon - start1.lon));
  const point = new LatLon(lat, lon);
  return point;
};

/**
 * Calculate the slope (pendiente o m) of a line acordinf wtih the formula
 * y = mx +b
 *
 * where m = deltaY / deltaX = y2-y1 / x2-x1
 * @param point {LatLon} as the second point
 * @returns {Number} slope (m)
 */
LatLon.prototype.calculateSlope = function calculateSlope(point) {
  return (point.lat - this.lat) / (point.lon - this.lon);
};

/** calculate the intercept (intercepto o b) of a line
 * y = mx +b
 * then
 * b = y -mx
 * @param point
 */
LatLon.prototype.calculateIntercept = function calculateIntercept(point) {
  const m = this.calculateSlope(point);
  return point.lat - (m * point.lon);
};

/**
 * Return an array of pair of coordinates (lat,lom) to store in database
 * @param {[LatLon]}points
 * @returns {[number,number]}
 */
LatLon.prototype.latLonToCoorsArray = (points) => {
  const arr = [];
  points.forEach((point) => {
    const element = [point.lat, point.lon];
    arr.push(element);
  });
  return arr;
};
/**
 * Return an array of LatLon Elments from simple pair of coordinates (lat, lon)
 * @param {[number,number]} - coors
 * @returns {[LatLon]}
 * @constructor
 */
LatLon.prototype.coorsArrayToLatLon = (coors) => {
  const arr = [];
  coors.forEach((coor) => {
    const latL = new LatLon(coor[0], coor[1]);
    arr.push(latL);
  });
  return arr;
};
/**
 * Convert an Array of objects with lat lon properties to LatLon
 * @param coors
 * @returns {Array}
 */
LatLon.prototype.pointsToLatLon = (coors) => {
  const arr = [];
  coors.forEach((coor) => {
    const latL = new LatLon(coor.lat, coor.lng);
    arr.push(latL);
  });
  return arr;
};

/**
 * Acepts an object type ol.geom.geometry and returns an array of LatLon points
 * @param {ol.geom.gemetry} geometry
 * @returns {[LatLon]}
 * @constructor
 */
LatLon.prototype.convertOL3ToPoints = (geometry) => {
  const points = [];
  if (geometry.getType() === 'Point') {
    const coors = geometry.getCoordinates();
    const point = new LatLon(coors[1], coors[0]);
    points.push(point);
  }
  if (geometry.getType() === 'LineString') {
    geometry.getCoordinates().forEach((coors) => {
      const point = new LatLon(coors[1], coors[0]);
      points.push(point);
    });
  }
  if (geometry.getType() === 'Polygon') {
    geometry.getCoordinates().forEach((geo2) => {
      geo2.forEach((coors) => {
        const point = new LatLon(coors[1], coors[0]);
        points.push(point);
      });
    });
  }
  return points;
};


/** Extend Number object with method to convert numeric degrees to radians */
if (typeof Number.prototype.toRadians === 'undefined') {
  Number.prototype.toRadians = function toRadians() { return (this * Math.PI) / 180; };
}


/** Extend Number object with method to convert radians to numeric (signed) degrees */
if (typeof Number.prototype.toDegrees === 'undefined') {
  Number.prototype.toDegrees = function toDegrees() { return (this * 180) / Math.PI; };
}

// Removes an element from an array.
// String value: the value to search and remove.
// return: an array with the removed element; false otherwise.
Array.prototype.remove = function remove(value) {
  const idx = this.indexOf(value);
  if (idx !== -1) {
    return this.splice(idx, 1); // The second parameter is the number of elements to remove.
  }
  return false;
};


/* - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -  */
if (typeof module !== 'undefined' && module.exports) { module.exports = LatLon; } // CommonJS
if (typeof define === 'function' && define.amd) { define(['Geo'], () => LatLon); } // AMD
