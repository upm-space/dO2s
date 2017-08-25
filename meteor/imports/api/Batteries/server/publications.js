import { Meteor } from 'meteor/meteor';
import { check } from 'meteor/check';
import Batteries from '../Batteries';

Meteor.publish('batteries', function batteries() {
  return Batteries.find({ owner: this.userId });
});

// Note: batteries.view is also used when editing an existing document.
Meteor.publish('batteries.view', function batteriesView(batteryId) {
  check(batteryId, String);
  return Batteries.find({ _id: batteryId, owner: this.userId });
});
