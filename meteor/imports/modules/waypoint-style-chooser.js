
export const waypointIcon = (waypointType) => {
  switch (waypointType) {
  case 1 : return '/waypoints/fa-arrow-circle-up.svg';
  case 2 : return '/waypoints/fa-arrow-circle-down.svg';
  case 3 : return '/waypoints/fa-camera-on.svg';
  case 4 : return '/waypoints/fa-camera-off.svg';
  case 5 : return '/waypoints/fa-flag.svg';
  default : return '/images/marker-icon.png';
  }
};

export const waypointSize = (waypointType) => {
  switch (waypointType) {
  case 1 : return [50, 50];
  case 2 : return [50, 50];
  case 3 : return [40, 40];
  case 4 : return [40, 40];
  case 5 : return [28, 41];
  default : return [25, 41];
  }
};

export const waypointAnchor = (waypointType) => {
  switch (waypointType) {
  case 1 : return [24.3, 40];
  case 2 : return [24.3, 40];
  case 3 : return [20, 22];
  case 4 : return [20, 22];
  case 5 : return [3, 32];
  default : return [12, 41];
  }
};
