import {
  createRPAPath,
  setWaypointNumbers,
  getOperationType,
  arrayEquals,
  arrayContains,
  removeWaypoint,
  moveWaypoint,
  insertNewWaypoint,
} from 'waypoint-utilities';

const wayPointListOriginal = {
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
          -3.69150817394257,
          40.4166450412885,
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
          -3.69112066441205,
          40.4168643457574,
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
        shootDistance: '23.40',
      },
      geometry: {
        type: 'Point',
        coordinates: [
          -3.69100257797159,
          40.4168665633281,
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
        shootDistance: '23.40',
      },
      geometry: {
        type: 'Point',
        coordinates: [
          -3.68623657383719,
          40.4169561605643,
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
          -3.6861184873889,
          40.4169583828635,
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
          -3.68612344757965,
          40.4163240750946,
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
        shootDistance: '23.40',
      },
      geometry: {
        type: 'Point',
        coordinates: [
          -3.68624153291467,
          40.4163218527954,
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
        shootDistance: '23.40',
      },
      geometry: {
        type: 'Point',
        coordinates: [
          -3.69100961890717,
          40.4162322155775,
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
          -3.69112770423437,
          40.4162299980068,
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
          -3.68799448013306,
          40.4177559344116,
        ],
      },
    },
  ],
};

const wayPointListWithNumbers = {
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
          -3.69150817394257,
          40.4166450412885,
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
          -3.69112066441205,
          40.4168643457574,
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
        shootDistance: '23.40',
        totalNumber: 2,
      },
      geometry: {
        type: 'Point',
        coordinates: [
          -3.69100257797159,
          40.4168665633281,
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
        shootDistance: '23.40',
        totalNumber: 3,
      },
      geometry: {
        type: 'Point',
        coordinates: [
          -3.68623657383719,
          40.4169561605643,
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
          -3.6861184873889,
          40.4169583828635,
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
          -3.68612344757965,
          40.4163240750946,
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
        shootDistance: '23.40',
        totalNumber: 6,
      },
      geometry: {
        type: 'Point',
        coordinates: [
          -3.68624153291467,
          40.4163218527954,
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
        shootDistance: '23.40',
        totalNumber: 7,
      },
      geometry: {
        type: 'Point',
        coordinates: [
          -3.69100961890717,
          40.4162322155775,
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
        totalNumber: 8,
        webNumber: 4,
      },
      geometry: {
        type: 'Point',
        coordinates: [
          -3.69112770423437,
          40.4162299980068,
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
        totalNumber: 9,
      },
      geometry: {
        type: 'Point',
        coordinates: [
          -3.68799448013306,
          40.4177559344116,
        ],
      },
    },
  ],
};

const rpaPathCreated = {
  type: 'Feature',
  geometry: {
    type: 'LineString',
    coordinates: [
      [
        -3.69150817394257,
        40.4166450412885,
      ],
      [
        -3.69112066441205,
        40.4168643457574,
      ],
      [
        -3.69100257797159,
        40.4168665633281,
      ],
      [
        -3.68623657383719,
        40.4169561605643,
      ],
      [
        -3.6861184873889,
        40.4169583828635,
      ],
      [
        -3.68612344757965,
        40.4163240750946,
      ],
      [
        -3.68624153291467,
        40.4163218527954,
      ],
      [
        -3.69100961890717,
        40.4162322155775,
      ],
      [
        -3.69112770423437,
        40.4162299980068,
      ],
      [
        -3.68799448013306,
        40.4177559344116,
      ],
    ],
  },
  properties: {},
};

const rpaPathAdd = {
  type: 'Feature',
  geometry: {
    type: 'LineString',
    coordinates: [
      [
        -3.69150817394257,
        40.4166450412885,
      ],
      [
        -3.69112066441205,
        40.4168643457574,
      ],
      [
        -3.69100257797159,
        40.4168665633281,
      ],
      [
        -3.68623657383719,
        40.4169561605643,
      ],
      [
        -3.6861184873889,
        40.4169583828635,
      ],
      [
        -3.69100257797159,
        40.4168665633281,
      ],
      [
        -3.68612344757965,
        40.4163240750946,
      ],
      [
        -3.68624153291467,
        40.4163218527954,
      ],
      [
        -3.69100961890717,
        40.4162322155775,
      ],
      [
        -3.69112770423437,
        40.4162299980068,
      ],
      [
        -3.68799448013306,
        40.4177559344116,
      ],
    ],
  },
  properties: {},
};

const rpaPathRemove = {
  type: 'Feature',
  geometry: {
    type: 'LineString',
    coordinates: [
      [
        -3.69150817394257,
        40.4166450412885,
      ],
      [
        -3.69112066441205,
        40.4168643457574,
      ],
      [
        -3.69100257797159,
        40.4168665633281,
      ],
      [
        -3.68623657383719,
        40.4169561605643,
      ],
      [
        -3.6861184873889,
        40.4169583828635,
      ],
      [
        -3.68612344757965,
        40.4163240750946,
      ],
      [
        -3.68624153291467,
        40.4163218527954,
      ],
      [
        -3.69112770423437,
        40.4162299980068,
      ],
      [
        -3.68799448013306,
        40.4177559344116,
      ],
    ],
  },
  properties: {},
};

const rpaPathMove = {
  type: 'Feature',
  geometry: {
    type: 'LineString',
    coordinates: [
      [
        -3.69150817394257,
        40.4166450412885,
      ],
      [
        -3.69112066441205,
        40.4168643457574,
      ],
      [
        -3.69100257797159,
        40.4168665633281,
      ],
      [
        -3.68623657383719,
        40.4169561605643,
      ],
      [
        -3.6861184873889,
        40.4169583828635,
      ],
      [
        -3.68612344757965,
        40.4163240750946,
      ],
      [
        -3.68623657383719,
        40.4169561605643,
      ],
      [
        -3.69100961890717,
        40.4162322155775,
      ],
      [
        -3.69112770423437,
        40.4162299980068,
      ],
      [
        -3.68799448013306,
        40.4177559344116,
      ],
    ],
  },
  properties: {},
};

const wayPointListRemove = {
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
          -3.69150817394257,
          40.4166450412885,
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
          -3.69112066441205,
          40.4168643457574,
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
        shootDistance: '23.40',
        totalNumber: 2,
      },
      geometry: {
        type: 'Point',
        coordinates: [
          -3.69100257797159,
          40.4168665633281,
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
        shootDistance: '23.40',
        totalNumber: 3,
      },
      geometry: {
        type: 'Point',
        coordinates: [
          -3.68623657383719,
          40.4169561605643,
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
          -3.6861184873889,
          40.4169583828635,
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
          -3.68612344757965,
          40.4163240750946,
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
        shootDistance: '23.40',
        totalNumber: 6,
      },
      geometry: {
        type: 'Point',
        coordinates: [
          -3.68624153291467,
          40.4163218527954,
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
        totalNumber: 8,
        webNumber: 4,
      },
      geometry: {
        type: 'Point',
        coordinates: [
          -3.69112770423437,
          40.4162299980068,
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
        totalNumber: 9,
      },
      geometry: {
        type: 'Point',
        coordinates: [
          -3.68799448013306,
          40.4177559344116,
        ],
      },
    },
  ],
};

const wayPointListAdd = {
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
          -3.69150817394257,
          40.4166450412885,
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
          -3.69112066441205,
          40.4168643457574,
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
        shootDistance: '23.40',
        totalNumber: 2,
      },
      geometry: {
        type: 'Point',
        coordinates: [
          -3.69100257797159,
          40.4168665633281,
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
        shootDistance: '23.40',
        totalNumber: 3,
      },
      geometry: {
        type: 'Point',
        coordinates: [
          -3.68623657383719,
          40.4169561605643,
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
          -3.6861184873889,
          40.4169583828635,
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
          -3.69100257797159,
          40.4168665633281,
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
          -3.68612344757965,
          40.4163240750946,
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
        shootDistance: '23.40',
        totalNumber: 6,
      },
      geometry: {
        type: 'Point',
        coordinates: [
          -3.68624153291467,
          40.4163218527954,
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
        shootDistance: '23.40',
        totalNumber: 7,
      },
      geometry: {
        type: 'Point',
        coordinates: [
          -3.69100961890717,
          40.4162322155775,
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
        totalNumber: 8,
        webNumber: 4,
      },
      geometry: {
        type: 'Point',
        coordinates: [
          -3.69112770423437,
          40.4162299980068,
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
        totalNumber: 9,
      },
      geometry: {
        type: 'Point',
        coordinates: [
          -3.68799448013306,
          40.4177559344116,
        ],
      },
    },
  ],
};

const wayPointListMove = {
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
          -3.69150817394257,
          40.4166450412885,
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
          -3.69112066441205,
          40.4168643457574,
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
        shootDistance: '23.40',
        totalNumber: 2,
      },
      geometry: {
        type: 'Point',
        coordinates: [
          -3.69100257797159,
          40.4168665633281,
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
        shootDistance: '23.40',
        totalNumber: 3,
      },
      geometry: {
        type: 'Point',
        coordinates: [
          -3.68623657383719,
          40.4169561605643,
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
          -3.6861184873889,
          40.4169583828635,
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
          -3.68612344757965,
          40.4163240750946,
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
        shootDistance: '23.40',
        totalNumber: 6,
      },
      geometry: {
        type: 'Point',
        coordinates: [
          -3.68623657383719,
          40.4169561605643,
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
        shootDistance: '23.40',
        totalNumber: 7,
      },
      geometry: {
        type: 'Point',
        coordinates: [
          -3.69100961890717,
          40.4162322155775,
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
        totalNumber: 8,
        webNumber: 4,
      },
      geometry: {
        type: 'Point',
        coordinates: [
          -3.69112770423437,
          40.4162299980068,
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
        totalNumber: 9,
      },
      geometry: {
        type: 'Point',
        coordinates: [
          -3.68799448013306,
          40.4177559344116,
        ],
      },
    },
  ],
};


describe('testing the setWaypointNumbers function', () => {
  test('check that the numbers are set correctly', () => {
    expect(setWaypointNumbers(wayPointListOriginal)).toEqual(wayPointListWithNumbers);
  });
});

describe('test the create path function', () => {
  test('create the RPA path from the Waypoint List', () => {
    expect(createRPAPath(wayPointListOriginal)).toEqual(rpaPathCreated);
  });
});

describe('test the get operation type function', () => {
  test('test for add', () => {
    expect(getOperationType(rpaPathCreated, rpaPathAdd)).toBe('add');
  });
  test('test for delete', () => {
    expect(getOperationType(rpaPathCreated, rpaPathRemove)).toBe('delete');
  });
  test('test for move', () => {
    expect(getOperationType(rpaPathCreated, rpaPathMove)).toBe('move');
  });
});

describe('test array equals', () => {
  const array1 = [[1, 2], [2, 3]];
  const array2 = [[1, 2], [2, 3]];
  test('[[1,2],[2,3]] is equal to [[1,2],[2,3]]', () => {
    expect(arrayEquals(array1, array2)).toBe(true);
  });
});

describe('test array constains', () => {
  const array1 = [[1, 2], [2, 3]];
  test('[[1,2],[2,3]] contains 1', () => {
    expect(arrayContains(1, array1)).toBe(true);
  });
  test('[[1,2],[2,3]] contains [1,2]', () => {
    expect(arrayContains([1, 2], array1)).toBe(true);
  });
  test('[[1,2],[2,3]] does not contain [1]', () => {
    expect(arrayContains([1], array1)).toBe(false);
  });
});

describe('test removeWaypoint', () => {
  test('test that the waypoint is deleted correctly', () => {
    expect(removeWaypoint(wayPointListWithNumbers, rpaPathRemove)).toEqual(wayPointListRemove);
  });
});

describe('test insertNewWaypoint', () => {
  test('test that the waypoint is deleted correctly', () => {
    expect(insertNewWaypoint(wayPointListWithNumbers, rpaPathAdd)).toEqual(wayPointListAdd);
  });
});

describe('test moveWaypoint', () => {
  test('test that the waypoint is deleted correctly', () => {
    expect(moveWaypoint(wayPointListWithNumbers, rpaPathMove)).toEqual(wayPointListMove);
  });
});
