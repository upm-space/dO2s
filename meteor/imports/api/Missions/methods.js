/* eslint-disable meteor/audit-argument-checks */
import { Meteor } from 'meteor/meteor';
import { check } from 'meteor/check';
import Missions from './Missions';
import rateLimit from '../../modules/rate-limit';
import { FeaturePoint, FeaturePolygon, FeatureLineString, FeatureCollectionPoints } from '../SchemaUtilities/GeoJSONSchema.js';
import { setWaypointNumbers } from '../../modules/waypoint-utilities';

const newMissionSchema = Missions.schema.pick('name', 'project', 'rpa', 'missionType', 'description', 'payload');

const importMissionSchema = Missions.schema.pick('name', 'project', 'rpa', 'missionType', 'description', 'payload', 'flightPlan');

const editMissionSchema = Missions.schema.pick('name', 'project', 'rpa', 'missionType', 'description', 'payload');
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
  'missions.import': function missionsImport(mission) {
    try {
      importMissionSchema.validate(mission);
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
  'missions.setFlightParams': function missionsSetFlightParams(missionId, flightParameters) {
    check(missionId, String);
    try {
      const flightParamsSchema = Missions.schema.getObjectSchema('flightPlan.flightParameters');
      flightParamsSchema.validate(flightParameters);
      Missions.update(missionId, {
        $set: { 'flightPlan.flightParameters': flightParameters },
      });
    } catch (exception) {
      if (exception.error === 'validation-error') {
        throw new Meteor.Error(500, exception.message);
      }
      throw new Meteor.Error('500', exception);
    }
  },
  'missions.setPictureGrid': function missionsSetPictureGrid(missionId, pictureGrid) {
    check(missionId, String);
    try {
      const pictureGridSchema = Missions.schema.getObjectSchema('flightPlan.pictureGrid');
      pictureGridSchema.validate(pictureGrid);
      Missions.update(missionId, {
        $set: { 'flightPlan.pictureGrid': pictureGrid },
      });
    } catch (exception) {
      if (exception.error === 'validation-error') {
        throw new Meteor.Error(500, exception.message);
      }
      throw new Meteor.Error('500', exception);
    }
  },

  'missions.setMissionCalculations': function missionsSetMissionCalculations(missionId, missionCalculationsData) {
    try {
      const missionCalculatedDataSchema = Missions.schema.getObjectSchema('flightPlan.missionCalculation.missionCalculatedData');
      missionCalculatedDataSchema.validate(missionCalculationsData.missionCalculatedData);
      FeatureCollectionPoints.validate(missionCalculationsData.waypointList);

      Missions.update(missionId, {
        $set: { 'flightPlan.missionCalculation': missionCalculationsData },
      });
    } catch (exception) {
      if (exception.error === 'validation-error') {
        throw new Meteor.Error(500, exception.message);
      }
      throw new Meteor.Error('500', exception);
    }
  },
  'missions.editWayPointList': function missionsEditWaypointList(missionId, newWayPointList) {
    check(missionId, String);
    try {
      FeatureCollectionPoints.validate(newWayPointList);
      Missions.update(missionId, {
        $set: { 'flightPlan.missionCalculation.waypointList': newWayPointList },
      });
    } catch (exception) {
      if (exception.error === 'validation-error') {
        throw new Meteor.Error(500, exception.message);
      }
      throw new Meteor.Error('500', exception);
    }
  },
  'missions.clearWayPoints': function missionsClearWayPoints(missionId) {
    try {
      Missions.update(missionId, { $unset: { 'flightPlan.takeOffPoint': '' } });
      Missions.update(missionId, { $unset: { 'flightPlan.landingPoint': '' } });
      Missions.update(missionId, { $unset: { 'flightPlan.missionArea': '' } });
      Missions.update(missionId, { $unset: { 'flightPlan.missionAxis': '' } });
      Missions.update(missionId, { $unset: { 'flightPlan.missionCalculation': '' } });
    } catch (exception) {
      if (exception.error === 'validation-error') {
        throw new Meteor.Error(500, exception.message);
      }
      throw new Meteor.Error('500', exception);
    }
  },
  'missions.editWayPointType': function missionsEditWaypointList(missionId, waypointIndex, newWayPointType) {
    check(missionId, String);
    check(waypointIndex, Number);
    check(newWayPointType, Number);
    try {
      Missions.update(
        { _id: missionId, 'flightPlan.missionCalculation.waypointList.features.properties.totalNumber': waypointIndex },
        { $set: { 'flightPlan.missionCalculation.waypointList.features.$.properties.type': newWayPointType } },
      );
    } catch (exception) {
      if (exception.error === 'validation-error') {
        throw new Meteor.Error(500, exception.message);
      }
      throw new Meteor.Error('500', exception);
    }
  },
  'missions.editWayPointAltRelative': function missionsEditWaypointList(missionId, waypointIndex, newWayPointAltRelative) {
    check(missionId, String);
    check(waypointIndex, Number);
    check(newWayPointAltRelative, Number);
    try {
      Missions.update(
        { _id: missionId, 'flightPlan.missionCalculation.waypointList.features.properties.totalNumber': waypointIndex },
        { $set: { 'flightPlan.missionCalculation.waypointList.features.$.properties.altRelative': newWayPointAltRelative } },
      );
    } catch (exception) {
      if (exception.error === 'validation-error') {
        throw new Meteor.Error(500, exception.message);
      }
      throw new Meteor.Error('500', exception);
    }
  },
});

rateLimit({
  methods: [
    'missions.insert',
    'missions.import',
    'missions.update',
    'missions.softDelete',
    'missions.restore',
    'missions.hardDelete',
    'missions.setDone',
    'missions.setLandingPoint',
    'missions.setTakeOffPoint',
    'missions.setMissionGeometry',
    'missions.setFlightParams',
    'missions.setPictureGrid',
    'missions.setMissionCalculations',
    'missions.editWayPointList',
    'missions.clearWayPoints',
    'missions.editWayPointType',
    'missions.editWayPointAltRelative',
  ],
  limit: 5,
  timeRange: 1000,
});
