import { Meteor } from 'meteor/meteor';

const Future = Npm.require('fibers/future');
const fs = require('fs');

Meteor.methods({
  saveLocalFiles: (path, fileArray) => {
    console.log(fileArray);
    const future = new Future();
    future.return('ok');
    // fsHelper.saveFileFrombuffer(buffer, dir, fileName, (objJson) => {
    //   future.return(objJson);
    // });
    return future.wait();
  },
});
