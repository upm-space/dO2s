import { Meteor } from 'meteor/meteor';
import { check } from 'meteor/check';
import Payloads from '../Payloads';

Meteor.publish('payloads', function payloads() {
  return Payloads.find({ owner: this.userId });
});

// Note: payloads.view is also used when editing an existing document.
Meteor.publish('payloads.view', function payloadsView(payloadId) {
  check(payloadId, String);
  return Payloads.find({ _id: payloadId, owner: this.userId });
});
