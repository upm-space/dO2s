/* eslint-disable consistent-return */
import { Mongo } from 'meteor/mongo';
import SimpleSchema from 'simpl-schema';

const RPAs = new Mongo.Collection('RPAs');

RPAs.allow({
  insert: () => false,
  update: () => false,
  remove: () => false,
});

RPAs.deny({
  insert: () => true,
  update: () => true,
  remove: () => true,
});

const flightParametersSchema = new SimpleSchema({
  maxDescendSlope: {
    type: SimpleSchema.Integer,
    label: 'The max slope for the descend of the rpa in meters',
    min: 0,
    max: 100,
  },
  maxAscendSlope: {
    type: SimpleSchema.Integer,
    label: 'The max slope for the descend of the rpa in meters',
    min: 0,
    max: 100,
  },
  optimalLandingSlope: {
    type: SimpleSchema.Integer,
    label: 'The optimal slope for the landing the rpa in %',
    min: 0,
    max: 100,
  },
  optimalTakeOffSlope: {
    type: SimpleSchema.Integer,
    label: 'The optimal slope for the takeoff of the rpa in %',
    min: 0,
    max: 100,
  },
  maxLandSpeed: {
    type: SimpleSchema.Integer,
    label: 'The max landing speed for the copter rpa in cm/s',
    min: 0,
    max: 200,
  },
});

RPAs.schema = new SimpleSchema({
  owner: {
    type: String,
    label: 'The ID of the user this rpa belongs to.',
  },
  createdAt: {
    type: String,
    label: 'The date this rpa was created.',
    autoValue() {
      if (this.isInsert) return (new Date()).toISOString();
    },
  },
  updatedAt: {
    type: String,
    label: 'The date this rpa was last updated.',
    autoValue() {
      if (this.isInsert || this.isUpdate) return (new Date()).toISOString();
    },
  },
  name: {
    type: String,
    label: 'The name of the rpa.',
  },
  rpaType: {
    type: String,
    label: 'The type of the rpa.',
    allowedValues: ['Plane', 'MultiCopter'],
  },
  model: {
    type: String,
    label: 'The model of the rpa.',
    optional: true,
  },
  registrationNumber: {
    type: String,
    label: 'The registration number of this rpa.',
    optional: true,
  },
  constructionDate: {
    type: String,
    label: 'The date this rpa was built.',
    optional: true,
  },
  serialNumber: {
    type: String,
    label: 'The serial number of this rpa.',
    optional: true,
  },
  weight: {
    type: Number,
    label: 'The weight of this rpa in grams.',
    min: 0,
    optional: true,
  },
  flightParameters: {
    type: flightParametersSchema,
    label: 'The parameters for the rpa flight.',
  },
  deleted: {
    type: String,
    label: 'The date the rpa was deleted.',
    autoValue() {
      if (this.isInsert) return 'no';
    },
  },
});

RPAs.attachSchema(RPAs.schema);

export default RPAs;
