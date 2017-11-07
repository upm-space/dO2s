
/*-----------------------------------------------------------------------------------------*/
/* File System basic function for nodejs            Compilation made by Luis Izquierdo Mesa */
/*-----------------------------------------------------------------------------------------*/


const fs = require('fs');
// let zipFolder = require('zip-folder');
const { spawn } = require('child_process');
const path = require('path');

// let Future = Npm.require( 'fibers/future' );

/**
 * Builds a complete path taking care about the last character of
 * the @param dir. If this does not have a slash the function will add one
 * @param {string} dir - directory with or without last slash
 * @param {string} fileName - filename
 * @returns {string}
 */

const buildCompletePath = (dir, fileName) => {
  const lastChar = dir.substr(dir.length - 1);
  let slash = '';
  if (lastChar !== '/') slash = '/';
  return dir + slash + fileName;
};

/**
 * Delete files and directories in a folder. This method is syncronous
 * @param {string} path
 * @param {int} nivel de recursividad - Siempre hay que meter 0.
 Es la manera que tiene la función recursiva de detectar la primera
  iteración y así no borrar el directorio inicial.
 */
let deletedFiles = 0;
const numberOfFolders = 0;
const deleteFolderRecursiveSync = (pathDir, root) => {
  let files = [];
  if (fs.existsSync(pathDir)) {
    files = fs.readdirSync(pathDir);
    files.forEach((file) => {
      const curPath = buildCompletePath(pathDir, file);
      if (fs.lstatSync(curPath).isDirectory()) { // recurse
        deleteFolderRecursiveSync(curPath, false);
      } else { // delete file
        deletedFiles += 1;
        fs.unlinkSync(curPath);
      }
    });
  }
  if (!root) {
    fs.rmdirSync(pathDir);
  } else {
    return { deletedFiles, folders: numberOfFolders };
  }
};


/**
 * Get all the files from a directory
 * @param {string} path
 * @returns {[]} - array of files
 */
const getFileList = (pathDir, callback) => {
  const filesArr = [];
  // let future = new Future();
  fs.readdir(pathDir, (err, files) => {
    files.forEach((file) => {
      filesArr.push(file);
    });
    callback(filesArr);
    // future.return({files:filesArr})
  });
  // return future.wait();
};

/**
 * Get files in a directory by an extension
 * @param {string } dir
 * @param {string} extension - can be upper-case or lower-case, this function is case insensitive
 * @param {function} callback - callback with one argument that returns
    and array of files filered by its extension
 */
const getFilesInDirByExtension = (dir, extension, callback) => {
  const filesArr = [];
  const re = new RegExp(extension, 'i');
  const extensionLenght = extension.length;
  fs.readdir(dir, (err, files) => {
    files
      .filter(file => file.substr(-extensionLenght).match(re))
      .forEach((file) => {
        filesArr.push(file);
      });
    callback(filesArr);
  });
};

/**
 * Get files in a directory by a prefix
 * @param {string }dir
 * @param {string} prefix - can be upper-case or lower-case, this function is case insensitive
 * @param {function} callback - callback with one argument that
   returns and array of files filered by its extension
 */
const getFilesInDirByPrefix = (dir, prefix, callback) => {
  const filesArr = [];
  const re = new RegExp(prefix, 'i');
  const prefixLenght = prefix.length;
  fs.readdir(dir, (err, files) => {
    files
      .filter(file => file.substr(0, prefixLenght).match(re))
      .forEach((file) => {
        filesArr.push(file);
      });
    callback(filesArr);
  });
};

/**
 * Delete a file in a given directory
 * @param {string} dir - directory
 * @param {string} fileName
 * @returns {*} - a json object with three parameters; result ('error' or 'ok'), dir and filename
 */
const deleteFile = (dir, fileName, callback) => {
  const completePath = buildCompletePath(dir, fileName);
  // let future = new Future();
  fs.unlink(completePath, (err) => {
    if (err) {
      callback({ result: 'error', dir, fileName });
    } else {
      callback({ result: 'ok', dir, fileName });
    }
  });
  // return future.wait();
};

/**
 * Method that save a file from a buffer. This
 method is used for a meteor.call, saving a file from client.
 * This method use Future, so it does not return anything until it finish
 * @param {binary} buffer - binary content of the file
 * @param {string} dir - directory where we want to store the file
 * @param {string} fileName - name of the file
 * @returns {*} - a json object with three parameters; result ('error' or 'ok'), dir and filename
 */
const saveFileFrombuffer = (buffer, dir, fileName, callback) => {
  const fullFileName = dir + fileName;
  // let future = new Future();
  fs.stat(dir, (error, stats) => {
    if (error) {
      setTimeout(() => {
        callback({ result: 'error', dir, fileName });
        // future.return({result:'error',dir:dir,fileName:fileName});
      }, 1000);
      // return meteorError;
    } else if (stats.isDirectory()) {
      fs.writeFile(fullFileName, new Buffer(buffer), 'binary', (error2) => {
        if (error2) {
          callback({ result: 'error', dir, fileName });
          // future.return({result:'error',dir:dir,fileName:fileName});
        } else {
          callback({ result: 'ok', dir, fileName });
          // future.return({result:'ok',dir:dir,fileName:fileName});
        }
      });
    } else {
      // future.return({result:'error'});
      callback({ result: 'error' });
    }
  });
  // return future.wait();
};

/**
 * create a directory with a permission type 777
 * @param {string} path
 */
const createDirectory = (pathDir, callback) => {
  // path = missionDirectory + path;
  console.log(`dir created at ${pathDir}`);
  fs.exists(pathDir, (exists) => {
    console.log(`bool val ${exists}`);
    if (!exists) {
      fs.mkdir(pathDir, '0777', () => {
        console.log(`dir created at ${pathDir}`);
        callback(true);
      });
    } else {
      callback(false);
    }
  });
};

/**
 * Zip a complete folder
 * @param {string} folderPath
 * @param {string} zipPath
 * @param {function} callback - passing a bool argument
 (true if everything is ok, false if an error happens)
 */
const zipACompleteFolder = (folderPath, zipPath, callback) => {
  zipFolder(folderPath, zipPath, (err) => {
    if (err) {
      callback(false);
    } else {
      callback(true);
    }
  });
};

const getFileSize = (filename) => {
  const stats = fs.statSync(filename);
  const fileSizeInBytes = stats.size;
  return fileSizeInBytes;
};

const getFolderSize = (folder, callback) => {
  let folderSize = 0;
  fs.readdir(folder, (err, files) => {
    files.forEach((file) => {
      folderSize += getFileSize(path.join(folder, file));
    });
    callback(folderSize);
  });
};

const getFolderSize_old = (pathDir, callback) => {
  const size = spawn('du', ['-sh', pathDir]);
  const result = {};
  let totalSize = 0;

  size.stdout.on('data', (data) => {
    result.data = data;

    data.forEach((item) => {
      totalSize += item;
    });
    callback(totalSize);
  });
  size.stderr.on('data', (data) => {
    result.error = data;
    callback(result);
  });
};

export {
  deleteFolderRecursiveSync,
  buildCompletePath,
  getFileList,
  getFilesInDirByExtension,
  deleteFile,
  saveFileFrombuffer,
  createDirectory,
  // zipACompleteFolder,
  getFolderSize,
  getFileSize,
};
