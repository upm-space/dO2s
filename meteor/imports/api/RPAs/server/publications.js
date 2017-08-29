import { Meteor } from 'meteor/meteor';
import { check } from 'meteor/check';
import RPAS from '../RPAS';

Meteor.publish('rpas', function rpas() {
  return RPAS.find({ owner: this.userId });
});

// Note: documents.view is also used when editing an existing document.
Meteor.publish('rpas.view', function rpasView(rpasId) {
  check(rpasId, String);
  return RPAS.find({ _id: rpasId, owner: this.userId });
});
