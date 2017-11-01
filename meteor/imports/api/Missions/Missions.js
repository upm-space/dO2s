/* eslint-disable consistent-return */

import { Mongo } from 'meteor/mongo';
import SimpleSchema from 'simpl-schema';
import { FeaturePoint, FeaturePolygon, FeatureLineString, FeatureCollectionPoints } from '../SchemaUtilities/GeoJSONSchema.js';

const Missions = new Mongo.Collection('Missions');

Missions.allow({
  insert: () => false,
  update: () => false,
  remove: () => false,
});

Missions.deny({
  insert: () => true,
  update: () => true,
  remove: () => true,
});

const flightParametersSchema = new SimpleSchema({
  height: {
    type: Number,
    label: 'The altitude of the flight in meters',
    min: 0,
  },
  speed: {
    type: Number,
    label: 'The speed of the flight in meters per second',
    min: 0,
  },
  entryMargin: {
    type: Number,
    label: 'The entry margin for the fixed wing rpa in meters',
    min: 0,
  },
  axisBuffer: {
    type: Number,
    label: 'The entry axis buffer for the linear mission in meters',
    min: 0,
    optional: true,
  },
});

const pictureGridSchema = new SimpleSchema({
  overlap: {
    type: Number,
    label: 'The overlap in %',
    min: 0,
    max: 100,
  },
  sidelap: {
    type: Number,
    label: 'The sidelap in %',
    min: 0,
    max: 100,
  },
});

const missionCalculatedDataSchema = new SimpleSchema({
  flightTime: {
    type: String,
    label: 'The time it takes to complete the mission',
    min: 0,
    optional: true,
  },
  flightTimeMinutes: {
    type: Number,
    label: 'The time it takes to complete the mission in minutes',
    min: 0,
    optional: true,
  },
  pathLength: {
    type: Number,
    label: 'The length the rpa is going to travel in meters',
    min: 0,
    optional: true,
  },
  resolution: {
    type: Number,
    label: 'The ground resolution obtained in cm/px',
    min: 0,
    optional: true,
  },
  shootTime: {
    type: Number,
    label: 'Time betweeen photos in seconds',
    min: 0,
    optional: true,
  },
  totalArea: {
    type: Number,
    label: 'The total area for the photogrametric image in hectares',
    min: 0,
    optional: true,
  },
});

const missionCalculationSchema = new SimpleSchema({
  waypointList: {
    type: FeatureCollectionPoints,
    label: 'Feature Collection representing the waypoints for the mission',
    optional: true,
  },
  missionCalculatedData: {
    type: missionCalculatedDataSchema,
    label: 'This is the data obtained from calculating the mission',
    optional: true,
  },
});

Missions.schema = new SimpleSchema({
  owner: {
    type: String,
    label: 'The ID of the user this mission belongs to.',
  },
  project: {
    type: String,
    label: 'The ID of the project this mission belongs to.',
  },
  createdAt: {
    type: String,
    label: 'The date this mission was created.',
    autoValue() {
      if (this.isInsert) return (new Date()).toISOString();
    },
  },
  updatedAt: {
    type: String,
    label: 'The date this mission was last updated.',
    autoValue() {
      if (this.isInsert || this.isUpdate) return (new Date()).toISOString();
    },
  },
  name: {
    type: String,
    label: 'The name of the mission.',
  },
  description: {
    type: String,
    label: 'The description of the mission.',
    optional: true,
  },
  rpa: {
    type: String,
    label: 'The ID of the remote propelled aircraft used.',
  },
  payload: {
    type: String,
    label: 'The ID of the payload used.',
  },
  missionType: {
    type: String,
    label: 'The mission type',
    allowedValues: ['Surface Area', 'Linear Area'],
  },
  layers: {
    type: Array,
    label: 'The layers requested for the mission',
    optional: true,
  },
  'layers.$': {
    type: String,
    label: 'The name of the layer requested for the mission',
  },
  flightPlan: {
    type: Object,
    label: 'All the data related to the flight',
    optional: true,
  },
  'flightPlan.takeOffPoint': {
    type: FeaturePoint,
    label: 'The take off point for the flight',
    optional: true,
  },
  'flightPlan.landingPoint': {
    type: FeaturePoint,
    label: 'The landing point for the flight',
    optional: true,
  },
  'flightPlan.missionArea': {
    type: FeaturePolygon,
    label: 'All the data related to the area for the flight',
    optional: true,
  },
  'flightPlan.missionAxis': {
    type: FeatureLineString,
    label: 'All the data related to the axis for the flight',
    optional: true,
  },
  'flightPlan.flightParameters': {
    type: flightParametersSchema,
    label: 'Data related to the flight',
    optional: true,
  },
  'flightPlan.pictureGrid': {
    type: pictureGridSchema,
    label: 'All the data related to the area for the flight',
    optional: true,
  },
  'flightPlan.missionCalculation': {
    type: missionCalculationSchema,
    label: 'This is where we store the data from the waypoint calculation',
    optional: true,
  },
  deleted: {
    type: String,
    label: 'The date the mission was deleted.',
    autoValue() {
      if (this.isInsert) return 'no';
    },
  },
  done: {
    type: Boolean,
    label: 'Is the mission done?',
    autoValue() {
      if (this.isInsert) return false;
    },
  },
  status: {
    type: String,
    label: 'How is the mission doing?',
    optional: true,
  },
});

Missions.attachSchema(Missions.schema);

export default Missions;
