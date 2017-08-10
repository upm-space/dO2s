import { Meteor } from 'meteor/meteor';
import { check } from 'meteor/check';
import Missions from './Missions';
import rateLimit from '../../modules/rate-limit';

Meteor.methods({
  'missions.insert': function missionsInsert(mission) {
    check(mission, {
      name: String,
      projectId: String,
      rpaType: String,
      type: String,
      description: String,
    });

    try {
      return Missions.insert({ owner: this.userId, ...mission });
    } catch (exception) {
      throw new Meteor.Error('500', exception);
    }
  },
  'missions.update': function missionsUpdate(mission) {
    check(mission, {
      _id: String,
      name: String,
      projectId: String,
      rpaType: String,
      type: String,
      description: String,
    });
    try {
      const missionId = mission._id;
      Missions.update(missionId, { $set: mission });
      return missionId; // Return _id so we can redirect to document after update.
    } catch (exception) {
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
