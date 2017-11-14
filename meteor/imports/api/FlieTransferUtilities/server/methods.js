import { Meteor } from 'meteor/meteor';
import { check } from 'meteor/check';
import path from 'path';
import rateLimit from '../../../modules/rate-limit';
import { saveFileFrombuffer, deleteFile } from '../../../modules/server/file-system';

const Future = require('fibers/future');

Meteor.methods({
  'fileTransfer.saveFile': (buffer, missionId, fileName) => {
    check(buffer, Uint8Array);
    check(missionId, String);
    check(fileName, String);
    try {
      const missionDir = path.join(Meteor.settings.private.config.missionsPath, `${missionId}/`);
      const future = new Future();
      saveFileFrombuffer(buffer, missionDir, fileName, (objJson) => {
        future.return(objJson);
      });
      return future.wait();
    } catch (exception) {
      throw new Meteor.Error('500', exception);
    }
  },

  'fileTransfer.deleteFile': (missionId, fileName) => {
    check(missionId, String);
    check(fileName, String);
    try {
      const missionDir = path.join(Meteor.settings.private.config.missionsPath, `${missionId}/`);
      const future = new Future();
      deleteFile(missionDir, fileName, (objJson) => {
        future.return(objJson);
      });
      return future.wait();
    } catch (exception) {
      throw new Meteor.Error('500', exception);
    }
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
