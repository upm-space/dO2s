import {
  createRPAPath,
  setWaypointNumbers,
  getOperationType,
  arrayEqualsCoords,
  arrayContainsCoords,
  removeWaypoint,
  moveWaypoint,
  insertNewWaypoint,
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


describe('testing the setWaypointNumbers function', () => {
  test('check that the numbers are set correctly 10 waypoints', () => {
    expect(setWaypointNumbers(wayPointList)).toEqual(wayPointListwithNumbers);
  });
});

describe('test the create path function', () => {
  test('create the RPA path from the Waypoint', () => {
    expect(createRPAPath(wayPointList.features)).toEqual(rpaPath);
  });
});

describe('test the get operation type function', () => {
  test('test for add', () => {
    expect(getOperationType(rpaPath, rpaPathAddWPBeforeLanding)).toBe('add');
  });
  test('test for delete', () => {
    expect(getOperationType(rpaPathAddWPBeforeLanding, rpaPath)).toBe('delete');
  });
  test('test for move', () => {
    expect(getOperationType(rpaPathAddWPBeforeLanding, rpaPathMoveWPBeforeLanding)).toBe('move');
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
    expect(setWaypointNumbers(removeWaypoint(wayPointListAddWPBeforeLanding, rpaPath))).toEqual(wayPointListwithNumbers);
  });
});

describe('test insertNewWaypoint', () => {
  test('test that the waypoint is added correctly just after take off', () => {
    expect(setWaypointNumbers(insertNewWaypoint(wayPointListwithNumbers, rpaPathAddWPBeforeLanding))).toEqual(wayPointListAddWPBeforeLanding);
  });
});

describe('test moveWaypoint', () => {
  test('test that the waypoint is moved correctly', () => {
    expect(moveWaypoint(wayPointListAddWPBeforeLanding, rpaPathMoveWPBeforeLanding)).toEqual(wayPointListMoveWPBeforeLanding);
  });
});
