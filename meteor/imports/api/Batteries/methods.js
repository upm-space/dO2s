/* eslint-disable meteor/audit-argument-checks */
import { Meteor } from 'meteor/meteor';
import { check } from 'meteor/check';
import Batteries from './Batteries';
import rateLimit from '../../modules/rate-limit';

const newBatterySchema = Batteries.schema.pick('name', 'model', 'registrationNumber', 'amperes', 'cellNumber', 'weight');

const editBatterySchema = Batteries.schema.pick('name', 'model', 'registrationNumber', 'amperes', 'cellNumber', 'weight');
editBatterySchema.extend({ _id: String });

Meteor.methods({
  'batteries.insert': function batteriesInsert(battery) {
    try {
      newBatterySchema.validate(battery);
      return Batteries.insert({ owner: this.userId, ...battery });
    } catch (exception) {
      if (exception.error === 'validation-error') {
        throw new Meteor.Error(500, exception.message);
      }
      throw new Meteor.Error('500', exception);
    }
  },
  'batteries.update': function batteriesUpdate(battery) {
    try {
      editBatterySchema.validate(battery);
      const batteryId = battery._id;
      Batteries.update(batteryId, { $set: battery });
      return batteryId;
      // Return _id so we can redirect to battery after update.
    } catch (exception) {
      if (exception.error === 'validation-error') {
        throw new Meteor.Error(500, exception.message);
      }
      throw new Meteor.Error('500', exception);
    }
  },
  'batteries.softDelete': function batteriesSoftDelete(batteryId) {
    check(batteryId, String);
    try {
      Batteries.update(batteryId, { $set: { deleted: (new Date()).toISOString() } });
    } catch (exception) {
      throw new Meteor.Error('500', exception);
    }
  },
  'batteries.restore': function batteriesRestore(batteryId) {
    check(batteryId, String);
    try {
      Batteries.update(batteryId, { $set: { deleted: 'no' } });
    } catch (exception) {
      throw new Meteor.Error('500', exception);
    }
  },
  'batteries.hardDelete': function batteriesHardDelete(batteryId) {
    check(batteryId, String);
    try {
      return Batteries.remove(batteryId);
    } catch (exception) {
      throw new Meteor.Error('500', exception);
    }
  },
});

rateLimit({
  methods: [
    'batteries.insert',
    'batteries.update',
    'batteries.softDelete',
    'batteries.restore',
    'batteries.hardDelete',
  ],
  limit: 5,
  timeRange: 1000,
});
