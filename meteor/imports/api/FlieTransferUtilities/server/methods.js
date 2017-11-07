import { Meteor } from 'meteor/meteor';
import { check } from 'meteor/check';
import rateLimit from '../../../modules/rate-limit';
// import fsHelper from '../../../modules/server/file-system';
import { saveFileFrombuffer } from '../../../modules/server/file-system';

const Future = Npm.require('fibers/future');
const fs = require('fs');

Meteor.methods({
  saveLocalFiles: (path, fileArray) => {
    console.log('Hola Mundo');
    check(path, String);
    const future = new Future();
    future.return('ok');
    // fsHelper.saveFileFrombuffer(buffer, dir, fileName, (objJson) => {
    saveFileFrombuffer(buffer, dir, fileName, (objJson) => {
      future.return(objJson);
    });
    return future.wait();
  },

  saveFile: (buffer, dir, fileName) => {
    // check(buffer, String);
    // check(dir, String);
    // check(fileName, String);
    const future = new Future();
    // fsHelper.saveFileFrombuffer(buffer, dir, fileName, (objJson) => {
    saveFileFrombuffer(buffer, dir, fileName, (objJson) => {
      future.return(objJson);
    });
    return future.wait();
  },
});

rateLimit({
  methods: [
    'prueba',
    'saveLocalFiles',
    'saveFile',
  ],
  limit: 5,
  timeRange: 1000,
});
