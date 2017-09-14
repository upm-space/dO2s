/* eslint-disable no-undef */
import SimpleSchema from 'simpl-schema';
import { Point, LineString, Polygon, MultiPoint, MultiLineString, MultiPolygon, GeometryCollection, Feature, FeatureCollection, GeoJSONSchemaDef, FeaturePoint, FeatureLineString, FeaturePolygon, FeatureCollectionPoints, FeatureCollectionLineStrings, FeatureCollectionPolygons } from './GeoJSONSchema';

expect.extend({
  toGiveValidationErrorIn(objectToValidate, schemaUsed) {
    try {
      SimpleSchema.validate(objectToValidate, schemaUsed);
    } catch (e) {
      expect(e.error).toBe('validation-error');
      let errorMessages = '';
      let sep = '';
      for (let i = 0; i < e.details.length; i += 1) {
        errorMessages += `${sep} ${e.details[i].type} ${e.details[i].message}`;
        if (i === 0) {
          sep = '\n';
        }
      }
      return {
        message: () => (
          `validation-error: ${JSON.stringify(e, null, 1)}\n${errorMessages}`
        ),
        pass: true,
      };
    }
    return {
      message: () => (`this should give a validation-error\n
      Schema used: ${JSON.stringify(schemaUsed, null, ' ')}`),
      pass: false,
    };
  },
});

// variables to test
const PointExampleGood = {
  type: 'Point',
  coordinates: [180.0, 45.3, 6],
};
const PointExampleBad = {
  type: 'Point',
  coordinates: [180.0, 12],
};

const LineStringExampleGood = {
  type: 'LineString',
  coordinates: [
    [100.0, 0.0, 100],
    [101.0, 1.0, 100],
  ],
};

const LineStringExampleBad = {
  type: 'LineString',
  coordinates: [
    [100.0, 0.0, 100],
  ],
};

const PolygonExampleGoodNoHoles = {
  type: 'Polygon',
  coordinates: [
    [
      [100.0, 0.0, 20],
      [101.0, 0.0, 20],
      [101.0, 1.0, 20],
      [100.0, 1.0, 20],
      [100.0, 0.0, 20],
    ],
  ],
};

const PolygonExampleGoodWithHoles = {
  type: 'Polygon',
  coordinates: [
    [
      [100.0, 0.0, 120],
      [101.0, 0.0, 120],
      [101.0, 1.0, 120],
      [100.0, 1.0, 120],
      [100.0, 0.0, 120],
    ],
    [
      [100.8, 0.8, 120],
      [100.8, 0.2, 120],
      [100.2, 0.2, 120],
      [100.2, 0.8, 120],
      [100.8, 0.8, 120],
    ],
  ],
};

const PolygonExampleBad1 = {
  type: 'Polygon',
  coordinates: [
    [100.0, 0.0, 120],
    [101.0, 0.0, 120],
    [101.0, 1.0, 120],
    [100.0, 1.0, 120],
    [100.0, 0.0, 120],
    [
      [100.8, 0.8, 120],
      [100.8, 0.2, 120],
      [100.2, 0.2, 120],
      [100.2, 0.8, 120],
      [100.8, 0.8, 120],
    ],
  ],
};

const PolygonExampleBad2 = {
  type: 'Polygon',
  coordinates: [
    [
      [100.0, 0.0, 10],
      [101.0, 0.0, 20],
      [101.0, 1.0, 20],
      [100.0, 1.0, 20],
      [100.0, 0.0, 20],
    ],
  ],
};

const PolygonExampleBad3 = {
  type: 'Polygon',
  coordinates: [
    [
      [100.0, 0.0, 10],
      [101.0, 0.0, 20],
      [100.0, 0.0, 20],
    ],
  ],
};

const MultiPointExampleGood = {
  type: 'MultiPoint',
  coordinates: [
    [100.0, 0.0, 20],
    [101.0, 1.0, 20],
  ],
};

const MultiPointExampleBad = {
  type: 'MultiPoint',
  coordinates: [
    [100.0, 0.0],
    [101.0, 1.0],
  ],
};

const MultiLineStringExampleGood = {
  type: 'MultiLineString',
  coordinates: [
    [
      [100.0, 0.0, 50],
      [101.0, 1.0, 50],
    ],
    [
      [102.0, 2.0, 50],
      [103.0, 3.0, 50],
    ],
  ],
};

const MultiLineStringExampleBad = {
  type: 'MultiLineString',
  coordinates: [
    [
      [100.0, 0.0],
      [101.0, 1.0],
    ],
    [102.0, 2.0],
    [103.0, 3.0],
  ],
};

const MultiPolygonExampleGood = {
  type: 'MultiPolygon',
  coordinates: [
    [
      [
        [102.0, 2.0, 13],
        [103.0, 2.0, 13],
        [103.0, 3.0, 13],
        [102.0, 3.0, 13],
        [102.0, 2.0, 13],
      ],
    ],
    [
      [
        [100.0, 0.0, 13],
        [101.0, 0.0, 13],
        [101.0, 1.0, 13],
        [100.0, 1.0, 13],
        [100.0, 0.0, 13],
      ],
      [
        [100.2, 0.2, 13],
        [100.2, 0.8, 13],
        [100.8, 0.8, 13],
        [100.8, 0.2, 13],
        [100.2, 0.2, 13],
      ],
    ],
  ],
};

const MultiPolygonExampleBad1 = {
  type: 'MultiPolygon',
  coordinates: [
    [
      [
        [102.0, 2.0, 13],
        [103.0, 2.0, 13],
        [103.0, 3.0, 13],
        [102.0, 3.0, 13],
        [102.0, 2.0, 13],
      ],
    ],
    [
      [100.0, 0.0, 13],
      [101.0, 0.0, 13],
      [101.0, 1.0, 13],
      [100.0, 1.0, 13],
      [100.0, 0.0, 13],
      [
        [100.2, 0.2, 13],
        [100.2, 0.8, 13],
        [100.8, 0.8, 13],
        [100.8, 0.2, 13],
        [100.2, 0.2, 13],
      ],
    ],
  ],
};

const MultiPolygonExampleBad2 = {
  type: 'MultiPolygon',
  coordinates: [
    [
      [
        [102.0, 2.0, 13],
        [103.0, 2.0, 13],
        [103.0, 13],
        [102.0, 3.0, 13],
        [102.0, 2.0, 13],
      ],
    ],
    [
      [
        [100.0, 0.0, 13],
        [101.0, 0.0, 13],
        [101.0, 1.0, 13],
        [100.0, 1.0, 13],
        [100.0, 0.0, 13],
      ],
      [
        [100.2, 0.2, 13],
        [100.2, 0.8, 13],
        [100.8, 0.8, 13],
        [100.8, 0.2, 13],
        [100.2, 0.2, 13],
      ],
    ],
  ],
};

// These do not work
const GeometryCollectionExampleGood1 = {
  type: 'GeometryCollection',
  bbox: [100.0, 0.0, 105.0, 1.0],
  geometries: [{
    type: 'Point',
    coordinates: [100.0, 0.0, 12],
  }, {
    type: 'Point',
    coordinates: [102.0, 0.0, 12],
  }],
};

const GeometryCollectionExampleGood2 = {
  type: 'GeometryCollection',
  bbox: [100.0, 0.0, 105.0, 1.0],
  geometries: [{
    type: 'Point',
    coordinates: [100.0, 0.0, 12],
  }, {
    type: 'LineString',
    coordinates: [
      [101.0, 0.0, 12],
      [102.0, 1.0, 12],
    ],
  }],
};

const GeometryCollectionExampleGood3 = {
  type: 'GeometryCollection',
  bbox: [100.0, 0.0, 105.0, 1.0],
  geometries: [{
    type: 'LineString',
    coordinates: [
      [101.0, 0.0, 12],
      [102.0, 1.0, 12],
    ],
  }, {
    type: 'LineString',
    coordinates: [
      [101.0, 0.0, 12],
      [102.0, 1.0, 12],
    ],
  }],
};

const FeatureExamplePointGood = {
  type: 'Feature',
  geometry: {
    type: 'Point',
    coordinates: [102.0, 0.5, 34],
  },
  properties: {
    prop0: 'value0',
  },
};

const FeatureExampleLineStringGood = {
  type: 'Feature',
  geometry: {
    type: 'LineString',
    coordinates: [
      [102.0, 0.0, 34],
      [103.0, 1.0, 34],
      [104.0, 0.0, 34],
      [105.0, 1.0, 34],
    ],
  },
  properties: {
    prop0: 'value0',
    prop1: 0.0,
  },
};

const FeatureExamplePolygonGood = {
  type: 'Feature',
  bbox: [-10.0, -10.0, 10.0, 10.0],
  geometry: {
    type: 'Polygon',
    coordinates: [
      [
        [100.0, 0.0, 50],
        [101.0, 0.0, 50],
        [101.0, 1.0, 50],
        [100.0, 1.0, 50],
        [100.0, 0.0, 50],
      ],
    ],
  },
  properties: {
    prop0: 'value0',
    prop1: {
      this: 'that',
    },
  },
};

const FeatureCollectionExampleGood = {
  type: 'FeatureCollection',
  bbox: [100.0, 0.0, 105.0, 1.0],
  features: [{
    type: 'Feature',
    geometry: {
      type: 'Point',
      coordinates: [102.0, 0.5, 24],
    },
    properties: {
      prop0: 'value0',
    },
  }, {
    type: 'Feature',
    geometry: {
      type: 'LineString',
      coordinates: [
        [102.0, 0.0, 24],
        [103.0, 1.0, 24],
        [104.0, 0.0, 24],
        [105.0, 1.0, 24],
      ],
    },
    properties: {
      prop0: 'value0',
      prop1: 0.0,
    },
  }, {
    type: 'Feature',
    geometry: {
      type: 'Polygon',
      coordinates: [
        [
          [100.0, 0.0, 24],
          [101.0, 0.0, 24],
          [101.0, 1.0, 24],
          [100.0, 1.0, 24],
          [100.0, 0.0, 24],
        ],
      ],
    },
    properties: {
      prop0: 'value0',
      prop1: {
        this: 'that',
      },
    },
  }],
};

const FeatureCollectionPointsExampleGood = {
  type: 'FeatureCollection',
  bbox: [100.0, 0.0, 105.0, 1.0],
  features: [{
    type: 'Feature',
    geometry: {
      type: 'Point',
      coordinates: [102.0, 0.5, 24],
    },
    properties: {
      prop0: 'value0',
    },
  }, {
    type: 'Feature',
    geometry: {
      type: 'Point',
      coordinates: [102.0, 0.5, 34],
    },
    properties: {
      prop0: 'value0',
      prop1: 0.0,
    },
  }, {
    type: 'Feature',
    geometry: {
      type: 'Point',
      coordinates: [102.0, 0.5, 34],
    },
    properties: {
      prop0: 'value0',
      prop1: {
        this: 'that',
      },
    },
  }],
};

const FeatureCollectionLineStringsExampleGood = {
  type: 'FeatureCollection',
  bbox: [100.0, 0.0, 105.0, 1.0],
  features: [{
    type: 'Feature',
    geometry: {
      type: 'LineString',
      coordinates: [
        [102.0, 0.0, 24],
        [103.0, 1.0, 24],
        [104.0, 0.0, 24],
        [105.0, 1.0, 24],
      ],
    },
    properties: {
      prop0: 'value0',
    },
  }, {
    type: 'Feature',
    geometry: {
      type: 'LineString',
      coordinates: [
        [102.0, 0.0, 24],
        [103.0, 1.0, 24],
        [104.0, 0.0, 24],
        [105.0, 1.0, 24],
      ],
    },
    properties: {
      prop0: 'value0',
      prop1: 0.0,
    },
  }, {
    type: 'Feature',
    geometry: {
      type: 'LineString',
      coordinates: [
        [102.0, 0.0, 24],
        [103.0, 1.0, 24],
        [104.0, 0.0, 24],
        [105.0, 1.0, 24],
      ],
    },
    properties: {
      prop0: 'value0',
      prop1: {
        this: 'that',
      },
    },
  }],
};

const FeatureCollectionPolygonsExampleGood = {
  type: 'FeatureCollection',
  bbox: [100.0, 0.0, 105.0, 1.0],
  features: [{
    type: 'Feature',
    geometry: {
      type: 'Polygon',
      coordinates: [
        [
          [100.0, 0.0, 24],
          [101.0, 0.0, 24],
          [101.0, 1.0, 24],
          [100.0, 1.0, 24],
          [100.0, 0.0, 24],
        ],
      ],
    },
    properties: {
      prop0: 'value0',
    },
  }, {
    type: 'Feature',
    geometry: {
      type: 'Polygon',
      coordinates: [
        [
          [100.0, 0.0, 24],
          [101.0, 0.0, 24],
          [101.0, 1.0, 24],
          [100.0, 1.0, 24],
          [100.0, 0.0, 24],
        ],
      ],
    },
    properties: {
      prop0: 'value0',
      prop1: 0.0,
    },
  }, {
    type: 'Feature',
    geometry: {
      type: 'Polygon',
      coordinates: [
        [
          [100.0, 0.0, 24],
          [101.0, 0.0, 24],
          [101.0, 1.0, 24],
          [100.0, 1.0, 24],
          [100.0, 0.0, 24],
        ],
      ],
    },
    properties: {
      prop0: 'value0',
      prop1: {
        this: 'that',
      },
    },
  }],
};

// validation contexts
const pointValidationContext = Point.newContext();
const lineStringValidationContext = LineString.newContext();
const polygonValidationContext = Polygon.newContext();
const multiPointValidationContext = MultiPoint.newContext();
const multiLineStringValidationContext = MultiLineString.newContext();
const multiPolygonValidationContext = MultiPolygon.newContext();
const geometryCollectionValidationContext = GeometryCollection.newContext();
const featureValidationContext = Feature.newContext();
const featureCollectionValidationContext = FeatureCollection.newContext();
const geoJSONSchemaDefValidationContext = GeoJSONSchemaDef.newContext();

const featurePointValidationContext = FeaturePoint.newContext();
const featureCollectionPointsValidationContext = FeatureCollectionPoints.newContext();
const featureLineStringValidationContext = FeatureLineString.newContext();
const featureCollectionLineStringsValidationContext = FeatureCollectionLineStrings.newContext();
const featurePolygonValidationContext = FeaturePolygon.newContext();
const featureCollectionPolygonsValidationContext = FeatureCollectionPolygons.newContext();

test('Point Example Good', () => {
  expect(pointValidationContext.validate(PointExampleGood)).toBeTruthy();
});

describe('point validation error', () => {
  test('2 items in the array, validation context', () => {
    expect(pointValidationContext.validate(PointExampleBad)).toBeFalsy();
  });

  test('2 items in the array, validation error thrown', () => {
    expect(PointExampleBad).toGiveValidationErrorIn(Point);
  });
});

test('LineString Example Good', () => {
  expect(lineStringValidationContext.validate(LineStringExampleGood)).toBeTruthy();
});

describe('LineString validation error', () => {
  test('1 position in the array, validation context', () => {
    expect(lineStringValidationContext.validate(LineStringExampleBad)).toBeFalsy();
  });

  test('1 position in the array, validation error thrown', () => {
    expect(LineStringExampleBad).toGiveValidationErrorIn(LineString);
  });
});

test('Polygon Example GoodNo Holes', () => {
  expect(polygonValidationContext.validate(PolygonExampleGoodNoHoles)).toBeTruthy();
});

test('Polygon Example Good With Holes', () => {
  expect(polygonValidationContext.validate(PolygonExampleGoodWithHoles)).toBeTruthy();
});

describe('Polygon validation error', () => {
  test('not nested correctly, validation context', () => {
    expect(polygonValidationContext.validate(PolygonExampleBad1)).toBeFalsy();
  });

  test('not nested correctly, validation error thrown', () => {
    expect(PolygonExampleBad1).toGiveValidationErrorIn(Polygon);
  });

  test('last position not equal to first, validation context', () => {
    expect(polygonValidationContext.validate(PolygonExampleBad2)).toBeFalsy();
  });

  test('last position not equal to first, validation error thrown', () => {
    expect(PolygonExampleBad2).toGiveValidationErrorIn(Polygon);
  });

  test('less than 4 positions in the array, validation context', () => {
    expect(polygonValidationContext.validate(PolygonExampleBad3)).toBeFalsy();
  });

  test('less than 4 positions in the array, validation error thrown', () => {
    expect(PolygonExampleBad3).toGiveValidationErrorIn(Polygon);
  });
});

test('MultiPoint Example Good', () => {
  expect(multiPointValidationContext.validate(MultiPointExampleGood)).toBeTruthy();
});

describe('MultiPoint validation error', () => {
  test('2 items in the array, validation context', () => {
    expect(multiPointValidationContext.validate(MultiPointExampleBad)).toBeFalsy();
  });

  test('2 items in the array, validation error thrown', () => {
    expect(MultiPointExampleBad).toGiveValidationErrorIn(MultiPoint);
  });
});

test('MultiLineString Example Good', () => {
  expect(multiLineStringValidationContext.validate(MultiLineStringExampleGood)).toBeTruthy();
});

describe('MultiLineString validation error', () => {
  test('not properly nested, validation context', () => {
    expect(multiLineStringValidationContext.validate(MultiLineStringExampleBad)).toBeFalsy();
  });

  test('not properly nested, validation error thrown', () => {
    expect(MultiLineStringExampleBad).toGiveValidationErrorIn(MultiLineString);
  });
});

test('MultiPolygon Example Good', () => {
  expect(multiPolygonValidationContext.validate(MultiPolygonExampleGood)).toBeTruthy();
});

describe('MultiPolygon validation error', () => {
  test('not properly nested, validation context', () => {
    expect(multiPolygonValidationContext.validate(MultiPolygonExampleBad1)).toBeFalsy();
  });

  test('not properly nested, validation error thrown', () => {
    expect(MultiPolygonExampleBad1).toGiveValidationErrorIn(MultiPolygon);
  });

  test('2 items in position, validation context', () => {
    expect(multiPolygonValidationContext.validate(MultiPolygonExampleBad2)).toBeFalsy();
  });

  test('2 items in position, validation error thrown', () => {
    expect(MultiPolygonExampleBad2).toGiveValidationErrorIn(MultiPolygon);
  });
});

test.skip('GeometryCollection Example Good Point', () => {
  expect(geometryCollectionValidationContext.validate(GeometryCollectionExampleGood1)).toBeTruthy();
});

test.skip('GeometryCollection Example Good Point no error thrown', () => {
  expect(GeometryCollectionExampleGood1).not.toGiveValidationErrorIn(GeometryCollection);
});

test.skip('GeometryCollection Example Good Point + Linstring', () => {
  expect(geometryCollectionValidationContext.validate(GeometryCollectionExampleGood2)).toBeTruthy();
});

test.skip('GeometryCollection Example Good Point + Linstring no error thrown', () => {
  expect(GeometryCollectionExampleGood2).not.toGiveValidationErrorIn(GeometryCollection);
});

test.skip('GeometryCollection Example Good Linetringsx2', () => {
  expect(geometryCollectionValidationContext.validate(GeometryCollectionExampleGood3)).toBeTruthy();
});

test.skip('GeometryCollection Example Good Linetringsx2 no error thrown', () => {
  expect(GeometryCollectionExampleGood3).not.toGiveValidationErrorIn(GeometryCollection);
});

test.skip('Feature Point Example Good', () => {
  expect(featureValidationContext.validate(FeatureExamplePointGood)).toBeTruthy();
});

test.skip('Feature LineString Example Good', () => {
  expect(featureValidationContext.validate(FeatureExampleLineStringGood)).toBeTruthy();
});

test.skip('Feature Polygon Example Good', () => {
  expect(featureValidationContext.validate(FeatureExamplePolygonGood)).toBeTruthy();
});

test.skip('Feature Collection Example Good', () => {
  expect(featureCollectionValidationContext.validate(FeatureCollectionExampleGood)).toBeTruthy();
});

test('FeaturePoint Example Good', () => {
  expect(featurePointValidationContext.validate(FeatureExamplePointGood)).toBeTruthy();
});

test('FeaturePoint Example Good no error thrown', () => {
  expect(FeatureExamplePointGood).not.toGiveValidationErrorIn(FeaturePoint);
});

test('FeatureLineString Example Good', () => {
  expect(featureLineStringValidationContext.validate(FeatureExampleLineStringGood)).toBeTruthy();
});

test('FeatureLineString Example Good no error thrown', () => {
  expect(FeatureExampleLineStringGood).not.toGiveValidationErrorIn(FeatureLineString);
});

test('FeaturePolygon Example Good', () => {
  expect(featurePolygonValidationContext.validate(FeatureExamplePolygonGood)).toBeTruthy();
});

test('FeaturePolygon Example Good no error thrown', () => {
  expect(FeatureExamplePolygonGood).not.toGiveValidationErrorIn(FeaturePolygon);
});

test('FeatureCollectionPoints Example Good', () => {
  expect(featureCollectionPointsValidationContext.validate(FeatureCollectionPointsExampleGood)).toBeTruthy();
});

test('FeatureCollectionPoints Example Good no error thrown', () => {
  expect(FeatureCollectionPointsExampleGood).not.toGiveValidationErrorIn(FeatureCollectionPoints);
});

test('FeatureCollectionLineStrings Example Good', () => {
  expect(featureCollectionLineStringsValidationContext.validate(FeatureCollectionLineStringsExampleGood)).toBeTruthy();
});

test('FeatureCollectionLineStrings Example Good no error thrown', () => {
  expect(FeatureCollectionLineStringsExampleGood).not.toGiveValidationErrorIn(FeatureCollectionLineStrings);
});

test('FeatureCollectionPolygons Example Good', () => {
  expect(featureCollectionPolygonsValidationContext.validate(FeatureCollectionPolygonsExampleGood)).toBeTruthy();
});

test('FeatureCollectionPolygons Example Good no error thrown', () => {
  expect(FeatureCollectionPolygonsExampleGood).not.toGiveValidationErrorIn(FeatureCollectionPolygons);
});
