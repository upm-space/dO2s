/* eslint-disable meteor/audit-argument-checks */
import { Meteor } from 'meteor/meteor';
import { check } from 'meteor/check';
import RPAS from './RPAS';
import rateLimit from '../../modules/rate-limit';

const newRPASchema = RPAS.schema.pick('name', 'rpasType', 'model', 'registrationNumber', 'constructionDate', 'serialNumber', 'weight', 'flightParameters');

const editRPASchema = RPAS.schema.pick('name', 'rpasType', 'model', 'registrationNumber', 'constructionDate', 'serialNumber', 'weight', 'flightParameters');
editRPASchema.extend({ _id: String });

Meteor.methods({
  'rpas.insert': function rpasInsert(rpas) {
    try {
      newRPASchema.validate(rpas);
      return RPAS.insert({ owner: this.userId, ...rpas });
    } catch (exception) {
      if (exception.error === 'validation-error') {
        throw new Meteor.Error(500, exception.message);
      }
      throw new Meteor.Error('500', exception);
    }
  },
  'rpas.update': function rpasUpdate(rpas) {
    try {
      editRPASchema.validate(rpas);
      const rpasId = rpas._id;
      RPAS.update(rpasId, { $set: rpas });
      return rpasId;
       // Return _id so we can redirect to document after update.
    } catch (exception) {
      if (exception.error === 'validation-error') {
        throw new Meteor.Error(500, exception.message);
      }
      throw new Meteor.Error('500', exception);
    }
  },
  'rpas.softDelete': function rpasSoftDelete(rpasId) {
    check(rpasId, String);
    try {
      RPAS.update(rpasId, { $set: { deleted: (new Date()).toISOString() } });
    } catch (exception) {
      throw new Meteor.Error('500', exception);
    }
  },
  'rpas.restore': function rpasRestore(rpasId) {
    check(rpasId, String);
    try {
      RPAS.update(rpasId, { $set: { deleted: 'no' } });
    } catch (exception) {
      throw new Meteor.Error('500', exception);
    }
  },
  'rpas.hardDelete': function rpasHardDelete(rpasId) {
    check(rpasId, String);
    try {
      return RPAS.remove(rpasId);
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
