import { Meteor } from 'meteor/meteor';
import { check } from 'meteor/check';
import Documents from '../Projects';

Meteor.publish('documents', function documents() {
  return Documents.find({ owner: this.userId });
});
