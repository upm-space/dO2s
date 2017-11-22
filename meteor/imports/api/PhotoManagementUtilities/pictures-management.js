/* eslint-disable max-len, no-return-assign, meteor/audit-argument-checks, no-undef, no-use-before-define */
import { Meteor } from 'meteor/meteor';
import { check } from 'meteor/check';
import path from 'path';
import fs from 'fs';
import rateLimit from '../../modules/rate-limit';
import EnvironmentConst from './../../lib/EnvironmentConst.js';

import { createDirectory, deleteFolderRecursive, saveFileFrombuffer, getFileList, deleteFile, buildCompletePath, getFolderSize, getFileSize, getFilesInDirByExtension, zipACompleteFolder } from '../../modules/server/file-system.js';

const publicRepo = require('./../modules/common/public-repo-manager.js');

const Future = require('fibers/future');
const piexif = require('piexifjs');

Meteor.methods({
  createDirectory: (pathDir) => {
    createDirectory(pathDir, () => {});
  },
  removeDirectory: (pathDir) => {
    deleteFolderRecursive(pathDir);
  },
  moveFileToMissionFolder: (fileName, missionId, callback) => {
    const tempFile = checkFile(tempDirectory + fileName);
    if (tempFile) {
      rename(tempDirectory + tempFile, `${missionDirectory + missionId}/${fileName}`, callback);
    }
  },
  saveFile: (buffer, dir, fileName) => {
    const future = new Future();
    saveFileFrombuffer(buffer, dir, fileName, (objJson) => {
      future.return(objJson);
    });
    return future.wait();
  },
  getFileList: (path) => {
    const future = new Future();
    // return getFileList(path);

    getFileList(path, (files) => {
      future.return(files);
    });
    return future.wait();
  },
  deleteFile: (dir, fileName) => {
    const future = new Future();
    deleteFile(dir, fileName, (metaField) => {
      future.return(metaField);
    });
    return future.wait();
  },
  deleteAllRemoteFiles: dir => deleteFolderRecursiveSync(dir, 0),
  checkIfFileCamExists: (dir, fileName) => (fs.existsSync(buildCompletePath(dir, fileName))),
  checkFileCamAndPics: (missionDir, fileName, exif) => checkFileCamAndPics(missionDir, fileName, exif),
  insertExif: (missionDir, fileName) => {
    insertExif(missionDir, fileName);
  },
  checkConvertedFiles: missionDir => checkConvertedFiles(missionDir),
  zipPics: missionName => zipPics(missionName),
  getExifFolderSize: (missionName) => {
    const exifFolder = path.join(EnvironmentConst.missionsRepository, missionName, 'ex_pics');
    const future = new Future();
    getFolderSize(exifFolder, (size) => {
      future.return(size);
    });
    return future.wait();
  },
  getExifZipFileSize: (missionName) => {
    // let future = new Future();
    // return 6522;
    const folder = EnvironmentConst.temporalWebServerPath;
    const temporalDir = publicRepo.getCurrentFolder();
    const zipFile = path.join(folder, temporalDir, `${missionName}.zip`);
    const size = getFileSize(zipFile);
    return { size, zippedFileStatus: zippedFile };
    // future.return(getFileSize(zipFile));
  },
  example: () => 'Hola Mundo',

});


let checkFileCamAndPics = (missionDir, fileName, exif) => {
  let numberOfLines = 0;
  let numberOfFiles = 0;
  // let future = new Future();
  // if cam file exists and folder "pics" exists
  // comentado por LIM 25/5/2017
  const linesArray = getPicsFromFile(missionDir, fileName);
  // let linesArray = getPicsFromFile(path.join(missionDir, 'pics'), fileName);

  numberOfLines = linesArray.length; // the split(\'n') creates one empty lines
  const filesArray = getPicsFromFolder(missionDir, exif);
  numberOfFiles = filesArray.length;
  return ({ lines: numberOfLines, pictures: numberOfFiles });
/*
    if(fs.existsSync(buildCompletePath(missionDir,"pics"))){
        getFilesInDirByExtension(buildCompletePath(missionDir,"pics"),"jpg",(filesArray) => {
            numberOfFiles = filesArray.length;
            future.return({lines:numberOfLines,pictures:numberOfFiles});
        });
    } else{
        future.return({lines:numberOfLines,pictures:numberOfFiles});
    }

    return future.wait();
*/
};


let getPicsFromFile = (missionDir, fileName) => {
  if (fs.existsSync(buildCompletePath(missionDir, fileName))) {
    const f = fs.readFileSync(buildCompletePath(missionDir, fileName));
    const linesArray = f.toString().split('\n');
    if (linesArray[linesArray.length - 1] === '') { // the split(\'n') creates one empty lines
      linesArray.splice(-1, 1);
    }
    return linesArray;
  }
  return [];
};

let getPicsFromFolder = (missionDir, exif) => {
  const future = new Future();
  let folderPics = '';
  !exif ? folderPics = 'pics' : folderPics = 'ex_pics';

  if (fs.existsSync(buildCompletePath(missionDir, folderPics))) {
    getFilesInDirByExtension(buildCompletePath(missionDir, folderPics), 'jpg', (filesArray) => {
      // numberOfFiles = filesArray.length;
      // future.return({lines:numberOfLines,pictures:numberOfFiles});
      future.return(filesArray);
    });
  } else {
    // future.return({lines:numberOfLines,pictures:numberOfFiles});
    future.return([]);
  }
  return future.wait();
};

let insertExif = (missionDir, fileName) => {
  const linesArray = getPicsFromFile(missionDir, fileName);
  let filesArray = getPicsFromFolder(missionDir);
  filesArray = filesArray.sort();
  const pathOrig = buildCompletePath(missionDir, 'pics');
  const pathDest = buildCompletePath(missionDir, 'ex_pics');
  if (linesArray.length > 0 && linesArray.length === filesArray.length) {
    createDirectory(pathDest, (created) => {
      if (!created) {
        deleteFolderRecursiveSync(pathDest);
      }
      for (let i = 0; i < linesArray.length; i += 1) {
        const obj = convertCamLine2json(linesArray[i]);
        saveExif(pathOrig, pathDest, filesArray[i], '00:00:00', obj.alt, obj.lat, obj.lon, obj.omega, obj.phi, obj.kappa);
      }
    });
  }
};

let convertCamLine2json = (camLine) => {
  arr = camLine.split(',');
  const obj = {
    lat: 0, lon: 0, alt: 0, omega: 0, phi: 0, kappa: 0,
  };

  if (arr.length >= 6) {
    obj.lat = arr[0];
    obj.lon = arr[1];
    obj.alt = arr[2];
    obj.omega = arr[3];
    obj.phi = arr[4];
    obj.kappa = arr[5];
  }
  return obj;
};

const insertExif_old = function () {
  const dir = '/home/luis/basura/repo/projects/BzqjHJ8Ervm8Nofwc';
  const picture = 'DSC09783.JPG';
  const gpsTime = '00:00:00';
  const gpsAlt = 732;
  const gpsLat = 40.0937481;
  const gpsLon = -3.6910631;
  saveExif(dir, picture, gpsTime, gpsAlt, gpsLat, gpsLon, 0, 0, 0);
};

let saveExif = function (dirOrig, dirDest, fileName, gpsTime, gpsAlt, gpsLat, gpsLon, omega, phi, kappa) {
  // see this
  const completePathOrig = buildCompletePath(dirOrig, fileName);
  // let desFileName = "ex_" + fileName;
  // let completePathDest = buildCompletePath(dir, desFileName);
  const completePathDest = buildCompletePath(dirDest, fileName);


  const jpeg = fs.readFileSync(completePathOrig);
  const data = jpeg.toString('binary');
  const exifObj = piexif.load(data);
  exifObj.GPS[piexif.GPSIFD.GPSLatitudeRef] = gpsLat < 0 ? 'S' : 'N';
  exifObj.GPS[piexif.GPSIFD.GPSLatitude] = degToDmsRational(gpsLat);
  exifObj.GPS[piexif.GPSIFD.GPSLongitudeRef] = gpsLon < 0 ? 'W' : 'E';
  exifObj.GPS[piexif.GPSIFD.GPSLongitude] = degToDmsRational(gpsLon);
  // let convertedAltitude = [(parseFloat(gpsAlt)*1000).toFixed(0),1000]
  const convertedAltitude = [parseInt(Math.abs(parseFloat(gpsAlt)) * 100), 100];
  exifObj.GPS[piexif.GPSIFD.GPSAltitude] = convertedAltitude;
  exifObj.GPS[piexif.GPSIFD.GPSAltitudeRef] = 0;


  const exifbytes = piexif.dump(exifObj);
  const newData = piexif.insert(exifbytes, data);
  const newJpeg = new Buffer(newData, 'binary');
  fs.writeFileSync(completePathDest, newJpeg);

  deleteFile(dirOrig, fileName, () => {});

/*
    gps[piexif.GPSIFD.GPSDateStamp] = "1999:99:99 99:99:99";
    //gps[piexif.GPSIFD.GPSLatitudeRef] = "0";
    gps[piexif.GPSIFD.GPSLatitude] = gpsLat;
    //gps[piexif.GPSIFD.GPSLongitudeRef] = "0";
    gps[piexif.GPSIFD.GPSLongitude] = gpsLon;
    //gps[piexif.GPSIFD.GPSAltitudeRef] = "0";
    gps[piexif.GPSIFD.GPSLongitude] = gpsAlt;

 */
};

/**
 * degToDmsRational(59.43553989213321) -> [[59, 1], [26, 1], [794, 100]]
 */

function degToDmsRational_old(degFloat) {
  const minFloat = degFloat % 1 * 60;
  const secFloat = minFloat % 1 * 60;
  const deg = Math.abs(Math.floor(degFloat)); // allways positive number. With negative the application crash
  const min = Math.abs(Math.floor(minFloat));
  const sec = Math.abs(Math.round(secFloat));

  return [[deg, 1], [min, 1], [sec, 100]];
}

function degToDmsRational(D) {
  const dataConverted = {
    /* dir : D<0?lng?'W':'S':lng?'E':'N', */
    deg: 0 | (D < 0 ? D = -D : D),
    min: 0 | D % 1 * 60,
    sec: (0 | D * 60 % 1 * 6000) / 100,
  };

  return [[dataConverted.deg, 1], [dataConverted.min, 1], [parseFloat(dataConverted.sec) * 100, 100]];
}

let checkConvertedFiles = (missionDir) => {
  const future = new Future();
  const dirPics = buildCompletePath(missionDir, 'pics');
  const dirPicsExif = buildCompletePath(missionDir, 'ex_pics');
  const obj = { picsWithoutExif: 0, picsWithExif: 0 };
  getFilesInDirByExtension(dirPics, 'jpg', (filesArray) => {
    obj.picsWithoutExif = filesArray.length;
    getFilesInDirByExtension(dirPicsExif, 'jpg', (filesArrayExif) => {
      obj.picsWithExif = filesArrayExif.length;
      future.return(obj);
    });
  });
  return future.wait();
};


const zipPics_old = (missionName) => {
  const future = new Future();
  const folderToZip = path.join(EnvironmentConst.missionsRepository, missionName, 'ex_pics');
  // let folderToZip = buildCompletePath(EnvironmentConst.missionsRepository,missionName);
  // folderToZip = buildCompletePath(folderToZip,"ex_pics");
  // let zipFile = buildCompletePath(EnvironmentConst.publicPath, missionName + ".zip");

  // let zipFile = process.env['METEOR_SHELL_DIR'] + '/../../../public/repo/' + missionName + '.zip';
  publicRepo.connectServer(EnvironmentConst.temporalWebServerPath, EnvironmentConst.temporalWebServerPort);
  publicRepo.checkDirAndDeleteOlder(EnvironmentConst.temporalWebServerPath, 5, (currentDir) => {
    const zipFile = path.join(EnvironmentConst.temporalWebServerPath, currentDir, `${missionName}.zip`);
    zipACompleteFolder(folderToZip, zipFile, (boolValue) => {
      if (boolValue) {
        future.return({ result: 'ok', message: path.join(EnvironmentConst.temporalWebServerURL, currentDir, `${missionName}.zip`) });
      } else {
        future.return({ result: 'error', message: '' });
      }
    });
  });
  return future.wait();
};

let zippedFile = { result: '', message: '' };
let zipPics = (missionName) => {
  const daystoKeepIntemporalFolder = 0;
  zippedFile = { result: '', message: '' };
  const folderToZip = path.join(EnvironmentConst.missionsRepository, missionName, 'ex_pics');
  publicRepo.connectServer(EnvironmentConst.temporalWebServerPath, EnvironmentConst.temporalWebServerPort);
  publicRepo.checkDirAndDeleteOlder(EnvironmentConst.temporalWebServerPath, daystoKeepIntemporalFolder, (currentDir) => {
    const zipFile = path.join(EnvironmentConst.temporalWebServerPath, currentDir, `${missionName}.zip`);
    zipACompleteFolder(folderToZip, zipFile, (boolValue) => {
      if (boolValue) {
        zippedFile = { result: 'ok', message: path.join(EnvironmentConst.temporalWebServerURL, currentDir, `${missionName}.zip`) };
        deleteFolderRecursiveSync(folderToZip);
        return zippedFile;
      }
      zippedFile = { result: 'error', message: '' };
      return zippedFile;
    });
  });
};
