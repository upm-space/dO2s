/* eslint-disable consistent-return */

import { Mongo } from 'meteor/mongo';
import SimpleSchema from 'simpl-schema';

const Batteries = new Mongo.Collection('Batteries');

Batteries.allow({
  insert: () => false,
  update: () => false,
  remove: () => false,
});

Batteries.deny({
  insert: () => true,
  update: () => true,
  remove: () => true,
});


Batteries.schema = new SimpleSchema({
  owner: {
    type: String,
    label: 'The ID of the user this battery belongs to.',
  },
  createdAt: {
    type: String,
    label: 'The date this battery was created in the database.',
    autoValue() {
      if (this.isInsert) return (new Date()).toISOString();
    },
  },
  updatedAt: {
    type: String,
    label: 'The date this battery was last updated.',
    autoValue() {
      if (this.isInsert || this.isUpdate) return (new Date()).toISOString();
    },
  },
  model: {
    type: String,
    label: 'The model of the battery.',
  },
  registrationNumber: {
    type: String,
    label: 'The serial number to identify the battery.',
  },
  amperes: {
    type: Number,
    label: 'The power this battery provides in Amperes.',
    min: 0,
  },
  cellNumber: {
    type: SimpleSchema.Integer,
    label: 'The number of cells this battery has.',
    min: 0,
  },
  weight: {
    type: Number,
    label: 'The weight of this battery in grams.',
    min: 0,
    optional: true,
  },
  deleted: {
    type: String,
    label: 'The date the battery was deleted.',
    autoValue() {
      if (this.isInsert) return 'no';
    },
  },
  logData: {
    type: Object,
    optional: true,
    blackbox: true,
    label: 'Th log data for this battery, for maintenance purposes',
  },
});

Batteries.attachSchema(Batteries.schema);

export default Batteries;
