/* eslint-disable meteor/audit-argument-checks */
import { Meteor } from 'meteor/meteor';
import { check } from 'meteor/check';
import Projects from './Projects';
import rateLimit from '../../modules/rate-limit';

const newProjectSchema = Projects.schema.pick('name', 'description', 'mapLocation');

const editProjectSchema = Projects.schema.pick('name', 'description', 'mapLocation');
editProjectSchema.extend({ _id: String });

Meteor.methods({
  'projects.insert': function projectsInsert(project) {
    try {
      newProjectSchema.validate(project);
      return Projects.insert({ owner: this.userId, ...project });
    } catch (exception) {
      if (exception.error === 'validation-error') {
        throw new Meteor.Error(500, exception.message);
      }
      throw new Meteor.Error('500', exception);
    }
  },
  'projects.update': function projectsUpdate(project) {
    try {
      editProjectSchema.validate(project);
      const projectId = project._id;
      Projects.update(projectId, { $set: project });
      return projectId;
       // Return _id so we can redirect to project after update.
    } catch (exception) {
      if (exception.error === 'validation-error') {
        throw new Meteor.Error(500, exception.message);
      }
      throw new Meteor.Error('500', exception);
    }
  },
  'projects.softDelete': function projectsSoftDelete(projectId) {
    check(projectId, String);
    try {
      Projects.update(projectId, { $set: { deleted: (new Date()).toISOString() } });
    } catch (exception) {
      throw new Meteor.Error('500', exception);
    }
  },
  'projects.restore': function projectsRestore(projectId) {
    check(projectId, String);
    try {
      Projects.update(projectId, { $set: { deleted: 'no' } });
    } catch (exception) {
      throw new Meteor.Error('500', exception);
    }
  },
  'projects.hardDelete': function projectsHardDelete(projectId) {
    check(projectId, String);
    try {
      return Projects.remove(projectId);
    } catch (exception) {
      throw new Meteor.Error('500', exception);
    }
  },
  'projects.setDone': function projectsSetDone(projectId, setDone) {
    check(projectId, String);
    check(setDone, Boolean);
    try {
      Projects.update(projectId, { $set: { done: setDone } });
    } catch (exception) {
      throw new Meteor.Error('500', exception);
    }
  },
});

rateLimit({
  methods: [
    'projects.insert',
    'projects.update',
    'projects.softDelete',
    'projects.restore',
    'projects.hardDelete',
    'projects.setDone',
  ],
  limit: 5,
  timeRange: 1000,
});
