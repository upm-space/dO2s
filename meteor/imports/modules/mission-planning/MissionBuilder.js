import LatLon from './GeoHelper';

/**
 * Created by luis on 05/12/14.
 * depends of GeoHelper.js and Open Layers (V3)
 */

/*
export default function MissionBuilder(mission) {
  this.mission = mission;
  this.camera = mission.camera;
}
*/

export default class MissionBuilder {
  constructor(mission) {
    this.mission = mission;
    this.camera = mission.camera;
  }

  /*
  Returns picture width in meters
  */
  getPictureWidth() {
    const mwm = (this.camera.MatrixWidth / 10000); /* Matrix Width in meters */
    const { altitude } = this.mission;
    const fm = (this.camera.Focal / 10000); /* focal in meters */
    return ((mwm * altitude) / fm).toFixed(2);
  }

  /*
   Returns the picture height in meters, using the filght height of the UAV and the focal sensor
   */
  getPictureHeight() {
    const mhm = (this.camera.MatrixHeight / 10000); /* matrix height in meters */
    const { altitude } = this.mission;
    const fm = (this.camera.Focal / 10000); /* focal in meters */
    return ((mhm * altitude) / fm).toFixed(2);
  }

  /*
   Returns the spatial resolution in cm/pix, using the flight height of the UAV,
   focal and sensor width
   */
  getPictureResolution() {
    const pwcm = (this.getPictureWidth() * 100); /* pixel width in centimeters */
    return (pwcm / this.camera.PixelWidth).toFixed(2);
  }

  /*
   Returns the width of the picture in meters taking out the sidelap
   */
  getPictureWidthWithSidelap() {
    const sidelap = (this.mission.sidelap * 0.01);
    return (this.getPictureWidth() - (this.getPictureWidth() * sidelap)).toFixed(2);
  }

  /*
   Returns the width of the picture in meters taking out the overlap
   */
  getPictureHeightWithOverlap() {
    const overlap = (this.mission.overlap * 0.01);
    return (this.getPictureHeight() - (this.getPictureHeight() * overlap)).toFixed(2);
  }

  /*
   Returns the time to shoot between pictures in seconds
   */
  getPictureShootTime() {
    return (this.getPictureHeightWithOverlap() / this.mission.flightSpeed).toFixed(2);
  }

  /*
   Returns a JSON with the variables of the Mission
   */
  getFlightVariables() {
    return {
      pictureWidth: this.getPictureWidth(),
      pictureHeight: this.getPictureHeight(),
      pictureResolution: this.getPictureResolution(),
      pictureWidthWithSidelap: this.getPictureWidthWithSidelap(),
      pictureHeightWithOverlap: this.getPictureHeightWithOverlap(),
      pictureShootTime: this.getPictureShootTime(),
      // surface : this.mission.surface,
      resolution: this.getPictureResolution(),
      flightTime: this.mission.flightTime,
      flightTimeInMinutes: this.mission.flightTimeMinutes,
      pathLength: this.mission.pathLength,
    };
  }

  /**
   * Method to build a surface mission taken the arguments given in this.mission and camera.
   * This method calls To cutGrid method
   * @returns {[[[LatLon]]]} two array of lines the first one has the waypoints and the second one
   * has the intersect lines where the the picture has to be taken.
   */
  calculateGrid(/* missionSide */) {
    // if(missionSide)this.mission.initialSegment = missionSide;
    // var parameters = this.getFlightVariables();

    this.mission.timePics = this.getPictureShootTime();
    this.mission.distPics = this.getPictureHeightWithOverlap();
    this.mission.resolution = this.getPictureResolution();
    this.mission.shootTime = this.getPictureShootTime();
    this.mission.flightTime = 0;
    this.mission.numberPics = '0';

    let distance = this.getPictureWidthWithSidelap() * 0.001;
    const helper = new LatLon(0, 0);
    let points = helper.pointsToLatLon(this.mission.boundaries);
    points = helper.returnedClockwise(points);
    this.mission.totalArea = (helper.calculateSurface(points) * 100).toFixed(2);
    // this.mission.resolution = parameters.pictureResolution;

    let minVal = 0;
    let LargestSegment = -1;

    if (this.mission.initialSegment > 0) {
      LargestSegment = this.mission.initialSegment - 1;
    } else {
      for (let i = 0; i < points.length - 1; i += 1) {
        const dist = points[i].distanceTo(points[i + 1]);
        if (dist > minVal) {
          minVal = dist;
          LargestSegment = i;
        }
      }
    }

    /* calculate waypoints */
    let bearingToPoint = null;
    if (this.mission.boundaries === LargestSegment - 1) {
      // if is the last point them bearing to initial point of the polygon
      [bearingToPoint] = points;
    } else {
      bearingToPoint = points[LargestSegment + 1];
    }
    let bearing = points[LargestSegment].bearingTo(bearingToPoint);

    if (!helper.clockwise(points)) {
      bearing += 180;
    }
    let midPoint = points[LargestSegment].midpointTo(points[LargestSegment + 1]);
    const perpendicularBearing = bearing + 90;
    const bbox = helper.calculateBoundingBox(points);
    const minPoint = bbox[0];
    const maxPoint = bbox[1];
    const diagDist = minPoint.distanceTo(maxPoint);
    let numberOfSegments = diagDist / distance;
    const lines = [];
    for (let k = 0; k <= numberOfSegments; k += 1) {
      let deltaInit = 0;
      // we move 20 cm the first line to force cutting with the other perpendiculars
      if (k === 0) { deltaInit = 0.0002; }
      const segmentDistance = (distance * k) + deltaInit;
      const projectedMidPoint = midPoint.destinationPoint(perpendicularBearing, segmentDistance);
      const p1 = projectedMidPoint.destinationPoint(bearing, diagDist);
      const p2 = projectedMidPoint.destinationPoint(bearing + 180, diagDist);
      lines.push([p1, p2]);
    }
    /* now we calculate the intersections for the pictures
       * we keep the variables perpendicularBearing, bbox, minPoint, maxPoint and diagDist
       */
    // Uff Cuidado con este cálculo ¿no es WidthWithSidelap?
    distance = this.getPictureHeightWithOverlap() * 0.001;
    numberOfSegments = diagDist / distance;

    // aseguramos las formas que sean muy irregulares
    midPoint = minPoint.destinationPoint(bearing - 180, diagDist);
    bearing = points[LargestSegment].bearingTo(points[LargestSegment + 1]);

    const Picslines = [];
    for (let k = 0; k <= numberOfSegments * 2; k += 1) {
      let deltaInit = 0;
      // move 20 cm the first line to force cutting with the other perpendiculars
      if (k === 0) { deltaInit = 0.0002; }
      const segmentDistance = (distance * k) + deltaInit;
      const projectedMidPoint = midPoint.destinationPoint(bearing, segmentDistance);
      const p1 = projectedMidPoint.destinationPoint(perpendicularBearing, diagDist);
      const p2 = projectedMidPoint.destinationPoint(perpendicularBearing + 180, diagDist);
      Picslines.push([p1, p2]);
    }

    // cut the way point with the boundaries
    const cutLines = this.cutGrid(lines, this.mission.boundaries);
    // cut the picture lines with the previous boundixbox
    const cutPicLines = this.cutGrid(Picslines, this.mission.boundaries);

    this.mission.points = cutLines;
    this.mission.pictures = cutPicLines;

    return [cutLines, cutPicLines, bearing];
  }

  /**
   * This method is called directly by calculateGrid Method and cut the lines which are
   * inside the polygon of the mission.
   * This method is complemented by buildPolyline
   * @param {[[LatLon]]} lines - Array of lines with points
   * @returns {[[LatLon]]} - Array lines with points
   */
  cutGrid(lines, boundaries) {
    // ensure the last coordinate is the first of the polygon
    if (boundaries[0].lat !== boundaries[boundaries.length - 1].lat
          || boundaries[0].lng !== boundaries[boundaries.length - 1].lng) {
      boundaries.push(boundaries[0]);
    }
    const helper = new LatLon(0, 0);
    // var mm = this.mission;
    const toRemove = [];
    lines.forEach((line) => {
      let p1 = null;
      let p2 = null;
      // for(var i = 0; i< mm.boundaries.length - 1;i++){
      //    var segmentP1 = new LatLon(mm.boundaries[i].lat,mm.boundaries[i].lon);
      //    var segmentP2 = new LatLon(mm.boundaries[i + 1].lat,mm.boundaries[i +1].lon);
      for (let i = 0; i < boundaries.length - 1; i += 1) {
        const segmentP1 = new LatLon(boundaries[i].lat, boundaries[i].lng);
        const segmentP2 = new LatLon(boundaries[i + 1].lat, boundaries[i + 1].lng);
        const result = helper.findLineIntersection(line[0], line[1], segmentP1, segmentP2);
        if (result != null) {
          if (p1 == null) {
            p1 = result;
          } else if (p2 == null) {
            p2 = result;
            break;
          }
        }
      }
      if (p1 != null && p2 != null) {
        line[0] = p1; // eslint-disable-line
        line[1] = p2; // eslint-disable-line
      } else {
        toRemove.push(line);
        // lines.remove(line);
      }
    });
    toRemove.forEach((item) => {
      lines.remove(item);
    });

    return lines;
  }

  /**
   * Build a linear mission taken the arguments given in this.mission and camera.
   * This method is complemented by builPolyline.
   * @returns {[[LatLon]]} - Array of lines with and array of points (LatLon)
   */
  calculateBuffer() {
    const parameters = this.getFlightVariables();
    const distance = parameters.pictureWidthWithSidelap * 0.001;
    const helper = new LatLon(0, 0);
    const points = helper.pointsToLatLon(this.mission.boundaries);
    // var points = helper.coorsArrayToLatLon(this.mission.boundaries);
    this.mission.surface = 0;
    for (let k = 0; k < points.length - 1; k += 1) {
      this.mission.surface += points[k].distanceTo(points[k + 1]);
    }
    this.mission.surface = this.mission.surface.toFixed(2);
    this.mission.resolution = parameters.pictureResolution;
    this.mission.shootTime = parameters.pictureShootTime;
    this.mission.timePics = parameters.pictureShootTime;
    this.mission.distPics = parameters.pictureHeightWithOverlap;
    if (this.mission.buffer === 0) {
      return [points];
    }
    const lines = Math.floor((this.mission.buffer * 0.001) / distance);


    if (lines === 0) {
      this.mission.points = [points];
      return [points];
    }

    const segments = [];
    const distances = [];
    // var plines = []; //perpendicular lines
    for (let j = 0; j <= lines; j += 1) {
      distances.push((distance * j) - (distance * (lines / 2)));
    }
    for (let i = 0; i < points.length; i += 1) {
      let bearing = 0;
      let middlePoint = null;
      if (i < points.length - 1) {
        bearing = points[i].bearingTo(points[i + 1]);
        middlePoint = points[i].midpointTo(points[i + 1]);
      } else {
        bearing = segments[segments.length - 1].bearing;
      }

      const item = {
        bearing,
        middlePopint: middlePoint,
        projectedPoins: [],
        cutPoints: [],
      };
      // var  item = [bearing,middlePoint];

      for (let jj = 0; jj <= lines; jj += 1) {
        let projectedPoint = null;
        let projectedDistance = distances[jj];
        let projectedBearing = bearing;
        if (projectedDistance < 0) {
          projectedBearing = bearing - 90;
          projectedDistance = Math.abs(projectedDistance);
        } else {
          projectedBearing = bearing + 90;
        }

        if (i === 0) {
          projectedPoint = points[0].destinationPoint(projectedBearing, projectedDistance);
          item.projectedPoins.push(projectedPoint);
          item.cutPoints.push(projectedPoint);
        }
        if (i > 0 && i < points.length - 1) {
          projectedPoint = middlePoint.destinationPoint(projectedBearing, projectedDistance);
          item.projectedPoins.push(projectedPoint);
          const previousItem = segments[i - 1];
          const previousProjectedPoint = previousItem.projectedPoins[jj];
          const previousBearing = previousItem.bearing;
          const cutPoint = LatLon.intersection(
            projectedPoint, bearing,
            previousProjectedPoint, previousBearing,
          );
          item.cutPoints.push(cutPoint);
        }
        if (i === points.length - 1) {
          projectedPoint =
          points[points.length - 1].destinationPoint(projectedBearing, projectedDistance);
          item.projectedPoins.push(projectedPoint);
          item.cutPoints.push(projectedPoint);
        }
      }
      segments.push(item);
    }
    const Arrlines = [];
    for (let ij = 0; ij <= lines; ij += 1) {
      const line = [];
      Arrlines.push(line);
    }
    segments.forEach((segment) => {
      let i = 0;
      segment.cutPoints.forEach((point) => {
        Arrlines[i].push(point);
        i += 1;
      });
    });
    this.mission.points = Arrlines;
    return Arrlines;
  }

  /**
   * Method that build the mission
   * @param {LatLon} takeoff - Take off point where the mission will start
   * @param {[[LatLon]]}lines array of lines with points
   * @returns {[LatLon]} points. Array of points ordered having in mind the takeOff point
   */
  buildPolyline(takeoff, lines) {
    // var takeoff = new LatLon(0,0);
    const lenLine = lines[0].length - 1;
    const arrL = lines.length - 1;
    // para la opción más cercana
    let closestPoint = takeoff.closestPoint([lines[0][0],
      lines[0][lenLine], lines[arrL][0], lines[arrL][lenLine]]);
    // para la opción más lejana
    // var closestPoint =
    // takeoff.furthestPoint([lines[0][0],lines[0][lenLine],lines[arrL][0],lines[arrL][lenLine]]);
    let up = true;
    const points = [];

    if (arrL !== 0) {
      if (closestPoint === lines[0][0]) {
        lines[0].forEach((point) => {
          points.push(point);
        });
      }
      if (closestPoint === lines[0][lenLine]) {
        lines[0].reverse();
        lines[0].forEach((point) => {
          points.push(point);
        });
      }
      if (closestPoint === lines[arrL][0]) {
        lines[arrL].forEach((point) => {
          points.push(point);
        });
        up = false;
      }
      if (closestPoint === lines[arrL][lenLine]) {
        lines[arrL].reverse();
        lines[arrL].forEach((point) => {
          points.push(point);
        });
        up = false;
      }
      closestPoint = points[points.length - 1];
      let closestPoint2 = null;
      if (up) {
        for (let i = 1; i <= arrL; i += 1) {
          closestPoint2 = closestPoint.closestPoint([lines[i][0], lines[i][lenLine]]);
          if (lines[i][0] === closestPoint2) {
            lines[i].forEach((point) => {
              points.push(point);
            });
            closestPoint = lines[i][lenLine];
          } else {
            [closestPoint] = lines[i];
            lines[i].reverse();
            lines[i].forEach((point) => {
              points.push(point);
            });
          }
        }
      } else {
        for (let ii = arrL - 1; ii >= 0; ii -= 1) {
          closestPoint2 = closestPoint.closestPoint([lines[ii][0], lines[ii][lenLine]]);
          if (lines[ii][0] === closestPoint2) {
            lines[ii].forEach((point) => {
              points.push(point);
            });
            closestPoint = lines[ii][lenLine];
          } else {
            [closestPoint] = lines[ii];
            lines[ii].reverse();
            lines[ii].forEach((point) => {
              points.push(point);
            });
          }
        }
      }
    } else { // if(arrL==0
      const line = lines[0];
      line.forEach((point) => {
        points.push(point);
      });
    }

    // var coors = [];

    this.mission.pathLength = 0;
    for (let i3 = 0; i3 < points.length; i3 += 1) {
      // coors.push([points[i].lon,points[i].lat]);
      if (i3 < points.length - 1) {
        this.mission.pathLength += points[i3].distanceTo(points[i3 + 1]);
      }
    }
    this.mission.pathLength = (this.mission.pathLength).toFixed(2);
    // this.mission.flightTime = (this.mission.totalLenght/this.mission.flightSpeed).toFixed(0);
    const flightTIme = ((this.mission.pathLength * 1000) / this.mission.flightSpeed).toFixed(0);
    this.mission.flightTimeMinutes = flightTIme;
    let minutesStr = (Math.floor(flightTIme / 60)).toString();
    let secondsStr = (flightTIme - ((Math.floor(flightTIme / 60)) * 60)).toString();
    if (minutesStr.length === 1) { minutesStr = `0${minutesStr}`; }
    if (secondsStr.length === 1) { secondsStr = `0${secondsStr}`; }
    this.mission.flightTime = `${minutesStr}:${secondsStr}`;

    return points;
  }

  /**
   *
   * */

  cutLines(lines1, lines2) {
    const helper = new LatLon(0, 0);
    let ii = 0;
    const linesResult = [];
    lines1.forEach((line1) => {
      ii += 1;
      const p = [];
      let p1 = null;
      let p2 = null;
      for (let i = 0; i < lines2.length; i += 1) {
        const result = helper.findLineIntersection(line1[0], line1[1], lines2[i][0], lines2[i][1]);
        p[i] = result;
        if (result != null) {
          if (p1 == null) {
            p1 = result;
          } else if (p2 == null) {
            p2 = result;
          }
        }
      }

      linesResult[ii] = p;
    });

    return linesResult;
  }

  calculatePhotoCenter() {
    const waypointsAndPictures = this.calculateGrid();
    const cutLines = waypointsAndPictures[0];
    const cutPicLines = waypointsAndPictures[1];
    const bearing = waypointsAndPictures[2];

    const photoCentersTemp = this.cutLines(cutPicLines, cutLines);
    const photoCenters = [];
    let pointTemp = [];

    function temp(points) {
      points.forEach((point) => {
        point.forEach((latlon) => {
          if (latlon != null) {
            pointTemp.push(latlon);
          }
        });
        photoCenters.push(pointTemp);
        pointTemp = [];
      });
      return photoCenters;
    }

    temp(photoCentersTemp);
    return [photoCenters, bearing];
  }

  buildWaypoints() {
    // waypointstypes

    const wpToff = 1;
    const wpLanding = 2;
    const wpStartPic = 3;
    const wpStopPic = 4;
    const wpNewPosition = 5;
    this.mission.waypoints = [];
    const { points } = this.mission;
    const toff = this.mission.dataTOff;
    const landing = this.mission.dataLanding;

    // calculate positive and negative bearing
    const pt1 = new LatLon(points[0].lat, points[0].lon);
    const pt2 = new LatLon(points[1].lat, points[1].lon);
    const positiveBearing = pt1.bearingTo(pt2);
    const negativeBearing = pt2.bearingTo(pt1);

    // let wpTOFF =
    // {key:this.generateUUID(),
    // lng:toff.lng,lat:toff.lat,alt:0,type:wpToff,param1:0,param2:0,param3:0};
    // let wpTOFF = this.generateWaypoint(toff.lng,toff.lat,0,wpToff);
    const wpTOFF = this.generateWaypoint({
      lng: toff.lng,
      lat: toff.lat,
      altRelative: 50,
      type: wpToff,
    });

    this.mission.waypoints.push(wpTOFF);
    let i = 0;
    let takePic = true;
    let boolPositiveBearing = false;

    // apllied just for axes, not for surfaces
    const numberOfVertex = this.mission.boundaries.length;
    let vertexCounter = 0;

    for (i === 0; i < points.length; i += 1) {
      if (takePic) {
        const ptOrig = new LatLon(points[i].lat, points[i].lon);
        let bearing;
        if (boolPositiveBearing) {
          bearing = positiveBearing;
          boolPositiveBearing = false;
        } else {
          bearing = negativeBearing;
          boolPositiveBearing = true;
        }

        /* Parche para entidades lineales */
        if (this.mission.type === 'lineal' && vertexCounter === numberOfVertex === 0) {
          const pt1Line = new LatLon(
            points[numberOfVertex - 1].lat,
            points[numberOfVertex - 1].lon,
          );
          const pt2Line = new LatLon(
            points[numberOfVertex - 2].lat,
            points[numberOfVertex - 2].lon,
          );
          // const positiveBearingLine = pt1Line.bearingTo(pt2Line);
          const negativeBearingLine = pt2Line.bearingTo(pt1Line);
          if (boolPositiveBearing) {
            // bearing = positiveBearingLine;
            boolPositiveBearing = true;
          } else {
            bearing = negativeBearingLine;
            boolPositiveBearing = false;
          }
        }

        const ptProjected = ptOrig.destinationPoint(bearing, this.mission.entryMarging / 1000);
        const wpProjected = this.generateWaypoint({
          lng: ptProjected.lon,
          lat: ptProjected.lat,
          altRelative: this.mission.altitude,
          type: wpNewPosition,
        });

        const wpOrig = this.generateWaypoint({
          lng: ptOrig.lon,
          lat: ptOrig.lat,
          altRelative: this.mission.altitude,
          type: wpStartPic,
        });

        wpOrig.param2 = this.mission.distPics;

        if (this.mission.type === 'lineal') {
          if (vertexCounter <= 0) {
            this.mission.waypoints.push(wpProjected);
            takePic = false;
          }
        } else {
          this.mission.waypoints.push(wpProjected);
          takePic = false;
        }

        this.mission.waypoints.push(wpOrig);

        // with takePic =
        // true allways wil project an overshoot (waypoint exit and entry),
        // if takePic = false only will take the overshoot when exit
        // takePic = false;
      } else {
        // let wpOrig =
        // this.generateWaypoint({'lng':points[i].lon,'lat':points[i].lat,
        // 'altRelative':this.mission.altitude,'type':wpStopPic});
        // this.mission.waypoints.push(wpOrig);
        // takePic = true
        const ptOrig = new LatLon(points[i].lat, points[i].lon);
        let bearing;

        if (boolPositiveBearing) {
          bearing = positiveBearing;
          boolPositiveBearing = true;
        } else {
          bearing = negativeBearing;
          boolPositiveBearing = false;
        }

        /* Parche para entidades lineales */
        if (this.mission.type === 'lineal' && vertexCounter === numberOfVertex - 1) {
          const pt1Line = new LatLon(
            points[numberOfVertex - 2].lat,
            points[numberOfVertex - 2].lon,
          );
          const pt2Line = new LatLon(
            points[numberOfVertex - 1].lat,
            points[numberOfVertex - 1].lon,
          );
          const positiveBearingLine = pt1Line.bearingTo(pt2Line);
          // const negativeBearingLine = pt2Line.bearingTo(pt1Line);
          if (boolPositiveBearing) {
            bearing = positiveBearingLine;
            boolPositiveBearing = true;
          } else {
            // bearing = negativeBearingLine;
            boolPositiveBearing = false;
          }
        }


        const ptProjected = ptOrig.destinationPoint(bearing, this.mission.entryMarging / 1000);

        const wpProjected = this.generateWaypoint({
          lng: ptProjected.lon,
          lat: ptProjected.lat,
          altRelative: this.mission.altitude,
          type: wpNewPosition,
        });

        let wpOrig = this.generateWaypoint({
          lng: ptOrig.lon,
          lat: ptOrig.lat,
          altRelative: this.mission.altitude,
          type: wpStopPic,
        });

        if (this.mission.type === 'lineal' && vertexCounter < numberOfVertex - 1) {
          wpOrig = this.generateWaypoint({
            lng: ptOrig.lon,
            lat: ptOrig.lat,
            altRelative: this.mission.altitude,
            type: wpNewPosition,
          });
        }

        wpOrig.param2 = this.mission.distPics;
        this.mission.waypoints.push(wpOrig);

        if (this.mission.type === 'lineal') {
          if (vertexCounter === numberOfVertex - 1) {
            this.mission.waypoints.push(wpProjected);
            takePic = true;
          }
        } else {
          this.mission.waypoints.push(wpProjected);
          takePic = true;
        }


        // with takePic =
        // true allways wil project an overshoot (waypoint exit and entry),
        // if takePic = false only will take the overshoot when exit
        // takePic = true;
      }
      vertexCounter += 1;
      if (vertexCounter === numberOfVertex) {
        vertexCounter = 0;
      }
    }
    // let wpLANDING =
    // {key:this.generateUUID(),lng:landing.lng,lat:landing.lat,alt:0,
    // type:wpLanding,param1:0,param2:0,param3:0};
    // let wpLANDING =
    // this.generateWaypoint(landing.lng,landing.lat,this.mission.altitude,wpLanding);
    const wpLANDING = this.generateWaypoint({
      lng: landing.lng,
      lat: landing.lat,
      altRelative: 0,
      type: wpLanding,
    });

    this.mission.waypoints.push(wpLANDING);
  }

  /**
   * Function that returns a waypoint in json notation with a unique key
   * @param {{
                lng: number,
                lat: number,
                altRelative: number,
                altGround: number,
                altAbsolute: number,
                type: number,
                param1: number,
                param2: number,
                param3: number}}
   * @returns {{
                 key, lng: number,
                 lat: number,
                 altRelative: number,
                 altGround: number,
                 altAbsolute: number,
                 type: number,
                 param1: number,
                 param2: number,
                 param3: number}}
   */
  generateWaypoint(jsonParams) {
    const params = jsonParams;
    if (!params.lng)params.lng = 0;
    if (!params.lat)params.lat = 0;
    if (!params.altRelative)params.altRelative = 0;
    if (!params.altGround)params.altGround = 0;
    if (!params.altAbsolute)params.altAbsolute = 0;
    if (!params.type)params.type = 0;
    if (!params.param1)params.param1 = 0;
    if (!params.param2)params.param2 = 0;
    if (!params.param3)params.param3 = 0;
    return {
      key: this.generateUUID(),
      lng: params.lng,
      lat: params.lat,
      altRelative: params.altRelative,
      altGround: params.altGround,
      altAbsolute: params.altAbsolute,
      type: params.type,
      param1: params.param1,
      param2: params.param2,
      param3: params.param3,
    };
  }
  enumerateWayPoints() {
    let counterReal = 0; // contador real para el imu
    let counterMap = 0; // contador para pintar en el mapa
    this.mission.waypoints.forEach((wp) => {
      counterReal += 1;
      wp.param1 = counterReal;
      if (wp.type === 3 || wp.type === 4) {
        // the server script generates two waypoints when start/stop taking pictures
        counterReal += 1;
      }
      if (wp.type === 5) { // only enumerate on the map type 5 (new possition)
        counterMap += 1;
        wp.param3 = counterMap;
      } else {
        wp.param3 = '';
      }
    });
  }

  generateUUID() {
    let d = new Date().getTime();
    const uuid = 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, (c) => {
      const r = (d + (Math.random() * 16)) % 16 || 0;
      d = Math.floor(d / 16);
      return (c === 'x' ? r : (r && 0x3 || 0x8)).toString(16);
    });
    return uuid;
  }
}


/** *****************************************************************************
 * Building the mission
 */


/*
MissionBuilder.prototype.generateWaypoint = function(lng,lat,alt,type,param1,param2,param3){
    if(!lng)lng=0;
    if(!lat)lat=0;
    if(!alt)alt=0;
    if(!type)type=0;
    if(!param1)param1=0;
    if(!param2)param2=0;
    if(!param3)param3=0;
    return {key:this.generateUUID(),lng:lng,lat:lat,alt:alt,
    type:type,param1:param1,param2:param2,param3:param3};
}
*/
