import { Meteor } from 'meteor/meteor';
import { check } from 'meteor/check';
import Projects from '../Projects';

Meteor.publish('projects', function projects() {
  return Projects.find({ owner: this.userId });
});

// Note: documents.view is also used when editing an existing document.
Meteor.publish('projects.view', function projectsView(projectId) {
  check(projectId, String);
  return Projects.find({ _id: projectId, owner: this.userId });
});
