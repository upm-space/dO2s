import { Meteor } from 'meteor/meteor';
import { check } from 'meteor/check';
import RPAs from '../RPAs';

Meteor.publish('rpas', function rpas() {
  return RPAs.find({ owner: this.userId });
});

// Note: documents.view is also used when editing an existing document.
Meteor.publish('rpas.view', function rpasView(rpaId) {
  check(rpaId, String);
  return RPAs.find({ _id: rpaId, owner: this.userId });
});

Meteor.publish('rpas.mission', function rpasMission() {
  return RPAs.find({ owner: this.userId }, { fields: {
    name: 1, rpaType: 1 },
  });
});
