import { Meteor } from 'meteor/meteor';
// import { check } from 'meteor/check';
import rateLimit from '../../../modules/rate-limit';
import { saveFileFrombuffer } from '../../../modules/server/file-system';

const Future = Npm.require('fibers/future');

Meteor.methods({
  saveFile: (buffer, dir, fileName) => {
    // check(buffer, String);
    // check(dir, String);
    // check(fileName, String);
    const future = new Future();
    saveFileFrombuffer(buffer, dir, fileName, (objJson) => {
      future.return(objJson);
    });
    return future.wait();
  },
});

rateLimit({
  methods: [
    'saveFile',
  ],
  limit: 5,
  timeRange: 1000,
});
