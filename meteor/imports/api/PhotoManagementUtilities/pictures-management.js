/* eslint-disable max-len, meteor/audit-argument-checks */
import { Meteor } from 'meteor/meteor';
// import { check } from 'meteor/check';
import path from 'path';
import fs from 'fs';
// import rateLimit from '../../modules/rate-limit';
import EnvironmentConst from './../../lib/EnvironmentConst.js';

import { createDirectory, deleteFolderRecursiveSync, saveFileFrombuffer, getFileList, deleteFile, buildCompletePath, getFolderSize, getFileSize, getFilesInDirByExtension, zipACompleteFolder } from '../../modules/server/file-system.js';

const publicRepo = require('../../modules/server/public-repo-manager.js');

const Future = require('fibers/future');
const piexif = require('piexifjs');

const missionDirectory = '';
const tempDirectory = '';
let zippedFile = { result: '', message: '' };

Meteor.methods({
  createDirectory: (pathDir) => { createDirectory(pathDir, () => {}); },

  removeDirectory: (pathDir) => { deleteFolderRecursiveSync(pathDir); },

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

  getFileList: (pathDir) => {
    const future = new Future();
    getFileList(pathDir, (files) => {
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

  // checkFileCamAndPics: (missionDir, fileName, exif) => checkFileCamAndPics(missionDir, fileName, exif),

  // insertExif: (missionDir, fileName) => { insertExif(missionDir, fileName); },

  // checkConvertedFiles: missionDir => checkConvertedFiles(missionDir),

  // zipPics: missionName => zipPics(missionName),

  getExifFolderSize: (missionName) => {
    const exifFolder = path.join(EnvironmentConst.missionsRepository, missionName, 'ex_pics');
    const future = new Future();
    getFolderSize(exifFolder, (size) => {
      future.return(size);
    });
    return future.wait();
  },

  getExifZipFileSize: (missionName) => {
    const folder = EnvironmentConst.temporalWebServerPath;
    const temporalDir = publicRepo.getCurrentFolder();
    const zipFile = path.join(folder, temporalDir, `${missionName}.zip`);
    const size = getFileSize(zipFile);
    return { size, zippedFileStatus: zippedFile };
  },
});

const getPicsFromFile = (missionDir, fileName) => {
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

const getPicsFromFolder = (missionDir, exif) => {
  const future = new Future();
  const folderPics = !exif ? 'pics' : 'ex_pics';
  if (fs.existsSync(buildCompletePath(missionDir, folderPics))) {
    getFilesInDirByExtension(buildCompletePath(missionDir, folderPics), 'jpg', (filesArray) => {
      future.return(filesArray);
    });
  } else {
    future.return([]);
  }
  return future.wait();
};

const checkFileCamAndPics = (missionDir, fileName, exif) => {
  let numberOfLines = 0;
  let numberOfFiles = 0;
  const linesArray = getPicsFromFile(missionDir, fileName);

  numberOfLines = linesArray.length; // the split(\'n') creates one empty lines
  const filesArray = getPicsFromFolder(missionDir, exif);
  numberOfFiles = filesArray.length;
  return ({ lines: numberOfLines, pictures: numberOfFiles });
};

const convertCamLine2json = (camLine) => {
  const arr = camLine.split(',');
  const obj = {
    lat: 0, lon: 0, alt: 0, omega: 0, phi: 0, kappa: 0,
  };
  if (arr.length >= 6) {
    [obj.lat, obj.lon, obj.alt, obj.omega, obj.phi, obj.kappa] = arr;
  }
  return obj;
};

/**
 * degToDmsRational(59.43553989213321) -> [[59, 1], [26, 1], [794, 100]]
 */
const degToDmsRational = (D) => {
  const dataConverted = {
    /* dir : D<0?lng?'W':'S':lng?'E':'N', */
    deg: 0 || (D < 0 ? -D : D),
    min: 0 || (D % 1) * 60,
    sec: (0 || ((D * 60) % 1) * 3600) / 100,
  };

  return [[dataConverted.deg, 1], [dataConverted.min, 1], [parseFloat(dataConverted.sec) * 100, 100]];
};

const saveExif = (dirOrig, dirDest, fileName, gpsTime, gpsAlt, gpsLat, gpsLon, omega, phi, kappa) => {
  // see this
  const completePathOrig = buildCompletePath(dirOrig, fileName);
  const completePathDest = buildCompletePath(dirDest, fileName);


  const jpeg = fs.readFileSync(completePathOrig);
  const data = jpeg.toString('binary');
  const exifObj = piexif.load(data);
  exifObj.GPS[piexif.GPSIFD.GPSLatitudeRef] = gpsLat < 0 ? 'S' : 'N';
  exifObj.GPS[piexif.GPSIFD.GPSLatitude] = degToDmsRational(gpsLat);
  exifObj.GPS[piexif.GPSIFD.GPSLongitudeRef] = gpsLon < 0 ? 'W' : 'E';
  exifObj.GPS[piexif.GPSIFD.GPSLongitude] = degToDmsRational(gpsLon);
  const convertedAltitude = [parseInt(Math.abs(parseFloat(gpsAlt)) * 100, 10), 100];
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

const insertExif = (missionDir, fileName) => {
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

const checkConvertedFiles = (missionDir) => {
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

const zipPics = (missionName) => {
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
