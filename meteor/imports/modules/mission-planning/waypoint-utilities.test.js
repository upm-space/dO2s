import {
  pointsCollectionFeatureToLineString,
  setWaypointNumbers,
  getOperationType,
  arrayEqualsCoords,
  arrayContainsCoords,
  editWayPointType,
  insertNewWaypointsAtIndex,
  removeWaypoint,
  moveWaypoint,
  getLandingBearing,
  checkforLandingPath,
  calculateLandingPath,
  addLandingPath,
  deleteLandingPath,
  convertWaypointArrayToGeoJSON,
} from './waypoint-utilities';

const rpaPathAddWPBeforeLanding = {
  type: 'Feature',
  geometry: {
    type: 'LineString',
    coordinates: [
      [
        -3.68893325328827,
        40.419573348683,
      ],
      [
        -3.6895004784754,
        40.4157070745898,
      ],
      [
        -3.68914815572727,
        40.415735970521,
      ],
      [
        -3.68267868815939,
        40.4162667374733,
      ],
      [
        -3.68232636510861,
        40.4162956519721,
      ],
      [
        -3.68276953697205,
        40.4190424237473,
      ],
      [
        -3.68590772151947,
        40.4200470935497,
      ],
    ],
  },
  properties: {},
};

const latlngArrayAddWPBeforeLanting = [
  {
    lng: -3.68893325328827,
    lat: 40.419573348683,
  },
  {
    lng: -3.6895004784754,
    lat: 40.4157070745898,
  },
  {
    lng: -3.68914815572727,
    lat: 40.415735970521,
  },
  {
    lng: -3.68267868815939,
    lat: 40.4162667374733,
  },
  {
    lng: -3.68232636510861,
    lat: 40.4162956519721,
  },
  {
    lng: -3.68276953697205,
    lat: 40.4190424237473,
  },
  {
    lng: -3.68590772151947,
    lat: 40.4200470935497,
  },
];

const rpaPathMoveWPBeforeLanding = {
  type: 'Feature',
  geometry: {
    type: 'LineString',
    coordinates: [
      [
        -3.68893325328827,
        40.419573348683,
      ],
      [
        -3.6895004784754,
        40.4157070745898,
      ],
      [
        -3.68914815572727,
        40.415735970521,
      ],
      [
        -3.68267868815939,
        40.4162667374733,
      ],
      [
        -3.68232636510861,
        40.4162956519721,
      ],
      [
        -3.68614912033081,
        40.4184216446629,
      ],
      [
        -3.68590772151947,
        40.4200470935497,
      ],
    ],
  },
  properties: {},
};

const latlngArrayMoveWPBeforeLanding = [
  {
    lng: -3.68893325328827,
    lat: 40.419573348683,
  },
  {
    lng: -3.6895004784754,
    lat: 40.4157070745898,
  },
  {
    lng: -3.68914815572727,
    lat: 40.415735970521,
  },
  {
    lng: -3.68267868815939,
    lat: 40.4162667374733,
  },
  {
    lng: -3.68232636510861,
    lat: 40.4162956519721,
  },
  {
    lng: -3.68614912033081,
    lat: 40.4184216446629,
  },
  {
    lng: -3.68590772151947,
    lat: 40.4200470935497,
  },
];

const wayPointListAddWPBeforeLanding = {
  type: 'FeatureCollection',
  features: [
    {
      type: 'Feature',
      properties: {
        altRelative: 50,
        altAbsolute: 0,
        altGround: 0,
        type: 1,
        totalNumber: 0,
      },
      geometry: {
        type: 'Point',
        coordinates: [
          -3.68893325328827,
          40.419573348683,
        ],
      },
    },
    {
      type: 'Feature',
      properties: {
        altRelative: 120,
        altAbsolute: 0,
        altGround: 0,
        type: 5,
        totalNumber: 1,
        webNumber: 1,
      },
      geometry: {
        type: 'Point',
        coordinates: [
          -3.6895004784754,
          40.4157070745898,
        ],
      },
    },
    {
      type: 'Feature',
      properties: {
        altRelative: 120,
        altAbsolute: 0,
        altGround: 0,
        type: 3,
        shootDistance: '117.00',
        totalNumber: 2,
      },
      geometry: {
        type: 'Point',
        coordinates: [
          -3.68914815572728,
          40.415735970521,
        ],
      },
    },
    {
      type: 'Feature',
      properties: {
        altRelative: 120,
        altAbsolute: 0,
        altGround: 0,
        type: 4,
        shootDistance: '117.00',
        totalNumber: 3,
      },
      geometry: {
        type: 'Point',
        coordinates: [
          -3.68267868815939,
          40.4162667374733,
        ],
      },
    },
    {
      type: 'Feature',
      properties: {
        altRelative: 120,
        altAbsolute: 0,
        altGround: 0,
        type: 5,
        totalNumber: 4,
        webNumber: 2,
      },
      geometry: {
        type: 'Point',
        coordinates: [
          -3.68232636510861,
          40.4162956519721,
        ],
      },
    },
    {
      type: 'Feature',
      properties: {
        altRelative: 120,
        altAbsolute: 0,
        altGround: 0,
        type: 5,
        totalNumber: 5,
        webNumber: 3,
      },
      geometry: {
        type: 'Point',
        coordinates: [
          -3.68276953697205,
          40.4190424237473,
        ],
      },
    },
    {
      type: 'Feature',
      properties: {
        altRelative: 0,
        altAbsolute: 0,
        altGround: 0,
        type: 2,
        totalNumber: 6,
      },
      geometry: {
        type: 'Point',
        coordinates: [
          -3.68590772151947,
          40.4200470935497,
        ],
      },
    },
  ],
};

const wayPointListMoveWPBeforeLanding = {
  type: 'FeatureCollection',
  features: [
    {
      type: 'Feature',
      properties: {
        altRelative: 50,
        altAbsolute: 0,
        altGround: 0,
        type: 1,
        totalNumber: 0,
      },
      geometry: {
        type: 'Point',
        coordinates: [
          -3.68893325328827,
          40.419573348683,
        ],
      },
    },
    {
      type: 'Feature',
      properties: {
        altRelative: 120,
        altAbsolute: 0,
        altGround: 0,
        type: 5,
        totalNumber: 1,
        webNumber: 1,
      },
      geometry: {
        type: 'Point',
        coordinates: [
          -3.6895004784754,
          40.4157070745898,
        ],
      },
    },
    {
      type: 'Feature',
      properties: {
        altRelative: 120,
        altAbsolute: 0,
        altGround: 0,
        type: 3,
        shootDistance: '117.00',
        totalNumber: 2,
      },
      geometry: {
        type: 'Point',
        coordinates: [
          -3.68914815572728,
          40.415735970521,
        ],
      },
    },
    {
      type: 'Feature',
      properties: {
        altRelative: 120,
        altAbsolute: 0,
        altGround: 0,
        type: 4,
        shootDistance: '117.00',
        totalNumber: 3,
      },
      geometry: {
        type: 'Point',
        coordinates: [
          -3.68267868815939,
          40.4162667374733,
        ],
      },
    },
    {
      type: 'Feature',
      properties: {
        altRelative: 120,
        altAbsolute: 0,
        altGround: 0,
        type: 5,
        totalNumber: 4,
        webNumber: 2,
      },
      geometry: {
        type: 'Point',
        coordinates: [
          -3.68232636510861,
          40.4162956519721,
        ],
      },
    },
    {
      type: 'Feature',
      properties: {
        altRelative: 120,
        altAbsolute: 0,
        altGround: 0,
        type: 5,
        totalNumber: 5,
        webNumber: 3,
      },
      geometry: {
        type: 'Point',
        coordinates: [
          -3.68614912033081,
          40.4184216446629,
        ],
      },
    },
    {
      type: 'Feature',
      properties: {
        altRelative: 0,
        altAbsolute: 0,
        altGround: 0,
        type: 2,
        totalNumber: 6,
      },
      geometry: {
        type: 'Point',
        coordinates: [
          -3.68590772151947,
          40.4200470935497,
        ],
      },
    },
  ],
};

const rpaPath = {
  type: 'Feature',
  geometry: {
    type: 'LineString',
    coordinates: [
      [
        -3.68893325328827,
        40.419573348683,
      ],
      [
        -3.6895004784754,
        40.4157070745898,
      ],
      [
        -3.68914815572728,
        40.415735970521,
      ],
      [
        -3.68267868815939,
        40.4162667374733,
      ],
      [
        -3.68232636510861,
        40.4162956519721,
      ],
      [
        -3.68590772151947,
        40.4200470935497,
      ],
    ],
  },
  properties: {},
};

const latlngArrayRpaPath = [
  {
    lng: -3.68893325328827,
    lat: 40.419573348683,
  },
  {
    lng: -3.6895004784754,
    lat: 40.4157070745898,
  },
  {
    lng: -3.68914815572728,
    lat: 40.415735970521,
  },
  {
    lng: -3.68267868815939,
    lat: 40.4162667374733,
  },
  {
    lng: -3.68232636510861,
    lat: 40.4162956519721,
  },
  {
    lng: -3.68590772151947,
    lat: 40.4200470935497,
  },
];

const wayPointList = {
  type: 'FeatureCollection',
  features: [
    {
      type: 'Feature',
      properties: {
        altRelative: 50,
        altAbsolute: 0,
        altGround: 0,
        type: 1,
      },
      geometry: {
        type: 'Point',
        coordinates: [
          -3.68893325328827,
          40.419573348683,
        ],
      },
    },
    {
      type: 'Feature',
      properties: {
        altRelative: 120,
        altAbsolute: 0,
        altGround: 0,
        type: 5,
      },
      geometry: {
        type: 'Point',
        coordinates: [
          -3.6895004784754,
          40.4157070745898,
        ],
      },
    },
    {
      type: 'Feature',
      properties: {
        altRelative: 120,
        altAbsolute: 0,
        altGround: 0,
        type: 3,
        shootDistance: '117.00',
      },
      geometry: {
        type: 'Point',
        coordinates: [
          -3.68914815572728,
          40.415735970521,
        ],
      },
    },
    {
      type: 'Feature',
      properties: {
        altRelative: 120,
        altAbsolute: 0,
        altGround: 0,
        type: 4,
        shootDistance: '117.00',
      },
      geometry: {
        type: 'Point',
        coordinates: [
          -3.68267868815939,
          40.4162667374733,
        ],
      },
    },
    {
      type: 'Feature',
      properties: {
        altRelative: 120,
        altAbsolute: 0,
        altGround: 0,
        type: 5,
      },
      geometry: {
        type: 'Point',
        coordinates: [
          -3.68232636510861,
          40.4162956519721,
        ],
      },
    },
    {
      type: 'Feature',
      properties: {
        altRelative: 0,
        altAbsolute: 0,
        altGround: 0,
        type: 2,
      },
      geometry: {
        type: 'Point',
        coordinates: [
          -3.68590772151947,
          40.4200470935497,
        ],
      },
    },
  ],
};

const wayPointListwithNumbers = {
  type: 'FeatureCollection',
  features: [
    {
      type: 'Feature',
      properties: {
        altRelative: 50,
        altAbsolute: 0,
        altGround: 0,
        type: 1,
        totalNumber: 0,
      },
      geometry: {
        type: 'Point',
        coordinates: [
          -3.68893325328827,
          40.419573348683,
        ],
      },
    },
    {
      type: 'Feature',
      properties: {
        altRelative: 120,
        altAbsolute: 0,
        altGround: 0,
        type: 5,
        totalNumber: 1,
        webNumber: 1,
      },
      geometry: {
        type: 'Point',
        coordinates: [
          -3.6895004784754,
          40.4157070745898,
        ],
      },
    },
    {
      type: 'Feature',
      properties: {
        altRelative: 120,
        altAbsolute: 0,
        altGround: 0,
        type: 3,
        shootDistance: '117.00',
        totalNumber: 2,
      },
      geometry: {
        type: 'Point',
        coordinates: [
          -3.68914815572728,
          40.415735970521,
        ],
      },
    },
    {
      type: 'Feature',
      properties: {
        altRelative: 120,
        altAbsolute: 0,
        altGround: 0,
        type: 4,
        shootDistance: '117.00',
        totalNumber: 3,
      },
      geometry: {
        type: 'Point',
        coordinates: [
          -3.68267868815939,
          40.4162667374733,
        ],
      },
    },
    {
      type: 'Feature',
      properties: {
        altRelative: 120,
        altAbsolute: 0,
        altGround: 0,
        type: 5,
        totalNumber: 4,
        webNumber: 2,
      },
      geometry: {
        type: 'Point',
        coordinates: [
          -3.68232636510861,
          40.4162956519721,
        ],
      },
    },
    {
      type: 'Feature',
      properties: {
        altRelative: 0,
        altAbsolute: 0,
        altGround: 0,
        type: 2,
        totalNumber: 5,
      },
      geometry: {
        type: 'Point',
        coordinates: [
          -3.68590772151947,
          40.4200470935497,
        ],
      },
    },
  ],
};

const wayPointListwithNumbersChangedType = {
  type: 'FeatureCollection',
  features: [
    {
      type: 'Feature',
      properties: {
        altRelative: 50,
        altAbsolute: 0,
        altGround: 0,
        type: 1,
        totalNumber: 0,
      },
      geometry: {
        type: 'Point',
        coordinates: [
          -3.68893325328827,
          40.419573348683,
        ],
      },
    },
    {
      type: 'Feature',
      properties: {
        altRelative: 120,
        altAbsolute: 0,
        altGround: 0,
        type: 5,
        totalNumber: 1,
        webNumber: 1,
      },
      geometry: {
        type: 'Point',
        coordinates: [
          -3.6895004784754,
          40.4157070745898,
        ],
      },
    },
    {
      type: 'Feature',
      properties: {
        altRelative: 120,
        altAbsolute: 0,
        altGround: 0,
        type: 3,
        shootDistance: '117.00',
        totalNumber: 2,
      },
      geometry: {
        type: 'Point',
        coordinates: [
          -3.68914815572728,
          40.415735970521,
        ],
      },
    },
    {
      type: 'Feature',
      properties: {
        altRelative: 120,
        altAbsolute: 0,
        altGround: 0,
        type: 4,
        shootDistance: '117.00',
        totalNumber: 3,
      },
      geometry: {
        type: 'Point',
        coordinates: [
          -3.68267868815939,
          40.4162667374733,
        ],
      },
    },
    {
      type: 'Feature',
      properties: {
        altRelative: 120,
        altAbsolute: 0,
        altGround: 0,
        type: 3,
        totalNumber: 4,
        webNumber: 2,
      },
      geometry: {
        type: 'Point',
        coordinates: [
          -3.68232636510861,
          40.4162956519721,
        ],
      },
    },
    {
      type: 'Feature',
      properties: {
        altRelative: 0,
        altAbsolute: 0,
        altGround: 0,
        type: 2,
        totalNumber: 5,
      },
      geometry: {
        type: 'Point',
        coordinates: [
          -3.68590772151947,
          40.4200470935497,
        ],
      },
    },
  ],
};

const wayPointListwithNumbersChangedTypeUpdatedNumbers = {
  type: 'FeatureCollection',
  features: [
    {
      type: 'Feature',
      properties: {
        altRelative: 50,
        altAbsolute: 0,
        altGround: 0,
        type: 1,
        totalNumber: 0,
      },
      geometry: {
        type: 'Point',
        coordinates: [
          -3.68893325328827,
          40.419573348683,
        ],
      },
    },
    {
      type: 'Feature',
      properties: {
        altRelative: 120,
        altAbsolute: 0,
        altGround: 0,
        type: 5,
        totalNumber: 1,
        webNumber: 1,
      },
      geometry: {
        type: 'Point',
        coordinates: [
          -3.6895004784754,
          40.4157070745898,
        ],
      },
    },
    {
      type: 'Feature',
      properties: {
        altRelative: 120,
        altAbsolute: 0,
        altGround: 0,
        type: 3,
        shootDistance: '117.00',
        totalNumber: 2,
      },
      geometry: {
        type: 'Point',
        coordinates: [
          -3.68914815572728,
          40.415735970521,
        ],
      },
    },
    {
      type: 'Feature',
      properties: {
        altRelative: 120,
        altAbsolute: 0,
        altGround: 0,
        type: 4,
        shootDistance: '117.00',
        totalNumber: 3,
      },
      geometry: {
        type: 'Point',
        coordinates: [
          -3.68267868815939,
          40.4162667374733,
        ],
      },
    },
    {
      type: 'Feature',
      properties: {
        altRelative: 120,
        altAbsolute: 0,
        altGround: 0,
        type: 3,
        totalNumber: 4,
      },
      geometry: {
        type: 'Point',
        coordinates: [
          -3.68232636510861,
          40.4162956519721,
        ],
      },
    },
    {
      type: 'Feature',
      properties: {
        altRelative: 0,
        altAbsolute: 0,
        altGround: 0,
        type: 2,
        totalNumber: 5,
      },
      geometry: {
        type: 'Point',
        coordinates: [
          -3.68590772151947,
          40.4200470935497,
        ],
      },
    },
  ],
};

const telArrayforTesting = [
  {
    lat: 34, lng: 30, alt: 50, seq: 0, command: 1,
  },
  {
    lat: 34, lng: 30, alt: 50, seq: 1, command: 5,
  },
  {
    lat: 34, lng: 30, alt: 50, seq: 2, command: 3,
  },
  {
    lat: 34, lng: 30, alt: 50, seq: 3, command: 4,
  },
  {
    lat: 34, lng: 30, alt: 50, seq: 4, command: 5,
  },
  {
    lat: 34, lng: 30, alt: 50, seq: 5, command: 2,
  },
];

const resultGeoJSONforTesting = {
  type: 'FeatureCollection',
  features: [
    {
      type: 'Feature',
      properties: {
        altRelative: 50,
        altAbsolute: 50,
        altGround: 0,
        type: 1,
        totalNumber: 0,
      },
      geometry: {
        type: 'Point',
        coordinates: [
          30,
          34,
        ],
      },
    },
    {
      type: 'Feature',
      properties: {
        altRelative: 50,
        altAbsolute: 50,
        altGround: 0,
        type: 5,
        totalNumber: 1,
      },
      geometry: {
        type: 'Point',
        coordinates: [
          30,
          34,
        ],
      },
    },
    {
      type: 'Feature',
      properties: {
        altRelative: 50,
        altAbsolute: 50,
        altGround: 0,
        type: 3,
        totalNumber: 2,
      },
      geometry: {
        type: 'Point',
        coordinates: [
          30,
          34,
        ],
      },
    },
    {
      type: 'Feature',
      properties: {
        altRelative: 50,
        altAbsolute: 50,
        altGround: 0,
        type: 4,
        totalNumber: 3,
      },
      geometry: {
        type: 'Point',
        coordinates: [
          30,
          34,
        ],
      },
    },
    {
      type: 'Feature',
      properties: {
        altRelative: 50,
        altAbsolute: 50,
        altGround: 0,
        type: 5,
        totalNumber: 4,
      },
      geometry: {
        type: 'Point',
        coordinates: [
          30,
          34,
        ],
      },
    },
    {
      type: 'Feature',
      properties: {
        altRelative: 50,
        altAbsolute: 50,
        altGround: 0,
        type: 2,
        totalNumber: 5,
      },
      geometry: {
        type: 'Point',
        coordinates: [
          30,
          34,
        ],
      },
    },
  ],
};

describe('testing the setWaypointNumbers function', () => {
  test('check that the numbers are set correctly 10 waypoints', () => {
    expect(setWaypointNumbers(wayPointList)).toEqual(wayPointListwithNumbers);
  });
  test('check that the numbers are set correctly after changing waypoint type', () => {
    expect(setWaypointNumbers(wayPointListwithNumbersChangedType)).toEqual(wayPointListwithNumbersChangedTypeUpdatedNumbers);
  });
});

describe('test the create path function', () => {
  test('create the RPA path from the Waypoint', () => {
    expect(pointsCollectionFeatureToLineString(wayPointList)).toEqual(rpaPath);
  });
});

describe('test the get operation type function', () => {
  test('test for add', () => {
    const result = getOperationType(rpaPath, latlngArrayAddWPBeforeLanting);
    expect(result.operation).toBe('add');
  });
  test('test for delete', () => {
    const result = getOperationType(rpaPathAddWPBeforeLanding, latlngArrayRpaPath);
    expect(result.operation).toBe('delete');
  });
  test('test for move', () => {
    const result = getOperationType(rpaPathAddWPBeforeLanding, latlngArrayMoveWPBeforeLanding);
    expect(result.operation).toBe('move');
  });
});

describe('test array equals', () => {
  const coord1 = [
    -3.68893325328827,
    40.419573348683,
  ];
  const coord2 = [
    -3.688933253288,
    40.419573348683,
  ];

  const coords3 = [[
    -3.68893325328827,
    40.419573348683,
  ],
  [
    -3.6895004784754,
    40.4157070745898,
  ]];

  const coords4 = [[
    -3.6889332532887,
    40.419573348683,
  ],
  [
    -3.689500478474,
    40.415707074588,
  ]];

  test('[-3.68893325328827,40.419573348683] is equal to [-3.68893325328827,40.419573348683,]', () => {
    expect(arrayEqualsCoords(coord1, coord2)).toBeTruthy();
  });
  test('test for equal nested coords', () => {
    expect(arrayEqualsCoords(coords3, coords4)).toBeTruthy();
  });
});

describe('test array contains', () => {
  const coord1 = [
    -3.68893325328827,
    40.419573348683,
    -3.6895004784754,
    40.4157070745898,
    -3.68914815572727,
    40.415735970521,
  ];
  const coord2 = [
    [
      -3.68893325328827,
      40.419573348683,
    ],
    [
      -3.6895004784754,
      40.4157070745898,
    ],
    [
      -3.68914815572727,
      40.415735970521,
    ],
    [
      -3.68267868815939,
      40.4162667374733,
    ],
  ];
  const coords3 = [
    -3.6889332532827,
    40.41957334863,
  ];
  test(`${coord1} contains -3.6889332532827`, () => {
    expect(arrayContainsCoords(-3.6889332532827, coord1)).toBeTruthy();
  });
  test(`test ${coord2} contains ${coords3}`, () => {
    expect(arrayContainsCoords(coords3, coord2)).toBeTruthy();
  });
  test(`${coord2} does not contain [-3.68893325328827]`, () => {
    expect(arrayContainsCoords([-3.68893325328827], coord2)).toBeFalsy();
  });
});

describe('test removeWaypoint', () => {
  test('test that the waypoint is deleted correctly. waypoint right after take off ', () => {
    expect(setWaypointNumbers(removeWaypoint(wayPointListAddWPBeforeLanding, 5))).toEqual(wayPointListwithNumbers);
  });
});

describe('test insertNewWaypoint', () => {
  test('test that the waypoint is added correctly just after take off', () => {
    const newWP = {
      type: 'Feature',
      properties: {
        altRelative: 120,
        altAbsolute: 0,
        altGround: 0,
        type: 5,
        totalNumber: 5,
        webNumber: 3,
      },
      geometry: {
        type: 'Point',
        coordinates: [
          -3.68276953697205,
          40.4190424237473,
        ],
      },
    };
    expect(setWaypointNumbers(insertNewWaypointsAtIndex(wayPointListwithNumbers, 5, newWP))).toEqual(wayPointListAddWPBeforeLanding);
  });
});

describe('test moveWaypoint', () => {
  test('test that the waypoint is moved correctly', () => {
    const movedWP = {
      type: 'Feature',
      properties: {
        altRelative: 120,
        altAbsolute: 0,
        altGround: 0,
        type: 5,
        totalNumber: 5,
        webNumber: 3,
      },
      geometry: {
        type: 'Point',
        coordinates: [
          -3.68614912033081,
          40.4184216446629,
        ],
      },
    };
    expect(moveWaypoint(wayPointListAddWPBeforeLanding, 5, movedWP)).toEqual(wayPointListMoveWPBeforeLanding);
  });
});

describe('test waypoint array from telemetry conversion', () => {
  test('test correct conversion', () => {
    expect(convertWaypointArrayToGeoJSON(telArrayforTesting)).toEqual(resultGeoJSONforTesting);
  });
});
