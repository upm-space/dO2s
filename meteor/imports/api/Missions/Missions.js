/* eslint-disable consistent-return */

import { Mongo } from 'meteor/mongo';
import SimpleSchema from 'simpl-schema';

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

Missions.schema = new SimpleSchema({
  owner: {
    type: String,
    label: 'The ID of the user this mission belongs to.',
  },
  projectId: {
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
  rpaType: {
    type: String,
    label: 'The kind of the remote propelled aircraft used.',
    optional: true,
  },
  type: {
    type: String,
    label: 'The mission type',
    optional: true,
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
    blackbox: true,
  },
  'flightPlan.takeOffPoint': {
    type: Object,
    label: 'All the data related to the flight',
    optional: true,
    blackbox: true,
  },
  'flightPlan.landingPoint': {
    type: Object,
    label: 'All the data related to the flight',
    optional: true,
    blackbox: true,
  },
  'flightPlan.area': {
    type: Object,
    label: 'All the data related to the area for the flight',
    optional: true,
    blackbox: true,
  },
  'flightPlan.flightParameters': {
    type: Object,
    label: 'All the data related to the area for the flight',
    optional: true,
  },
  'flightPlan.flightParameters.altitude': {
    type: Number,
    label: 'The altitude of the flight in meters',
    optional: true,
    min: 0,
  },
  'flightPlan.flightParameters.speed': {
    type: Number,
    label: 'The speed of the flight in meters per second',
    optional: true,
    min: 0,
  },
  'flightPlan.flightParameters.entryMargin': {
    type: Number,
    label: 'The entry margin for the fixed wing rpa in meters',
    optional: true,
    min: 0,
  },
  'flightPlan.cameraParameters': {
    type: Object,
    label: 'All the data related to the area for the flight',
    optional: true,
  },
  'flightPlan.cameraParameters.cameraModel': {
    type: String,
    label: 'The model of the camera',
    optional: true,
  },
  'flightPlan.cameraParameters.focalLength': {
    type: Number,
    label: 'The focal length of the camera in milimeters',
    optional: true,
    min: 0,
  },
  'flightPlan.cameraParameters.sensorWidth': {
    type: Number,
    label: 'The sensor width in milimeters',
    optional: true,
    min: 0,
  },
  'flightPlan.cameraParameters.sensorHeight': {
    type: Number,
    label: 'The sensor height in milimeters',
    optional: true,
    min: 0,
  },
  'flightPlan.cameraParameters.imageWidth': {
    type: Number,
    label: 'The image width in pixels',
    optional: true,
    min: 0,
  },
  'flightPlan.cameraParameters.imageHeight': {
    type: Object,
    label: 'The image height in pixels',
    optional: true,
    min: 0,
  },
  'flightPlan.pictureGrid': {
    type: Object,
    label: 'All the data related to the area for the flight',
    optional: true,
  },
  'flightPlan.pictureGrid.overlap': {
    type: Number,
    label: 'The overlap in %',
    optional: true,
    max: 0,
    min: 100,
  },
  'flightPlan.pictureGrid.sidelap': {
    type: Object,
    label: 'The sidelap in %',
    optional: true,
    max: 0,
    min: 100,
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
