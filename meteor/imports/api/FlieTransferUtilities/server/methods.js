import { Meteor } from 'meteor/meteor';
import rateLimit from '../../../modules/rate-limit';

// const Future = Npm.require('fibers/future');
// const fs = require('fs');

Meteor.methods({
<<<<<<< HEAD
  saveLocalFiles: (path, fileArray) => {
    console.log('Hola Mundo');
    const future = new Future();
    future.return('ok');
    fsHelper.saveFileFrombuffer(buffer, dir, fileName, (objJson) => {
      future.return(objJson);
    });
    return future.wait();
  },
=======
  // saveLocalFiles: (path, fileArray) => {
  //   console.log('Hola Mundo');
  //   const future = new Future();
  //   future.return('ok');
  //   // fsHelper.saveFileFrombuffer(buffer, dir, fileName, (objJson) => {
  //   //   future.return(objJson);
  //   // });
  //   return future.wait();
  // },
>>>>>>> 10d8bf705afc5034c001547269c1bde372166c2c
  prueba: function prueba() {
    console.log('Hola mundo');
    return 8;
  },
});

rateLimit({
  methods: [
    'prueba',
    'saveLocalFiles',
  ],
  limit: 5,
  timeRange: 1000,
});
