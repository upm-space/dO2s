import { Meteor } from 'meteor/meteor';
import { check } from 'meteor/check';
import Projects from './Projects';
import rateLimit from '../../modules/rate-limit';

Meteor.methods({
  'projects.insert': function projectsInsert(project) {
    check(project, {
      name: String,
      description: String,
      location: {
        longitude: Number,
        latitude: Number,
        zoom: Number,
      },
    });

    try {
      return Projects.insert({ owner: this.userId, ...project });
    } catch (exception) {
      throw new Meteor.Error('500', exception);
    }
  },
  'projects.update': function projectsUpdate(project) {
    check(project, {
      _id: String,
      name: String,
      description: String,
      location: {
        longitude: Number,
        latitude: Number,
        zoom: Number,
      },
    });
    try {
      const projectId = project._id;
      Projects.update(projectId, { $set: project });
      return projectId; // Return _id so we can redirect to document after update.
    } catch (exception) {
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
