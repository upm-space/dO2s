import LatLon from './GeoHelper.jsx';

/**
 * Created by luis on 05/12/14.
 * depends of GeoHelper.js and Open Layers (V3)
 */

/*jshint strict: false */
/*global LatLon:false */
/*jshint -W083 */ // con esto nos saltamos el warning de 4 loops (Don't make functions within a loop.)
export default function MissionBuilder(mission){
    this._mission = mission;
    this.camera = mission.camera;
}



/*****************************************************************************
 * flight parameters
 *****************************************************************************/
/*
 Camera data
 */
/*
 MissionBuilder.prototype.camera = {
 Model : 'Nikon D 5300',
 Focal : 35,
 PixelHeight : 4000,
 PixelWidth : 6000,
 MatrixHeight : 15.6,
 MatrixWidth : 23.5

 };
 */

 /*MissionBuilder.prototype.camera = {
 Model : 'Sony Next 7',
 Focal : 24,
 PixelHeight : 4000,
 PixelWidth : 6000,
 MatrixHeight : 15.6,
 MatrixWidth : 23.5

 };
 /*
MissionBuilder.prototype.camera = {
    Model : 'Sony Cyber-Shot DSC-S730',
    Focal : 35,
    PixelHeight : 2304,
    PixelWidth : 3072,
    MatrixHeight : 4.29,
    MatrixWidth : 5.76

};*/
/*
 Returns the picture width in meters, using the height of the UAV and the focal sensor
 */
MissionBuilder.prototype.getPictureWidth = function(){
    return (((this.camera.MatrixWidth/10000) * this._mission.altitude) / (this.camera.Focal/10000)).toFixed(2);
};

/*
 Returns the picture height in meters, using the filght height of the UAV and the focal sensor
 */
MissionBuilder.prototype.getPictureHeight = function(){
    return (((this.camera.MatrixHeight/10000) * this._mission.altitude) / (this.camera.Focal/10000)).toFixed(2);
};

/*
 Returns the spatial resolution in cm/pix, using the flight height of the UAV, focal and sensor width
 */
MissionBuilder.prototype.getPictureResolution = function(){
    return ((this.getPictureWidth()*100) / this.camera.PixelWidth).toFixed(2);
};

/*
 Returns the width of the picture in meters taking out the sidelap
 */
MissionBuilder.prototype.getPictureWidthWithSidelap = function(){
    return (this.getPictureWidth()-(this.getPictureWidth() * (this._mission.sidelap * 0.01))).toFixed(2);
};

/*
 Returns the width of the picture in meters taking out the overlap
 */
MissionBuilder.prototype.getPictureHeightWithOverlap = function(){
    return (this.getPictureHeight()-(this.getPictureHeight() * (this._mission.overlap * 0.01))).toFixed(2);
};
/*
 Returns the time to shoot between pictures in seconds
 */
MissionBuilder.prototype.getPictureShootTime = function(){
    return (this.getPictureHeightWithOverlap()/this._mission.flightSpeed).toFixed(2);
};

/*
 Returns a JSON with the variables of the Mission
 */
MissionBuilder.prototype.getFlightVariables = function(){
    return {
        pictureWidth : this.getPictureWidth(),
        pictureHeight : this.getPictureHeight(),
        pictureResolution : this.getPictureResolution(),
        pictureWidthWithSidelap : this.getPictureWidthWithSidelap(),
        pictureHeightWithOverlap : this.getPictureHeightWithOverlap(),
        pictureShootTime : this.getPictureShootTime(),
        //surface : this._mission.surface,
        resolution: this.getPictureResolution(),
        flightTime: this._mission.flightTime,
        flightTimeInMinutes: this._mission.flightTimeMinutes,
        pathLength: this._mission.pathLength
    };
};

/*******************************************************************************
 * Building the mission
 */

/**
 * Method to build a surface mission taken the arguments given in this._mission and camera.
 * This method calls To cutGrid method
 * @returns {[[[LatLon]]]} two array of lines the first one has the waypoints and the second one
 * has the intersect lines where the the picture has to be taken.
 */
MissionBuilder.prototype.calculateGrid = function(/*missionSide*/){
    //if(missionSide)this._mission.initialSegment = missionSide;
    //var parameters = this.getFlightVariables();

    this._mission.timePics = this.getPictureShootTime();
    this._mission.distPics = this.getPictureHeightWithOverlap();
    this._mission.resolution = this.getPictureResolution();
    this._mission.shootTime = this.getPictureShootTime();
    this._mission.flightTime = 0;
    this._mission.numberPics = "0";

    var distance =this.getPictureWidthWithSidelap() * 0.001;
    var helper = new LatLon(0,0);
    //var points = helper.ConvertOL3ToPoints(geo);
    //var points = helper.coorsArrayToLatLon(this._mission.boundaries);
    var points = helper.pointsToLatLon(this._mission.boundaries);
    points = helper.returnedClockwise(points);
    this._mission.totalArea = (helper.calculateSurface(points) * 100).toFixed(2);
    //this._mission.resolution = parameters.pictureResolution;

    var minVal = 0;
    var LargestSegment = -1;

    //if(this._mission.initialSegment > points.length){ //ensure not exceed the number of polygon sides
    //    let i= 0;
    //    //i = this._mission.initialSegment - (Math.floor(this._mission.initialSegment/points.length) * points.length);
    //    this._mission.initialSegment = this._mission.initialSegment - (Math.floor(this._mission.initialSegment/points.length) * points.length);
    //}
    if(this._mission.initialSegment > 0){
        LargestSegment = this._mission.initialSegment - 1;
    }
    else{
        for(var i = 0; i < points.length -1;i++){
            var dist = points[i].distanceTo(points[i + 1]);
            if(dist>minVal){
                minVal = dist;
                LargestSegment = i;
            }
        }
    }

    /* calculate waypoints */
    let bearingToPoint = null;
    if(this._mission.boundaries == LargestSegment - 1){
        bearingToPoint = points[0]; // if is the last point them bearing to initial point of the polygon
    }else{
        bearingToPoint = points[LargestSegment + 1];
    }
    var bearing = points[LargestSegment].bearingTo(bearingToPoint);

    if(!helper.clockwise(points)){
        bearing += 180;
    }
    var midPoint = points[LargestSegment].midpointTo(points[LargestSegment + 1]);
    var perpendicularBearing = bearing + 90;
    var bbox = helper.calculateBoundingBox(points);
    var minPoint = bbox[0];
    var maxPoint = bbox[1];
    var diagDist = minPoint.distanceTo(maxPoint);
    var numberOfSegments = diagDist/distance;
    var lines = [];
    for(var k=0 ; k<= numberOfSegments; k++){
        var deltaInit = 0;
        if(k==0){deltaInit=0.0002;} // we move 20 cm the first line to force cutting with the other perpendiculars
        var projectedMidPoint = midPoint.destinationPoint(perpendicularBearing,distance*k+deltaInit);
        var p1 = projectedMidPoint.destinationPoint(bearing,diagDist);
        var p2 = projectedMidPoint.destinationPoint(bearing + 180,diagDist);
        lines.push([p1,p2]);
    }
    /* now we calculate the intersections for the pictures
     * we keep the variables perpendicularBearing, bbox, minPoint, maxPoint and diagDist
     */
    //distance = parameters.pictureHeightWithOverlap * 0.001;
    distance = this.getPictureHeightWithOverlap() * 0.001; // Uff Cuidado con este cálculo ¿no es WidthWithSidelap?
    numberOfSegments = diagDist/distance;


    //var m = lines[0][0].calculateSlope(lines[0][1]);

    midPoint = minPoint.destinationPoint(bearing -180,diagDist); // aseguramos las formas que sean muy irregulares
    bearing = points[LargestSegment].bearingTo(points[LargestSegment + 1]);

    var Picslines = [];
    for(var k=0 ; k<= numberOfSegments*2; k++){
        var deltaInit = 0;
        if(k==0){deltaInit=0.0002;} // we move 20 cm the first line to force cutting with the other perpendiculars
        var projectedMidPoint = midPoint.destinationPoint(bearing,distance*k+deltaInit);
        var p1 = projectedMidPoint.destinationPoint(perpendicularBearing,diagDist);
        var p2 = projectedMidPoint.destinationPoint(perpendicularBearing + 180,diagDist);
        Picslines.push([p1,p2]);
    }



    // cut the way point with the boundaries
    var cutLines =  this.cutGrid(lines,this._mission.boundaries);
    // cut the picture lines with the previous boundixbox
    var cutPicLines = this.cutGrid(Picslines,this._mission.boundaries);
    var WPlines = lines;
    //var photoCenters = this.cutLines(WPlines,Picslines);


    // store variables in _mission component
    this._mission.points = cutLines;
    this._mission.pictures = cutPicLines;


    // some filght variables formatted for database collection
    // we should ovoid this since the values are stored in this. _mission Component, so we should not return any value in this function
    /*
    let flightData ={
        timePics: parameters.pictureShootTime,
        distPics: parameters.pictureHeightWithOverlap,
        resolution: parameters.pictureResolution,
        flightTime: parameters.flightTime,
        pathLength: parameters.pathLength,
        totalArea: parameters.surface,
        numberPics: "0"
    }

    return [cutLines,cutPicLines,bearing,flightData];
    */
    return [cutLines,cutPicLines,bearing];
};

/**
 * This method is called directly by calculateGrid Method and cut the lines which are
 * inside the polygon of the mission.
 * This method is complemented by buildPolyline
 * @param {[[LatLon]]} lines - Array of lines with points
 * @returns {[[LatLon]]} - Array lines with points
 */
MissionBuilder.prototype.cutGrid = function(lines, boundaries){

    // ensure the last coordinate is the first of the polygon
    if(boundaries[0].lat != boundaries[boundaries.length -1].lat
        || boundaries[0].lng != boundaries[boundaries.length -1].lng ){
        boundaries.push(boundaries[0]);
    }
    var helper = new LatLon(0,0);
    //var mm = this._mission;
    var ii = 0;
    var toRemove = [];
    lines.forEach(function (line) {
        ii ++;
        var p1, p2 = null;
        //for(var i = 0; i< mm.boundaries.length - 1;i++){
        //    var segmentP1 = new LatLon(mm.boundaries[i].lat,mm.boundaries[i].lon);
        //    var segmentP2 = new LatLon(mm.boundaries[i + 1].lat,mm.boundaries[i +1].lon);
        for(var i = 0; i< boundaries.length - 1;i++){
            var segmentP1 = new LatLon(boundaries[i].lat,boundaries[i].lng);
            var segmentP2 = new LatLon(boundaries[i + 1].lat,boundaries[i +1].lng);
            var result = helper.findLineIntersection(line[0],line[1], segmentP1,segmentP2);
            if(result != null){
                if(p1==null){
                    p1 = result;
                }
                else{
                    if(p2==null){
                        p2=result;
                        break;
                    }
                }
            }
        }
        if(p1!=null && p2!=null){
            line[0] = p1;
            line[1] = p2;
        }
        else{
            toRemove.push(line);
            //lines.remove(line);
        }
    });
    toRemove.forEach(function(item){
        lines.remove(item);
    });

    return lines;
};

/**
 * Build a linear mission taken the arguments given in this._mission and camera.
 * This method is complemented by builPolyline.
 * @returns {[[LatLon]]} - Array of lines with and array of points (LatLon)
 */
MissionBuilder.prototype.calculateBuffer = function () {
    var parameters = this.getFlightVariables();
    var distance = parameters.pictureWidthWithSidelap * 0.001;
    var helper = new LatLon(0,0);
    var points = helper.pointsToLatLon(this._mission.boundaries);
    //var points = helper.coorsArrayToLatLon(this._mission.boundaries);
    this._mission.surface = 0;
    for(var k=0;k<points.length-1;k++){
        this._mission.surface += points[k].distanceTo(points[k+1]);
    }
    this._mission.surface = this._mission.surface.toFixed(2);
    this._mission.resolution = parameters.pictureResolution;
    this._mission.shootTime = parameters.pictureShootTime;
    this._mission.timePics = parameters.pictureShootTime;
    this._mission.distPics = parameters.pictureHeightWithOverlap;
    if(this._mission.buffer==0){
        return [points];
    }
    var lines = Math.floor((this._mission.buffer * 0.001)/distance);



    if(lines==0){
        this._mission.points = [points];
        return [points];
        // at least 1;
        //lines = 1;
    }

    var segments = [];
    var distances = [];
    //var plines = []; //perpendicular lines
    for(var j=0;j<=lines;j++){
        distances.push((distance*j) - (distance*(lines/2)));
    }
    for(var i=0;i<points.length;i++){
        var bearing = 0;
        var middlePoint = null;
        if(i< points.length - 1){
            bearing = points[i].bearingTo(points[i+1]);
            middlePoint = points[i].midpointTo(points[i+1]);
        }else{
            bearing = segments[segments.length -1].bearing;
        }

        var item ={
            'bearing' : bearing,
            'middlePopint' : middlePoint,
            'projectedPoins' : [],
            'cutPoints' : []
        };
        //var  item = [bearing,middlePoint];

        for(var jj=0;jj<=lines;jj++) {
            var projectedPoint = null;
            var projectedDistance = distances[jj];
            var projectedBearing = bearing;
            if (projectedDistance < 0) {
                projectedBearing = bearing - 90;
                projectedDistance = Math.abs(projectedDistance);
            } else {
                projectedBearing =bearing + 90;
            }

            if(i==0){
                projectedPoint = points[0].destinationPoint(projectedBearing,projectedDistance);
                item.projectedPoins.push(projectedPoint);
                item.cutPoints.push(projectedPoint);
            }
            if(i>0 && i<points.length -1){
                projectedPoint = middlePoint.destinationPoint(projectedBearing,projectedDistance);
                item.projectedPoins.push(projectedPoint);
                var previousItem = segments[i-1];
                var previousProjectedPoint = previousItem.projectedPoins[jj];
                var previousBearing =  previousItem.bearing;
                var cutPoint = LatLon.intersection(projectedPoint,bearing,previousProjectedPoint,previousBearing);
                item.cutPoints.push(cutPoint);
            }
            if(i==points.length -1){
                projectedPoint = points[points.length -1].destinationPoint(projectedBearing,projectedDistance);
                item.projectedPoins.push(projectedPoint);
                item.cutPoints.push(projectedPoint);
            }

        }
        segments.push(item);
    }
    var Arrlines = [];
    for(var ij=0;ij<=lines;ij++){
        var line = [];
        Arrlines.push(line);
    }
    segments.forEach(function(segment){
        var i = 0;
        segment.cutPoints.forEach(function(point){
            Arrlines[i].push(point);
            i++;
        });
    });
    this._mission.points = Arrlines;
    return Arrlines;
};

/**
 * Method that build the mission
 * @param {LatLon} takeoff - Take off point where the mission will start
 * @param {[[LatLon]]}lines array of lines with points
 * @returns {[LatLon]} points. Array of points ordered having in mind the takeOff point
 */
MissionBuilder.prototype.buildPolyline = function(takeoff,lines){
    //var takeoff = new LatLon(0,0);
    var lenLine = lines[0].length -1;
    var arrL = lines.length - 1;
    // para la opción más cercana
    var closestPoint = takeoff.closestPoint([lines[0][0],lines[0][lenLine],lines[arrL][0],lines[arrL][lenLine]]);
    // para la opción más lejana
    //var closestPoint = takeoff.furthestPoint([lines[0][0],lines[0][lenLine],lines[arrL][0],lines[arrL][lenLine]]);
    var up = true;
    var points = [];

    if(arrL!=0) {
        if (closestPoint == lines[0][0]) {
            lines[0].forEach(function (point) {
                points.push(point);
            });
        }
        if (closestPoint == lines[0][lenLine]) {
            lines[0].reverse();
            lines[0].forEach(function (point) {
                points.push(point);
            });
        }
        if (closestPoint == lines[arrL][0]) {
            lines[arrL].forEach(function (point) {
                points.push(point);
            });
            up = false;
        }
        if (closestPoint == lines[arrL][lenLine]) {
            lines[arrL].reverse();
            lines[arrL].forEach(function (point) {
                points.push(point);
            });
            up = false;
        }
        closestPoint = points[points.length - 1];
        var closestPoint2 = null;
        if (up) {
            for (var i = 1; i <= arrL; i++) {
                closestPoint2 = closestPoint.closestPoint([lines[i][0], lines[i][lenLine]]);
                if (lines[i][0] == closestPoint2) {
                    lines[i].forEach(function (point) {
                        points.push(point);
                    });
                    closestPoint = lines[i][lenLine];
                } else {
                    closestPoint = lines[i][0];
                    lines[i].reverse();
                    lines[i].forEach(function (point) {
                        points.push(point);
                    });
                }
            }
        } else {
            for (var ii = arrL - 1; ii >= 0; ii--) {
                closestPoint2 = closestPoint.closestPoint([lines[ii][0], lines[ii][lenLine]]);
                if (lines[ii][0] == closestPoint2) {
                    lines[ii].forEach(function (point) {
                        points.push(point);
                    });
                    closestPoint = lines[ii][lenLine];
                } else {
                    closestPoint = lines[ii][0];
                    lines[ii].reverse();
                    lines[ii].forEach(function (point) {
                        points.push(point);
                    });
                }
            }
        }
    }else{ //if(arrL==0
        var line = lines[0];
        line.forEach(function(point){
            points.push(point);
        });

    }

    //var coors = [];

    this._mission.pathLength = 0;
    for(var i3=0;i3<points.length;i3++){
        //coors.push([points[i].lon,points[i].lat]);
        if(i3<points.length-1){
            this._mission.pathLength += points[i3].distanceTo(points[i3 + 1]);
        }
    }
    this._mission.pathLength = (this._mission.pathLength).toFixed(2);
    //this._mission.flightTime = (this._mission.totalLenght/this._mission.flightSpeed).toFixed(0);
    var flightTIme = ((this._mission.pathLength*1000)/this._mission.flightSpeed).toFixed(0);
    this._mission.flightTimeMinutes= flightTIme;
    var minutesStr = (Math.floor(flightTIme/60)).toString();
    var secondsStr = (flightTIme - ((Math.floor(flightTIme/60))*60)).toString();
    if(minutesStr.length==1){minutesStr='0' + minutesStr;}
    if(secondsStr.length==1){secondsStr='0' + secondsStr;}
    this._mission.flightTime = minutesStr +':' + secondsStr;

    return points;

};



/**
 *
 * */

MissionBuilder.prototype.cutLines = function(lines1,lines2){
    var helper = new LatLon(0,0);
    var ii = 0;
    var linesResult=[];
    lines1.forEach(function (line1) {
        ii ++;
        var p = [];
        var p1, p2 = null;
        for (var i = 0; i< lines2.length; i++) {
            var result = helper.findLineIntersection(line1[0],line1[1],lines2[i][0],lines2[i][1]);
            p[i]=result;
            if(result != null){
                if(p1==null){
                    p1 = result;
                }
                else{
                    if(p2==null){
                        p2=result;
                    }
                }
            }
        }

        linesResult[ii] = p;

    });

    return linesResult;

};


MissionBuilder.prototype.calculatePhotoCenter = function(){


    var waypointsAndPictures = this.calculateGrid();
    var cutLines = waypointsAndPictures[0];
    var cutPicLines = waypointsAndPictures[1];
    var bearing = waypointsAndPictures[2];

    var photoCentersTemp = this.cutLines(cutPicLines,cutLines);
    var photoCenters=[];
    var pointTemp=[];

  function temp(points){
          points.forEach(function (point){
                  point.forEach(function (latlon){
                          if (latlon != null)
                          {
                              pointTemp.push(latlon);

                          }
                  });
                  photoCenters.push(pointTemp);
              pointTemp=[];

          });
    return photoCenters;
  }

    temp(photoCentersTemp);
    return [photoCenters,bearing];

};

MissionBuilder.prototype.buildWaypoints = function(){

    //waypointstypes

    let wpToff = 1;
    let wpLanding = 2;
    let wpStartPic = 3;
    let wpStopPic = 4;
    let wpNewPosition = 5;
    this._mission.waypoints = [];
    let points = this._mission.points;
    let toff = this._mission.dataTOff;
    let landing = this._mission.dataLanding;

    //calculate positive and negative bearing
    let pt1 = new LatLon(points[0].lat,points[0].lon);
    let pt2 = new LatLon(points[1].lat,points[1].lon);
    let positiveBearing = pt1.bearingTo(pt2);
    let negativeBearing = pt2.bearingTo(pt1);

    //let wpTOFF = {key:this.generateUUID(),lng:toff.lng,lat:toff.lat,alt:0,type:wpToff,param1:0,param2:0,param3:0};
    //let wpTOFF = this.generateWaypoint(toff.lng,toff.lat,0,wpToff);
    let wpTOFF = this.generateWaypoint({'lng':toff.lng,'lat':toff.lat,'altRelative':50,'type':wpToff});
    this._mission.waypoints.push(wpTOFF);
    let i = 0;
    let takePic = true;
    let boolPositiveBearing = false;

    // apllied just for axes, not for surfaces
    let numberOfVertex = this._mission.boundaries.length;
    let vertexCounter = 0;

    for(i==0;i<points.length;i++){

        if(takePic){
            let ptOrig = new LatLon(points[i].lat,points[i].lon);
            let bearing;
            if(boolPositiveBearing) {
                bearing = positiveBearing;
                boolPositiveBearing = false;
            }else{
                bearing = negativeBearing;
                boolPositiveBearing = true;
            }

            /*Parche para entidades lineales*/
            if (this._mission.type=="lineal" && vertexCounter==numberOfVertex == 0){
                let pt1Line = new LatLon(points[numberOfVertex-1].lat,points[numberOfVertex-1].lon);
                let pt2Line = new LatLon(points[numberOfVertex-2].lat,points[numberOfVertex-2].lon);
                let positiveBearingLine = pt1Line.bearingTo(pt2Line);
                let negativeBearingLine = pt2Line.bearingTo(pt1Line);
                if(boolPositiveBearing) {
                    //bearing = positiveBearingLine;
                    boolPositiveBearing = true;
                }else{
                    bearing = negativeBearingLine;
                    boolPositiveBearing = false;
                }

            }

            let ptProjected = ptOrig.destinationPoint(bearing, this._mission.entryMarging/1000);
            let wpProjected = this.generateWaypoint({'lng':ptProjected.lon,'lat':ptProjected.lat,'altRelative':this._mission.altitude,'type':wpNewPosition});
            let wpOrig = this.generateWaypoint({'lng':ptOrig.lon,'lat':ptOrig.lat,'altRelative':this._mission.altitude,'type':wpStartPic});
            wpOrig.param2 = this._mission.distPics;

            if (this._mission.type=="lineal"){
                if(vertexCounter<=0) {
                    this._mission.waypoints.push(wpProjected);
                    takePic = false;
                }
            } else {
                this._mission.waypoints.push(wpProjected);
                takePic = false;
            }

            this._mission.waypoints.push(wpOrig);

            // with takePic = true allways wil project an overshoot (waypoint exit and entry), if takePic = false only will take the overshoot when exit
            //takePic = false;

        }else{
            //let wpOrig = this.generateWaypoint({'lng':points[i].lon,'lat':points[i].lat,'altRelative':this._mission.altitude,'type':wpStopPic});
            //this._mission.waypoints.push(wpOrig);
            //takePic = true
            let ptOrig = new LatLon(points[i].lat,points[i].lon);
            let bearing;

            if(boolPositiveBearing) {
                bearing = positiveBearing;
                boolPositiveBearing = true;
            }else{
                bearing = negativeBearing;
                boolPositiveBearing = false;
            }

            /*Parche para entidades lineales*/
            if (this._mission.type=="lineal" && vertexCounter==numberOfVertex -1){
                let pt1Line = new LatLon(points[numberOfVertex-2].lat,points[numberOfVertex-2].lon);
                let pt2Line = new LatLon(points[numberOfVertex-1].lat,points[numberOfVertex-1].lon);
                let positiveBearingLine = pt1Line.bearingTo(pt2Line);
                let negativeBearingLine = pt2Line.bearingTo(pt1Line);
                if(boolPositiveBearing) {
                    bearing = positiveBearingLine;
                    boolPositiveBearing = true;
                }else{
                    //bearing = negativeBearingLine;
                    boolPositiveBearing = false;
                }

            }



            let ptProjected = ptOrig.destinationPoint(bearing, this._mission.entryMarging/1000);
            let wpProjected = this.generateWaypoint({'lng':ptProjected.lon,'lat':ptProjected.lat,'altRelative':this._mission.altitude,'type':wpNewPosition});
            let wpOrig = this.generateWaypoint({'lng':ptOrig.lon,'lat':ptOrig.lat,'altRelative':this._mission.altitude,'type':wpStopPic});
            if(this._mission.type=="lineal" && vertexCounter<numberOfVertex -1){
                wpOrig = this.generateWaypoint({'lng':ptOrig.lon,'lat':ptOrig.lat,'altRelative':this._mission.altitude,'type':wpNewPosition});
            }
            wpOrig.param2 = this._mission.distPics;
            this._mission.waypoints.push(wpOrig);

            if(this._mission.type=="lineal") {
                if (vertexCounter == numberOfVertex - 1) {
                    this._mission.waypoints.push(wpProjected);
                    takePic = true;
                }
            } else{
                this._mission.waypoints.push(wpProjected);
                takePic = true;
            }



            // with takePic = true allways wil project an overshoot (waypoint exit and entry), if takePic = false only will take the overshoot when exit
            //takePic = true;



        }
        vertexCounter++;
        if(vertexCounter==numberOfVertex){
            vertexCounter = 0;
        }
    }
    //let wpLANDING = {key:this.generateUUID(),lng:landing.lng,lat:landing.lat,alt:0,type:wpLanding,param1:0,param2:0,param3:0};
    //let wpLANDING = this.generateWaypoint(landing.lng,landing.lat,this._mission.altitude,wpLanding);
    let wpLANDING = this.generateWaypoint({'lng':landing.lng,'lat':landing.lat,'altRelative':0,'type':wpLanding});

    this._mission.waypoints.push(wpLANDING);

}
/*
MissionBuilder.prototype.generateWaypoint = function(lng,lat,alt,type,param1,param2,param3){
    if(!lng)lng=0;
    if(!lat)lat=0;
    if(!alt)alt=0;
    if(!type)type=0;
    if(!param1)param1=0;
    if(!param2)param2=0;
    if(!param3)param3=0;
    return {key:this.generateUUID(),lng:lng,lat:lat,alt:alt,type:type,param1:param1,param2:param2,param3:param3};
}
*/

/**
 * Function that returns a waypoint in json notation with a unique key
 * @param {{lng: number, lat: number, altRelative: number, altGround: number, altAbsolute: number, type: number, param1: number, param2: number, param3: number}}
 * @returns {{key, lng: number, lat: number, altRelative: number, altGround: number, altAbsolute: number, type: number, param1: number, param2: number, param3: number}}
 */
MissionBuilder.prototype.generateWaypoint = function(jsonParams){
    let params = jsonParams;
    if(!params.lng)params.lng=0;
    if(!params.lat)params.lat=0;
    if(!params.altRelative)params.altRelative=0;
    if(!params.altGround)params.altGround=0;
    if(!params.altAbsolute)params.altAbsolute=0;
    if(!params.type)params.type=0;
    if(!params.param1)params.param1=0;
    if(!params.param2)params.param2=0;
    if(!params.param3)params.param3=0;
    return {'key':this.generateUUID(),
        'lng':params.lng,
        'lat':params.lat,
        'altRelative':params.altRelative,
        'altGround':params.altGround,
        'altAbsolute':params.altAbsolute,
        'type':params.type,
        'param1':params.param1,
        'param2':params.param2,
        'param3':params.param3};
}

MissionBuilder.prototype.enumerateWayPoints = function(){
    let counterReal = 0;    // contador real para el imu
    let counterMap = 0;     // contador para pintar en el mapa
    this._mission.waypoints.forEach(function(wp){
        counterReal++;
        wp.param1 = counterReal;
        if(wp.type==3 || wp.type==4){ // the server script generates two waypoints when start/stop taking pictures
            counterReal++;
        }
        if(wp.type==5){ // only enumerate on the map type 5 (new possition)
            counterMap++;
            wp.param3 = counterMap;
        } else{
            wp.param3 = "";
        }
    });
}

MissionBuilder.prototype.generateUUID = function () {
    var d = new Date().getTime();
    var uuid = 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function(c) {
        var r = (d + Math.random()*16)%16 | 0;
        d = Math.floor(d/16);
        return (c=='x' ? r : (r&0x3|0x8)).toString(16);
    });
    return uuid;
};


