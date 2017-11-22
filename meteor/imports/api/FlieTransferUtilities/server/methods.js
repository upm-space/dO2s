import { Meteor } from 'meteor/meteor';
import { check } from 'meteor/check';
import { Future } from 'fibers/future';
import path from 'path';
import fs from 'fs';
import rateLimit from '../../../modules/rate-limit';
import { saveFileFrombuffer, deleteFile, getFileList } from '../../../modules/server/file-system';


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

  'fileTransfer.saveFolder': (missionId, dirPath) => {
    check(missionId, String);
    check(dirPath, String);
    try {
      const future = new Future();
      if (fs.existsSync(dirPath)) {
        const missionDir = path.join(Meteor.settings.private.config.missionsPath, `${missionId}/`);
        getFileList(dirPath, (array) => {
          array.forEach((fileName) => {
            const filePath = path.join(dirPath, fileName);
            const newFilePath = path.join(missionDir, fileName);
            fs.copyFileSync(filePath, newFilePath);
          });
        });
      } else {
        throw Error('Directory not found');
      }
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
    'fileTransfer.saveFolder',
  ],
  limit: 5,
  timeRange: 1000,
});
