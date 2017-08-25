/* eslint-disable meteor/audit-argument-checks */
import { Meteor } from 'meteor/meteor';
import { check } from 'meteor/check';
import RPAs from './RPAs';
import rateLimit from '../../modules/rate-limit';

const newRPASchema = RPAs.schema.pick('name', 'rpaType', 'model', 'registrationNumber', 'constructionDate', 'serialNumber', 'weight', 'flightParameters');

const editRPASchema = RPAs.schema.pick('name', 'rpaType', 'model', 'registrationNumber', 'constructionDate', 'serialNumber', 'weight', 'flightParameters');
editRPASchema.extend({ _id: String });

Meteor.methods({
  'rpas.insert': function rpasInsert(rpa) {
    try {
      newRPASchema.validate(rpa);
      return RPAs.insert({ owner: this.userId, ...rpa });
    } catch (exception) {
      if (exception.error === 'validation-error') {
        throw new Meteor.Error(500, exception.message);
      }
      throw new Meteor.Error('500', exception);
    }
  },
  'rpas.update': function rpasUpdate(rpa) {
    try {
      editRPASchema.validate(rpa);
      const rpaId = rpa._id;
      RPAs.update(rpaId, { $set: rpa });
      return rpaId;
       // Return _id so we can redirect to document after update.
    } catch (exception) {
      if (exception.error === 'validation-error') {
        throw new Meteor.Error(500, exception.message);
      }
      throw new Meteor.Error('500', exception);
    }
  },
  'rpas.softDelete': function rpasSoftDelete(rpaId) {
    check(rpaId, String);
    try {
      RPAs.update(rpaId, { $set: { deleted: (new Date()).toISOString() } });
    } catch (exception) {
      throw new Meteor.Error('500', exception);
    }
  },
  'rpas.restore': function rpasRestore(rpaId) {
    check(rpaId, String);
    try {
      RPAs.update(rpaId, { $set: { deleted: 'no' } });
    } catch (exception) {
      throw new Meteor.Error('500', exception);
    }
  },
  'rpas.hardDelete': function rpasHardDelete(rpaId) {
    check(rpaId, String);
    try {
      return RPAs.remove(rpaId);
    } catch (exception) {
      throw new Meteor.Error('500', exception);
    }
  },
});

rateLimit({
  methods: [
    'rpas.insert',
    'rpas.update',
    'rpas.softDelete',
    'rpas.restore',
    'rpas.hardDelete',
  ],
  limit: 5,
  timeRange: 1000,
});
