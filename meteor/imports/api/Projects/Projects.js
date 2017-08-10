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
  location: {
    type: Object,
    label: 'The location of the project.',
  },
  'location.longitude': {
    type: Number,
    label: 'The longitude of the project.',
    max: 180,
    min: -180,
  },
  'location.latitude': {
    type: Number,
    label: 'The latitude of the project.',
    max: 90,
    min: -90,
  },
  'location.zoom': {
    type: Number,
    label: 'The zoom of the location.',
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
