import EventEmiter from 'events';

const armdis = 'Disarmed';
let flightMode;
let autopilot;
let type;


class WebSocketTelemetry extends EventEmiter {
  constructor() {
    super();
    this.webService = new WebSocket('ws://192.168.1.47:8080/ws');
    this.init();
  }

  closeWebService() {
    this.webService.close();
  }

  connectToServer(toPort, bauds) {
    let message = {};
    if (toPort && bauds) {
      message = { type: 'connect', bauds, port: toPort };
    } else {
      message = { type: 'connect' };
    }

    this.webService.send(JSON.stringify(message));
  }

  connectToRPA(toPort, bauds) {
    const message = { type: 'connect', bauds, toPort };
    this.webService.send(JSON.stringify(message));
  }

  arm() {
    const message = { type: 'arm', result: true };
    this.webService.send(JSON.stringify(message));
  }

  disArm() {
    const message = { type: 'arm', result: false };
    this.webService.send(JSON.stringify(message));
  }

  setFlighMode(newFlightMode) {
    const message = { type: 'setFlighMode', flightMode: newFlightMode };
    this.webService.send(JSON.stringify(message));
  }

  requestLogList() {
    const message = { type: 'requestLogList' };
    this.webService.send(JSON.stringify(message));
  }

  requestLog(log) {
    // const log = document.getElementById('logs').value;
    const id = log.split(' ')[1];
    const message = { type: 'requestLog', id };
    this.webService.send(JSON.stringify(message));
  }

  processAttitude(data) {
    let pitchRead = data.pitch;
    let rollRead = data.roll;
    let yawRead = data.yaw;
    pitchRead = (pitchRead * 180) / Math.PI;
    rollRead = (rollRead * 180) / Math.PI;
    yawRead = (yawRead * 180) / Math.PI;
    this.emit('attitudeData', { pitchRead, rollRead, yawRead });
  }

  processGPS(data) {
    let latRead = data.lat;
    let lonRead = data.lon;
    let altRead = data.alt;
    const signalType = data.fix_type; // importante para el tipo de recepción (no gps, 3dFix, etc)
    let speedRead = data.vel;

    altRead /= 1000;
    lonRead /= 10000000;
    latRead /= 10000000;
    speedRead /= 100;
    this.emit('GPSData', {
      altRead, lonRead, latRead, signalType, speedRead,
    });
  }

  processVFR(data) {
    const { airspeed } = data;
    this.emit('VFRData', { airspeed });
  }

  processHeartbeat(data) {
    let mode = 0;
    // console.log(this.lastMessage);
    if (data.base_mode === 81 || data.base_mode === 89) {
      mode = 'disarmed';
    } else if (data.custom_mode === 5 && data.base_mode === 209) {
      mode = 'manual';
    } else if (data.custom_mode === 10 && data.base_mode === 217) {
      mode = 'auto';
    } else if (data.custom_mode === 15 && data.base_mode === 217) {
      mode = 'guided';
    } else if (data.custom_mode === 11 && data.base_mode === 217) {
      mode = 'rtl';
    } else {
      mode = `unknown ${data.base_mode}`;
    }
    this.emit('HeartBeat', { mode });
  }

  processSysStatus(data) {
    const voltage = (data.voltage_battery / 1000).toFixed(1);
    const remaining = data.battery_remaining;
    const amper = (data.current_battery / 100).toFixed(1);
    this.emit('BatStatus', { voltage, remaining, amper });
  }

  processCurrentWP(data) {
    const lastWp = data.seq;
    this.emit('currentWP', { lastWp });
  }

  processNavController(data) {
    const distToWp = data.wp_dist;
    this.emit('distToWp', { distToWp });
  }

  manageMavlink(data) {
    switch (data.parameter) {
    case 'ATTITUDE':
      this.processAttitude(data);
      break;
    case 'GPS_RAW_INT':
      this.processGPS(data);
      break;
    case 'VFR_HUD':
      this.processVFR(data);
      break;
    case 'HEARTBEAT':
      this.processHeartbeat(data);
      break;
    case 'SYS_STATUS':
      this.processSysStatus(data);
      break;
    case 'MISSION_CURRENT':
      this.processCurrentWP(data);
      break;
    case 'NAV_CONTROLLER_OUTPUT':
      this.processNavController(data);
      break;
    default:
      this.emit('noData', true);
      throw new TypeError('The messeage is empty');
    }
  }

  init() {
    this.webService.onerror = () => {
      console.log('Connection Error');
    };

    this.webService.onopen = () => {
      console.log('WebSocket Client Connected');
      const message = { type: 'connect' };
      this.webService.send(JSON.stringify(message));
    };

    this.webService.onclose = () => {
      console.log('webService Closed');
    };

    this.webService.onmessage = (e) => {
      try {
        const msg = JSON.parse(e.data);
        if (msg.type) {
          switch (msg.type) {
          case 'connStatus':
            // Message Format for connStatus
            // msg = {
            //   type: 'connStatus',
            //   status: true / false,
            //   ports: { type: 'ports', ports: [{ portName: 'name' },...] },
            // };
            if (msg.status) {
              this.emit('connStatus', msg);
            } else if (msg.ports.type === 'ports') {
              if (!(msg.ports.ports instanceof Array)) {
                this.emit('connStatus', msg);
                throw new TypeError("Oops, we haven't got an array of ports!");
              } else if (msg.ports.ports.length === 0) {
                throw new TypeError('There are no ports to connect');
              } else if (msg.ports.ports.length === 1) {
                this.emit('connStatus', msg);
                console.log('array length 1');
                this.connectToServer(msg.ports.ports[0].portName, 155200);
              } else if (msg.ports.ports.length > 1) {
                this.emit('connStatus', msg);
                console.log('many ports');
              }
            }
            break;
          case 'mavlink':
            this.manageMavlink(msg.data);
            break;
          default:
            this.emit('noData', true);
            throw new TypeError('This message is not defined');
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
