/* eslint-disable meteor/audit-argument-checks */
import { Meteor } from 'meteor/meteor';
import { check } from 'meteor/check';
import Missions from './Missions';
import rateLimit from '../../modules/rate-limit';
import { FeaturePoint, FeaturePolygon, FeatureLineString } from '../SchemaUtilities/GeoJSONSchema.js';

const newMissionSchema = Missions.schema.pick('name', 'project', 'rpa', 'missionType', 'description', 'payload', 'flightPlan');

const editMissionSchema = Missions.schema.pick('name', 'project', 'rpa', 'missionType', 'description', 'payload', 'flightPlan');
editMissionSchema.extend({ _id: String });

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
  'missions.setTakeOffPoint': function missionsSetTakeOffPoint(missionId, takeOffPoint) {
    check(missionId, String);
    try {
      FeaturePoint.validate(takeOffPoint);
      Missions.update(missionId, { $set: { 'flightPlan.takeOffPoint': takeOffPoint } });
    } catch (exception) {
      if (exception.error === 'validation-error') {
        throw new Meteor.Error(500, exception.message);
      }
      throw new Meteor.Error('500', exception);
    }
  },
  'missions.setLandingPoint': function missionsSetLandingPoint(missionId, landingPoint) {
    check(missionId, String);
    try {
      FeaturePoint.validate(landingPoint);
      Missions.update(missionId, { $set: { 'flightPlan.landingPoint': landingPoint } });
    } catch (exception) {
      if (exception.error === 'validation-error') {
        throw new Meteor.Error(500, exception.message);
      }
      throw new Meteor.Error('500', exception);
    }
  },
  'missions.setMissionGeometry': function missionsSetMissionGeometry(missionId, missionGeometry) {
    check(missionId, String);
    try {
      const mission = Missions.findOne(missionId);
      if (missionGeometry) {
        if (mission.missionType === 'Surface Area') {
          FeaturePolygon.validate(missionGeometry);
          Missions.update(missionId, { $set: { 'flightPlan.missionArea': missionGeometry } });
        } else if (mission.missionType === 'Linear Area') {
          FeatureLineString.validate(missionGeometry);
          Missions.update(missionId, { $set: { 'flightPlan.missionAxis': missionGeometry } });
        }
      } else if (!missionGeometry) {
        if (mission.missionType === 'Surface Area') {
          Missions.update(missionId, { $unset: { 'flightPlan.missionArea': '' } });
        } else if (mission.missionType === 'Linear Area') {
          Missions.update(missionId, { $unset: { 'flightPlan.missionAxis': '' } });
        }
      }
    } catch (exception) {
      if (exception.error === 'validation-error') {
        throw new Meteor.Error(500, exception.message);
      }
      throw new Meteor.Error('500', exception);
    }
  },
  'missions.setMissionAxisBuffer': function missionsSetMissionAxisBuffer(missionId, missionAxisBuffer) {
    check(missionId, String);
    check(missionAxisBuffer, Number);
    try {
      const mission = Missions.findOne(missionId);
      if (mission.missionType === 'Surface Area') {
        throw new Meteor.Error(500, 'How on earth did you get here!!');
      } else if (mission.missionType === 'Linear Area') {
        Missions.update(missionId, { $set: { 'flightPlan.missionAxis.properties.axisBuffer': missionAxisBuffer } });
      }
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
    'missions.setLandingPoint',
    'missions.setTakeOffPoint',
    'missions.setMissionGeometry',
    'missions.setMissionAxisBuffer',
  ],
  limit: 5,
  timeRange: 1000,
});
