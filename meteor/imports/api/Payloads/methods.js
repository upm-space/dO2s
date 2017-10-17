/* eslint-disable meteor/audit-argument-checks */
import { Meteor } from 'meteor/meteor';
import { check } from 'meteor/check';
import Payloads from './Payloads';
import rateLimit from '../../modules/rate-limit';

const newPayloadSchema = Payloads.schema.pick('name', 'registrationNumber', 'model', 'weight', 'payloadType', 'sensorParameters');

const editPayloadSchema = Payloads.schema.pick('name', 'registrationNumber', 'model', 'weight', 'payloadType', 'sensorParameters');
editPayloadSchema.extend({ _id: String });

Meteor.methods({
  'payloads.insert': function payloadsInsert(payload) {
    try {
      newPayloadSchema.validate(payload);
      return Payloads.insert({ owner: this.userId, ...payload });
    } catch (exception) {
      if (exception.error === 'validation-error') {
        throw new Meteor.Error(500, exception.message);
      }
      throw new Meteor.Error('500', exception);
    }
  },
  'payloads.update': function payloadsUpdate(payload) {
    try {
      editPayloadSchema.validate(payload);
      const payloadId = payload._id;
      Payloads.update(payloadId, { $set: payload });
      return payloadId;
      // Return _id so we can redirect to payload after update.
    } catch (exception) {
      if (exception.error === 'validation-error') {
        throw new Meteor.Error(500, exception.message);
      }
      throw new Meteor.Error('500', exception);
    }
  },
  'payloads.softDelete': function payloadsSoftDelete(payloadId) {
    check(payloadId, String);
    try {
      Payloads.update(payloadId, { $set: { deleted: (new Date()).toISOString() } });
    } catch (exception) {
      throw new Meteor.Error('500', exception);
    }
  },
  'payloads.restore': function payloadsRestore(payloadId) {
    check(payloadId, String);
    try {
      Payloads.update(payloadId, { $set: { deleted: 'no' } });
    } catch (exception) {
      throw new Meteor.Error('500', exception);
    }
  },
  'payloads.hardDelete': function payloadsHardDelete(payloadId) {
    check(payloadId, String);
    try {
      return Payloads.remove(payloadId);
    } catch (exception) {
      throw new Meteor.Error('500', exception);
    }
  },
});

rateLimit({
  methods: [
    'payloads.insert',
    'payloads.update',
    'payloads.softDelete',
    'payloads.restore',
    'payloads.hardDelete',
  ],
  limit: 5,
  timeRange: 1000,
});
