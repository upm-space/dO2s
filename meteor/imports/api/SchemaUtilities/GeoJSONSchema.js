/* eslint-disable consistent-return,max-len */
import SimpleSchema from 'simpl-schema';

// Fundalmental geometry definitions
export const Position = new SimpleSchema({
  coordinates: {
    type: Array,
    label: 'A single position. Fundamental geometry construct. The order for the elements is longitude (easting) and latitude (northing), in that precise order, altitude or elevation MAY be included.',
    minCount: 3,
    maxCount: 3,
  },
  'coordinates.$': {
    type: Number,
    label: 'A number representing longitude (easting), latitude (northing), altitude or elevation',
  },
});

export const PositionArray = new SimpleSchema({
  coordinates: {
    type: Array,
    label: 'An array of positions',
  },
  'coordinates.$': {
    type: Array,
    label: 'A single position.',
    minCount: 3,
    maxCount: 3,
  },
  'coordinates.$.$': {
    type: Number,
    label: 'A number representing longitude (easting), latitude (northing), altitude or elevation',
  },
});

export const LineStringDef = new SimpleSchema({
  coordinates: {
    type: Array,
    label: 'An array of two or more positions',
    minCount: 2,
  },
  'coordinates.$': {
    type: Array,
    label: 'A single position.',
    minCount: 3,
    maxCount: 3,
  },
  'coordinates.$.$': {
    type: Number,
    label: 'A number representing longitude (easting), latitude (northing), altitude or elevation',
  },
});

export const LineStringArray = new SimpleSchema({
  coordinates: {
    type: Array,
    label: 'An array of lineStrings',
  },
  'coordinates.$': {
    type: Array,
    label: 'A single lineString. An array of two or more positions',
    minCount: 2,
  },
  'coordinates.$.$': {
    type: Array,
    label: 'A single position.',
    minCount: 3,
    maxCount: 3,
  },
  'coordinates.$.$.$': {
    type: Number,
    label: 'A number representing longitude (easting), latitude (northing), altitude or elevation',
  },
});

export const PolygonDef = new SimpleSchema({
  coordinates: {
    type: Array,
    label: 'An array of linear rings, the first must be the exterior ring, any others must be the interior rings',
  },
  'coordinates.$': {
    type: Array,
    label: 'A linear Ring. An array of four or more positions where the first equals the last, follows right-hand rule in respect with the area it bounds. Exterior rings are counterclockwise and holes are clockwise',
    minCount: 4,
    custom() {
      const lastPositionIndex = this.value.length - 1;
      if (this.value[0].length !== this.value[lastPositionIndex].length) {
        return 'Positions do not have same number of items';
      }
      for (let i = 0; i < this.value[0].length; i += 1) {
        if (this.value[0][i] !== this.value[lastPositionIndex][i]) {
          return 'First and Last Point must be equal.';
        }
      }
    },
  },
  'coordinates.$.$': {
    type: Array,
    label: 'A single position.',
    minCount: 3,
    maxCount: 3,
  },
  'coordinates.$.$.$': {
    type: Number,
    label: 'A number representing longitude (easting), latitude (northing), altitude or elevation',
  },
});

export const PolygonArray = new SimpleSchema({
  coordinates: {
    type: Array,
    label: 'An array of polygons',
  },
  'coordinates.$': {
    type: Array,
    label: 'A single polygon. An array of linear rings, the first must be the exterior ring, any others must be the interior rings',
  },
  'coordinates.$.$': {
    type: Array,
    label: 'A linearRing. An array of four or more positions where the first equals the last, follows right-hand rule in respect with the area it bounds. Exterior rings are counterclockwise and holes are clockwise',
    minCount: 4,
    custom() {
      const lastPositionIndex = this.value.length - 1;
      if (this.value[0].length !== this.value[lastPositionIndex].length) {
        return 'Positions do not have same number of items';
      }
      for (let i = 0; i < this.value[0].length; i += 1) {
        if (this.value[0][i] !== this.value[lastPositionIndex][i]) {
          return 'First and Last Point must be equal.';
        }
      }
    },
  },
  'coordinates.$.$.$': {
    type: Array,
    label: 'A single position.',
    minCount: 3,
    maxCount: 3,
  },
  'coordinates.$.$.$.$': {
    type: Number,
    label: 'A number representing longitude (easting), latitude (northing), altitude or elevation',
  },
});

// Geometry Primitives
export const Point = new SimpleSchema({
  type: {
    type: String,
    label: 'The type of the feature.',
    allowedValues: ['Point'],
  },
});
Point.extend(Position.pick('coordinates'));

export const LineString = new SimpleSchema({
  type: {
    type: String,
    label: 'The type of the feature.',
    allowedValues: ['LineString'],
  },
});
LineString.extend(LineStringDef.pick('coordinates'));

export const Polygon = new SimpleSchema({
  type: {
    type: String,
    label: 'The type of the feature.',
    allowedValues: ['Polygon'],
  },
});
Polygon.extend(PolygonDef.pick('coordinates'));

// Multipart Geometries
export const MultiPoint = new SimpleSchema({
  type: {
    type: String,
    label: 'The type of the feature.',
    allowedValues: ['MultiPoint'],
  },
});
MultiPoint.extend(PositionArray.pick('coordinates'));

export const MultiLineString = new SimpleSchema({
  type: {
    type: String,
    label: 'The type of the feature.',
    allowedValues: ['MultiLineString'],
  },
});
MultiLineString.extend(LineStringArray.pick('coordinates'));

export const MultiPolygon = new SimpleSchema({
  type: {
    type: String,
    label: 'The type of the feature.',
    allowedValues: ['MultiPolygon'],
  },
});
MultiPolygon.extend(PolygonArray.pick('coordinates'));

// Collections
export const GeometryCollection = new SimpleSchema({
  type: {
    type: String,
    label: 'A GeometryCollection has a member with the name "geometries". Each element of this array is a GeoJSON Geometry object. GeometryCollections composed of a single part or a number of parts of a single type SHOULD be avoided',
    allowedValues: ['GeometryCollection'],
  },
  bbox: {
    type: Array,
    label: 'Includes information on the coordinate range. Length 2*n where n is the number of dimensions represented in the contained geometries. Axes order of bbox follows the axes order of geometries. The values of a "bbox" array are "[west, south, east, north]", not "[minx, miny, maxx, maxy]".',
    optional: true,
  },
  'bbox.$': {
    type: Number,
  },
  geometries: {
    type: Array,
    label: 'An array of GeoJSON Geometry objects',
  },
  'geometries.$': {
    type: SimpleSchema.oneOf(Point, MultiPoint, LineString, MultiLineString, Polygon, MultiPolygon),
    label: 'GeoJSON Geometry objects',
  },
});

export const Feature = new SimpleSchema({
  type: {
    type: String,
    label: 'A Feature object represents a spatially bounded entity.',
    allowedValues: ['Feature'],
  },
  id: {
    type: SimpleSchema.oneOf(String, Number),
    label: 'Commonly used identifier',
  },
  bbox: {
    type: Array,
    label: 'Includes information on the coordinate range. Length 2*n where n is the number of dimensions represented in the contained geometries. Axes order of bbox follows the axes order of geometries',
    optional: true,
  },
  'bbox.$': {
    type: Number,
  },
  geometry: {
    type: SimpleSchema.oneOf(Point, MultiPoint, LineString, MultiLineString, Polygon, MultiPolygon, GeometryCollection),
    label: 'The value of the geometry member SHALL be either a Geometry object as defined above or, in the case that the Feature is unlocated, a JSON null value.',
  },
  properties: {
    type: Object,
    label: 'Extra properties for the feature',
    blackbox: true,
  },
});

export const FeatureCollection = new SimpleSchema({
  type: {
    type: String,
    label: 'The type of the feature.',
    allowedValues: ['FeatureCollection'],
  },
  bbox: {
    type: Array,
    label: 'Includes information on the coordinate range. Length 2*n where n is the number of dimensions represented in the contained geometries. Axes order of bbox follows the axes order of geometries',
    optional: true,
  },
  'bbox.$': {
    type: Number,
  },
  features: {
    type: Array,
    label: 'An array of the features',
  },
  'features.$': {
    type: Feature,
    label: 'A feature object',
  },
});

export const GeoJSONSchemaDef = new SimpleSchema({
  GeoJSON: {
    type: SimpleSchema.oneOf(Point, LineString, Polygon, MultiPoint, MultiLineString, MultiPolygon, GeometryCollection, Feature, FeatureCollection),
  },
});

// export default GeoJSONSchemaDef;
