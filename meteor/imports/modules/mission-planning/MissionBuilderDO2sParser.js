
import MissionBuilder from './MissionBuilder.jsx';
import Latlon from './GeoHelper.jsx';
import Payloads from '../../api/Payloads/Payloads';


const blankMission = { _id: '',
  deletedAt: null,
  deleted: false,
  name: '',
  missionDescription: '',
  project: '',
  createdAt: '',
  checked: false,
  owner: '',
  timePics: '0',
  distPics: '0',
  resolution: '0',
  flightTime: '0',
  flightTimeMinutes: null,
  pathLength: '0',
  totalArea: '0',
  numberPics: '0',
  dataMission: [],
  dataTOff: {
    lng: 0,
    lat: 0,
  },
  dataLanding: {
    lng: 0,
    lat: 0,
  },
  boundaries: [],
  pictures: [],
  points: [],
  waypoints: [],
  photoCenters: [],
  footprints: [],
  flightSpeed: 0,
  entryMarging: 0,
  camera: {
    MatrixWidth: 0,
    MatrixHeight: 0,
    PixelWidth: 0,
    PixelHeight: 0,
    Focal: 0,
    Model: '',
  },
  overlap: 0,
  sidelap: 0,
  buffer: 0,
  altitude: 0,
  initialSegment: 0,
  type: '',
  aircraft: '',
  drawn: false,
};


const missionSuperficial = {
  _id: 'PRWgkaevHXorFDnoH',
  owner: 'xL9r3BM4qdMdqYxLr',
  name: 'asdf',
  description: 'something something',
  project: 'RoHfqEyBySr4aYs25',
  rpa: '5iyLXP5kTGzRQDRL7',
  payload: 'XuJnNL6uHWCiqPSwd',
  missionType: 'Surface Area',
  createdAt: '2017-09-10T20:09:53.818Z',
  updatedAt: '2017-09-13T08:01:14.727Z',
  deleted: 'no',
  done: false,
  flightPlan: {
    takeOffPoint: {
      type: 'Feature',
      geometry: {
        type: 'Point',
        coordinates: [-3.7201648950576782, 40.4201777812017, 0],
      },
      properties: {
        waypointType: 'take-off',
      },
    },
    landingPoint: {
      type: 'Feature',
      geometry: {
        type: 'Point',
        coordinates: [-3.7201648950576782, 40.4201777812017, 0],
      },
      properties: {
        waypointType: 'landing',
      },
    },
    missionArea: {
      type: 'Feature',
      geometry: {
        type: 'Polygon',
        coordinates: [
          [
            [-3.7201648950576782, 40.4201777812017, 0],
            [-3.72087299823761, 40.41400251224963, 0],
            [-3.713749051094055, 40.41390448753791, 0],
            [-3.7154442071913536, 40.42024312493252, 0],
            [-3.7201648950576782, 40.4201777812017, 0],
          ],
        ],
      },
    },
    flightParameters: {
      altitude: 120,
      speed: 60,
      entryMargin: 2,
    },
    pictureGrid: {
      overlap: 80,
      sidelap: 60,
    },
  },

};

const payloadExample = {
  _id: 'XuJnNL6uHWCiqPSwd',
  owner: 'xL9r3BM4qdMdqYxLr',
  name: 'qwerqwer',
  payloadType: 'Camera',
  model: 'qwerqwer',
  weight: 0,
  sensorParameters: {
    focalLength: 16,
    sensorWidth: 23.5,
    sensorHeight: 15.6,
    imageWidth: 6000,
    imageHeight: 4000,
  },
  createdAt: '2017-09-10T20:09:46.554Z',
  updatedAt: '2017-09-10T20:09:46.554Z',
  deleted: 'no',
};

// const _m2 = { mission: missionSuperficial, payload: payloadExample };

export default class MissionBuilderDO2sParser {
  constructor(dO2sMission) {
    // super();
    // TODO: make the conversion between dO2Mission to this.mission

    this.mission = {};
    // Cuando pasemos a dO2s, cambiar esto
    // this.m2 = _m2;
    // por esto
    this.m2 = { mission: dO2sMission, payload: null };
    this.setMission();
    this.mBuilder = new MissionBuilder(this.mission);
    // this.calculateMission();
  }
  calculateMission() {
    if (this.mission.type === 'superficial') {
      this.mBuilder.calculateGrid();
    } else {
      this.mBuilder.calculateBuffer();
    }
    const toff = new Latlon(this.mission.dataTOff.lat, this.mission.dataTOff.lng);

    // Chequear que los points devueltos los guarda en dO2sMission.points
    this.mission.points = this.mBuilder.buildPolyline(toff, this.mission.points);
    this.mBuilder.buildWaypoints();
    this.enumerateWps();
  }
  enumerateWps() {
    this.mBuilder.enumerateWayPoints();
  }

  getMission() {
    // TODO: convert to dO2sMission and return dO2sMission insteadof this.mission
    // return this.mission;
    const waypoints = [];
    this.mission.waypoints.forEach((waypoint) => {
      const wpjson = { type: 'Feature',
        properties: {
          key: waypoint.key,
          altRelative: waypoint.altRelative,
          altAbsolute: waypoint.altAbsolute,
          altGround: waypoint.altGround,
          type: waypoint.type,

        },
        geometry: {
          type: 'Point',
          coordinates: [waypoint.lng, waypoint.lat],
        } };

      if (wpjson.properties.type === 3 || wpjson.properties.type === 4) {
        wpjson.properties.shootDistance = waypoint.param2;
      }
      waypoints.push(wpjson);
    });

    const waypointLine = { type: 'Feature',
      properties: {},
      geometry: {
        type: 'LineString',
        coordinates: [],
      } };

    waypointLine.geometry.coordinates.push(
      [this.m2.mission.flightPlan.takeOffPoint.geometry.coordinates[0],
        this.m2.mission.flightPlan.takeOffPoint.geometry.coordinates[1]]);

    this.mission.points.forEach((point) => {
      waypointLine.geometry.coordinates.push([point.lon, point.lat]);
    });

    waypointLine.geometry.coordinates.push(
      [this.m2.mission.flightPlan.landingPoint.geometry.coordinates[0],
        this.m2.mission.flightPlan.landingPoint.geometry.coordinates[1]]);

    const flightData = {
      flightTime: this.mission.flightTime,
      flightTimeMinutes: this.mission.flightTimeMinutes,
      pathLength: this.pathLength,
      shootTime: this.shootTime,
      totalArea: this.totalArea,
      resolution: this.resolution,
    };

    return { waypoints, waypointLine, flightData };
  }

  setMission() {
    this.mission = blankMission;
    // TODO: convert to dO2sMission and return dO2sMission insteadof this.mission
    // this.m2.mission = _mission;
    const payloadId = this.m2.mission.payload;
    const subscription = Meteor.subscribe('payloads.view', payloadId);
    this.m2.payload = Payloads.findOne(payloadId);

    this.mission.altitude = this.m2.mission.flightPlan.flightParameters.altitude;
    this.mission.buffer = 0; // TODO
    this.mission.camera.Focal = this.m2.payload.sensorParameters.focalLength;
    this.mission.camera.MatrixHeight = this.m2.payload.sensorParameters.sensorHeight;
    this.mission.camera.MatrixWidth = this.m2.payload.sensorParameters.sensorWidth;
    this.mission.camera.PixelHeight = this.m2.payload.sensorParameters.imageHeight;
    this.mission.camera.PixelWidth = this.m2.payload.sensorParameters.imageWidth;
    if (this.m2.mission.missionType === 'Surface Area') { this.mission.type = 'superficial'; }
    if (this.m2.mission.missionType === 'Linear Area') { this.mission.type = 'linear'; }

    this.mission.boundaries = [];
    if (this.mission.type === 'superficial') {
      this.m2.mission.flightPlan.missionArea.geometry.coordinates[0].forEach((point) => {
        this.mission.boundaries.push({ lat: point[1], lng: point[0] });
      });
    }

    if (this.mission.type === 'linear') {
      this.m2.mission.flightPlan.missionAxis.geometry.coordinates.forEach((point) => {
        this.mission.boundaries.push({ lat: point[1], lng: point[0] });
      });
    }

    this.mission.dataLanding.lat = this.m2.mission.flightPlan.landingPoint.geometry.coordinates[1];
    this.mission.dataLanding.lng = this.m2.mission.flightPlan.landingPoint.geometry.coordinates[0];
    this.mission.dataTOff.lat = this.m2.mission.flightPlan.takeOffPoint.geometry.coordinates[1];
    this.mission.dataTOff.lng = this.m2.mission.flightPlan.takeOffPoint.geometry.coordinates[0];

    this.mission.entryMarging = this.m2.mission.flightPlan.flightParameters.entryMargin;
    this.mission.flightSpeed = this.m2.mission.flightPlan.flightParameters.speed;
    this.mission.initialSegment = 0; // TODO: manage the projected segment;
    this.mission.overlap = this.m2.mission.flightPlan.pictureGrid.overlap;
    this.mission.sidelap = this.m2.mission.flightPlan.pictureGrid.sidelap;

    // this.mission = _mission;
  }
}


/*
export default MissionBuilderDO2sParser = (dO2sMission)=>{


}

MissionBuilderDO2sParser.prototype.calculateMission = ()=>{

    if(this.mission.type=="superficial"){
        mBuilder.calculateGrid();
    }else{
        mBuilder.calculateBuffer();
    }
    let toff = new Latlon(this.mission.dataTOff.lat, this.mission.dataTOff.lng);

    //Chequear que los points devueltos los guarda en dO2sMission.points
    let points = mBuilder.buildPolyline(toff, this.mission.points );
    mBuilder.buildWaypoints();
}

MissionBuilderDO2sParser.prototype.enumerateWps = (waypoints)=>{
    mBuilder.enumerateWayPoints();
}

MissionBuilderDO2sParser.prototype.getMission = ()=>{
    //TODO: convert to dO2sMission and return dO2sMission insteadof this.mission
    return this.mission;
}

MissionBuilderDO2sParser.prototype.setMission = (_mission)=>{
    //TODO: convert to dO2sMission and return dO2sMission insteadof this.mission
    this.mission = _mission;
}
    */
