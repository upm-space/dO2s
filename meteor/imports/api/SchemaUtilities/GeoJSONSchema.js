import SimpleSchema from 'simpl-schema';


const Point = new SimpleSchema({
    type: {
        type: String,
        label: 'The type of the feature.',
        allowedValues: ['Point'],
    },
    coordinates: {
        type: Array,
        minCount: 3,
        maxCount: 3,
        label: 'The coordinates of the point',
    },
    'coordinates.$': {
        type: Number,
        label: 'The coordinates of the point',
    },
});

const LineString = new SimpleSchema({
    type: {
        type: String,
        label: 'The type of the feature.',
        allowedValues: ['LineString'],
    },
    coordinates: {
        type: Array,
        minCount: 2,
        label: 'The coordinates of the LineString',
    },
    'coordinates.$': {
        type: Array,
        minCount: 3,
        maxCount: 3,
        label: 'The coordinates of the point',
    },
    'coordinates.$.$': {
        type: Number,
        label: 'The coordinates of the point',
    },
});

const Polygon = new SimpleSchema({
    type: {
        type: String,
        label: 'The type of the feature.',
        allowedValues: ['Polygon'],
    },
    coordinates: {
        type: Array,
        minCount: 1,
        label: 'The coordinates of the Polygon',
    },
    'coordinates.$': {
        type: Array,
        minCount: 2,
        label: 'The coordinates of the line',
    },
    'coordinates.$.$': {
        type: Array,
        minCount: 3,
        maxCount: 3,
        label: 'The coordinates of the point',
    },
    'coordinates.$.$.$': {
        type: Number,
        label: 'The coordinates of the point',
    },
});


const Feature = new SimpleSchema({
    type: {
        type: String,
        label: 'The type of the feature.',
        allowedValues: ['Feature'],
    },
    geometry: {
        type: SimpleSchema.oneOf(Point, LineString, Polygon),
        label: 'The geometry of the feature',
    },
    properties: {
        type: Object,
        label: 'Extra properties for the feature',
        blackbox: true,
    },
});

export default FeatureCollection = new SimpleSchema({
    type: {
        type: String,
        label: 'The type of the feature.',
        allowedValues: ['FeatureCollection'],
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
