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

const flightParametersSchema = new SimpleSchema({
  altitude: {
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
});

const pictureGridSchema = new SimpleSchema({
  overlap: {
    type: Number,
    label: 'The overlap in %',
    max: 0,
    min: 100,
  },
  sidelap: {
    type: Object,
    label: 'The sidelap in %',
    max: 0,
    min: 100,
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
    type: Object,
    label: 'The take off point for the flight',
    optional: true,
    blackbox: true,
  },
  'flightPlan.landingPoint': {
    type: Object,
    label: 'The landing point for the flight',
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
    type: flightParametersSchema,
    label: 'Data related to the flight',
    optional: true,
  },
  'flightPlan.pictureGrid': {
    type: pictureGridSchema,
    label: 'All the data related to the area for the flight',
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
