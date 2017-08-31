import SimpleSchema from 'simpl-schema';

const Point = new SimpleSchema({
    type: {
        type: Number,
        label: 'The altitude of the flight in meters',
        min: 0,
    },
    coordinates: {
        type: Number,
        label: 'The speed of the flight in meters per second',
        min: 0,
    },
    entryMargin: {
        type: Number,
        label: 'The entry margin for the fixed wing rpa in meters',
        min: 0,
    },
});