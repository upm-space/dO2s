import EventEmiter from 'events';

const armdis = 'Disarmed';
let flightMode;
let autopilot;
let type;


class WebSocketTelemetry extends EventEmiter {
  constructor() {
    super();
    this.init();
  }

  init() {
    const client = new WebSocket('ws://192.168.1.47:8080/ws');
    client.onerror = () => {
      console.log('Connection Error');
    };

    client.onopen = () => {
      console.log('WebSocket Client Connected');
      const message = { type: 'getPorts' };
      client.send(JSON.stringify(message));
    };

    client.onclose = () => {
      console.log('Client Closed');
    };

    client.onmessage = (e) => {
      try {
        const msg = JSON.parse(e.data);
        // console.log(msg.type)
        if (msg.type) {
          if (msg.type === 'ports') {
            this.emit('ports', msg.ports);
          }
          if (msg.type === 'mavlink') {
            // manageMavlink(msg.data);
          }
          // if (msg.type == 'message') {
          //  document.getElementById('logtext').innerHTML = msg.msg;
          // }
          // if (msg.type == 'itemLogList') {
          //   document.getElementById('logtext').innerHTML = `Recibidos: ${msg.id} de ${msg.numLogs}`;
          //   const x = document.getElementById('logs');
          //   const option = document.createElement('option');
          //   option.text = `Nº ${msg.id} : ${msg.MbSize}Mb`;
          //   x.add(option);
          // }
          // if (msg.type == 'logData') {
          //   document.getElementById('logtext').innerHTML = `Cargados: ${msg.ofset} Mb del log Nº ${msg.id}`;
          // }
        }
      } catch (error) {
        console.log(error);
      }
    };
  }
}

export default WebSocketTelemetry;


const armDisarm = function (bool) {
  /*
        if (armdis == "Disarmed"){
            var message = "armDisarm,arm"
            client.send(message);
            armdis="Armed";
            //document.getElementById("estatus").innerHTML = armdis;
        }else if(armdis == "Armed"){
            var message = "armDisarm,disarm"
            client.send(message);
            armDis = "Disarmed";
            //document.getElementById("estatus").innerHTML = armdis;
        } */
  const message = { type: 'arm', result: bool };
  client.send(JSON.stringify(message));
};

const connect = function () {
  const bauds = document.getElementById('Bauds').value;
  const port = document.getElementById('AvailablePorts').value;
  const message = { type: 'connect', bauds, port };
  client.send(JSON.stringify(message));
};

const setFlightMode = function () {
  const selFlightMode = document.getElementById('flightmodeselect').value;
  const message = { type: 'setFlighMode', flightMode: selFlightMode };
  client.send(JSON.stringify(message));
};

const requestLogList = function () {
  // var message = "requestLogList";
  const message = '{"type" : "requestLogList"}';
  client.send(message);
};

const requestLog = function () {
  const log = document.getElementById('logs').value;
  const id = log.split(' ')[1];
  const message = `{"type":"requestLog" ,"id":"${id}"}`;
  client.send(message);
};

const manageMavlink = function (data) {
  switch (data.parameter) {
  case 'ATTITUDE':
    processAttitude(data);
    break;
  case 'GPS_RAW_INT':
    processGPS(data);
    break;
  case 'VFR_HUD':
    processVFR(data);
    break;
  case 'HEARTBEAT':
    processHeartbeat(data);
    break;
  case 'SYS_STATUS':
    processSysStatus(data);
    break;
  case 'MISSION_CURRENT':
    processCurrentWP(data);
    break;
  case 'NAV_CONTROLLER_OUTPUT':
    processNavController(data);
  default:
  }
};

var processAttitude = function (data) {
  let pitchRead = data.pitch;
  let rollRead = data.roll;
  let yawRead = data.yaw;
  pitchRead = pitchRead * 180 / Math.PI;
  rollRead = rollRead * 180 / Math.PI;
  yawRead = yawRead * 180 / Math.PI;
  document.getElementById('pitchRead').innerHTML = `pitchRead: ${pitchRead}`;
  document.getElementById('rollRead').innerHTML = `rollRead: ${rollRead}`;
  document.getElementById('yawRead').innerHTML = `yawRead: ${yawRead}`;
};
var processGPS = function (data) {
  let latRead = data.lat;
  let lonRead = data.lon;
  let altRead = data.alt;
  const signalType = data.fix_type; // importante para el tipo de recepción (no gps, 3dFix, etc)
  let speedRead = data.vel;

  altRead /= 1000;
  lonRead /= 10000000;
  latRead /= 10000000;
  speedRead /= 100;

  document.getElementById('altRead').innerHTML = `altRead: ${altRead}`;
  document.getElementById('lonRead').innerHTML = `lonRead: ${lonRead}`;
  document.getElementById('latRead').innerHTML = `latRead: ${latRead}`;
  document.getElementById('signalType').innerHTML = `signalType: ${signalType}`;
  document.getElementById('speedRead').innerHTML = `speedRead: ${speedRead}`;
};

var processVFR = function (data) {
  const airspeed = data.airspeed;
  document.getElementById('airspeed').innerHTML = `airspeed: ${airspeed}`;
};

var processHeartbeat = function (data) {
  let mode = 0;
  // console.log(this.lastMessage);
  if (data.base_mode == 81 || data.base_mode == 89) {
    mode = 'disarmed';
  } else if (data.custom_mode == 5 && data.base_mode == 209) {
    mode = 'manual';
  } else if (data.custom_mode == 10 && data.base_mode == 217) {
    mode = 'auto';
  } else if (data.custom_mode == 15 && data.base_mode == 217) {
    mode = 'guided';
  } else if (data.custom_mode == 11 && data.base_mode == 217) {
    mode = 'rtl';
  } else {
    mode = `unknown ${data.base_mode}`;
  }
  document.getElementById('mode').innerHTML = `mode: ${mode}`;
};

var processSysStatus = function (data) {
  const voltage = (data.voltage_battery / 1000).toFixed(1);
  const remaining = data.battery_remaining;
  const amper = (data.current_battery / 100).toFixed(1);
  document.getElementById('voltage').innerHTML = `voltage: ${voltage}`;
  document.getElementById('remaining').innerHTML = `remaining: ${remaining}`;
  document.getElementById('amper').innerHTML = `amper: ${amper}`;
};

var processCurrentWP = function (data) {
  const lastWp = data.seq;
  document.getElementById('lastWp').innerHTML = `lastWp: ${lastWp}`;
};

var processNavController = function (data) {
  const distToWp = data.wp_dist;
  document.getElementById('distToWp').innerHTML = `distToWp: ${distToWp}`;
};
