/* eslint-disable meteor/audit-argument-checks */
import { Meteor } from 'meteor/meteor';
import { check } from 'meteor/check';
import Missions from './Missions';
import rateLimit from '../../modules/rate-limit';

const newMissionSchema = Missions.schema.pick('name', 'project', 'rpaType', 'type', 'description');

const editMissionSchema = Missions.schema.pick('name', 'project', 'rpaType', 'type', 'description', '_id');

Meteor.methods({
  'missions.insert': function missionsInsert(mission) {
    try {
      newMissionSchema.validate(mission);
      return Missions.insert({ owner: this.userId, ...mission });
    } catch (exception) {
      if (exception.error === 'validation-error') {
        throw new Meteor.Error(500, exception.message);
      }
      throw new Meteor.Error('500', exception);
    }
  },
  'missions.update': function missionsUpdate(mission) {
    try {
      editMissionSchema.validate(mission);
      const missionId = mission._id;
      Missions.update(missionId, { $set: mission });
      return missionId; // Return _id so we can redirect to document after update.
    } catch (exception) {
      if (exception.error === 'validation-error') {
        throw new Meteor.Error(500, exception.message);
      }
      throw new Meteor.Error('500', exception);
    }
  },
  'missions.softDelete': function missionsSoftDelete(missionId) {
    check(missionId, String);
    try {
      Missions.update(missionId, { $set: { deleted: (new Date()).toISOString() } });
    } catch (exception) {
      throw new Meteor.Error('500', exception);
    }
  },
  'missions.restore': function missionsRestore(missionId) {
    check(missionId, String);
    try {
      Missions.update(missionId, { $set: { deleted: 'no' } });
    } catch (exception) {
      throw new Meteor.Error('500', exception);
    }
  },
  'missions.hardDelete': function missionsHardDelete(missionId) {
    check(missionId, String);
    try {
      return Missions.remove(missionId);
    } catch (exception) {
      throw new Meteor.Error('500', exception);
    }
  },
  'missions.setDone': function missionsSetDone(missionId, setDone) {
    check(missionId, String);
    check(setDone, Boolean);
    try {
      Missions.update(missionId, { $set: { done: setDone } });
    } catch (exception) {
      throw new Meteor.Error('500', exception);
    }
  },
});

rateLimit({
  methods: [
    'missions.insert',
    'missions.update',
    'missions.softDelete',
    'missions.restore',
    'missions.hardDelete',
    'missions.setDone',
  ],
  limit: 5,
  timeRange: 1000,
});
