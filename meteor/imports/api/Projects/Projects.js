/* eslint-disable consistent-return */

import { Mongo } from 'meteor/mongo';
import SimpleSchema from 'simpl-schema';

const Projects = new Mongo.Collection('Projects');

Projects.allow({
  insert: () => false,
  update: () => false,
  remove: () => false,
});

Projects.deny({
  insert: () => true,
  update: () => true,
  remove: () => true,
});

const mapLocationSchema = new SimpleSchema({
  longitude: {
    type: Number,
    label: 'The longitude of the project.',
    max: 180,
    min: -180,
  },
  latitude: {
    type: Number,
    label: 'The latitude of the project.',
    max: 90,
    min: -90,
  },
  zoom: {
    type: Number,
    label: 'The zoom of the location.',
  },
});

Projects.schema = new SimpleSchema({
  owner: {
    type: String,
    label: 'The ID of the user this project belongs to.',
  },
  createdAt: {
    type: String,
    label: 'The date this project was created.',
    autoValue() {
      if (this.isInsert) return (new Date()).toISOString();
    },
  },
  updatedAt: {
    type: String,
    label: 'The date this project was last updated.',
    autoValue() {
      if (this.isInsert || this.isUpdate) return (new Date()).toISOString();
    },
  },
  name: {
    type: String,
    label: 'The name of the project.',
  },
  description: {
    type: String,
    optional: true,
    label: 'The description of the project.',
  },
  mapLocation: {
    type: mapLocationSchema,
    label: 'The location of the project for the map.',
  },
  deleted: {
    type: String,
    label: 'The date the project was deleted.',
    autoValue() {
      if (this.isInsert) return 'no';
    },
  },
  done: {
    type: Boolean,
    label: 'Is the project done?',
    autoValue() {
      if (this.isInsert) return false;
    },
  },
});

Projects.attachSchema(Projects.schema);

export default Projects;
