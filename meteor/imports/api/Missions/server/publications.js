/* eslint-disable object-shorthand */
import { Meteor } from 'meteor/meteor';
import { check } from 'meteor/check';
import Missions from '../Missions';

Meteor.publish('missions', function missions(projectId) {
  check(projectId, String);
  return Missions.find({ owner: this.userId, projectId: projectId });
});

// Note: documents.view is also used when editing an existing document.
Meteor.publish('missions.view', function missionsView(projectId, missionId) {
  check(missionId, String);
  check(projectId, String);
  return Missions.find({ _id: missionId, owner: this.userId, projectId: projectId });
});
