import { Meteor } from 'meteor/meteor';
import { check } from 'meteor/check';
import rateLimit from '../../../modules/rate-limit';
import { saveFileFrombuffer, deleteFile } from '../../../modules/server/file-system';

const Future = require('fibers/future');

Meteor.methods({
  'fileTransfer.saveFile': (buffer, dir, fileName) => {
    check(buffer, Uint8Array);
    check(dir, String);
    check(fileName, String);
    const future = new Future();
    saveFileFrombuffer(buffer, dir, fileName, (objJson) => {
      future.return(objJson);
    });
    return future.wait();
  },

  'fileTransfer.deleteFile': (dir, fileName) => {
    check(dir, String);
    check(fileName, String);
    const future = new Future();
    deleteFile(dir, fileName, (objJson) => {
      future.return(objJson);
    });
    return future.wait();
  },
});

rateLimit({
  methods: [
    'fileTransfer.saveFile',
    'fileTransfer.deleteFile',
  ],
  limit: 5,
  timeRange: 1000,
});
