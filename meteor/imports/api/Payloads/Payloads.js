/* eslint-disable consistent-return */

import { Mongo } from 'meteor/mongo';
import SimpleSchema from 'simpl-schema';

const Payloads = new Mongo.Collection('Payloads');

Payloads.allow({
  insert: () => false,
  update: () => false,
  remove: () => false,
});

Payloads.deny({
  insert: () => true,
  update: () => true,
  remove: () => true,
});

const cameraParametersSchema = new SimpleSchema({
  focalLength: {
    type: Number,
    label: 'The focal length of the camera in milimeters',
    min: 0,
  },
  sensorWidth: {
    type: Number,
    label: 'The sensor width in milimeters',
    min: 0,
  },
  sensorHeight: {
    type: Number,
    label: 'The sensor height in milimeters',
    min: 0,
  },
  imageWidth: {
    type: Number,
    label: 'The image width in pixels',
    min: 0,
  },
  imageHeight: {
    type: Number,
    label: 'The image height in pixels',
    min: 0,
  },
});

Payloads.schema = new SimpleSchema({
  owner: {
    type: String,
    label: 'The ID of the user this payload belongs to.',
  },
  createdAt: {
    type: String,
    label: 'The date this payload was created.',
    autoValue() {
      if (this.isInsert) return (new Date()).toISOString();
    },
  },
  updatedAt: {
    type: String,
    label: 'The date this payload was last updated.',
    autoValue() {
      if (this.isInsert || this.isUpdate) return (new Date()).toISOString();
    },
  },
  name: {
    type: String,
    label: 'A name to identify the payload.',
  },
  registrationNumber: {
    type: String,
    label: 'The serial number to identify the payload.',
    optional: true,
  },
  model: {
    type: String,
    label: 'The model of the payload.',
  },
  weight: {
    type: Number,
    label: 'The weight of this payload in grams.',
    min: 0,
    optional: true,
  },
  payloadType: {
    type: String,
    allowedValues: ['Camera'],
    label: 'The type of sensor of the payload.',
  },
  deleted: {
    type: String,
    label: 'The date the payload was deleted.',
    autoValue() {
      if (this.isInsert) return 'no';
    },
  },
  sensorParameters: {
    type: SimpleSchema.oneOf(cameraParametersSchema),
    label: 'The parameters for the payload sensor.',
  },
});

Payloads.attachSchema(Payloads.schema);

export default Payloads;
