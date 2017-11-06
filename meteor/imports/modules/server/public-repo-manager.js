/**************************************************************************************************************
 *
 */
/********************************* public server manager ******************************************************/

var http = require('http');
var fs = require('fs');
let path = require('path');
let fsHelper = require('./file-system.js');
let server;

const connectServer = (rootDir,port) => {
    if(server){return;} //If has beeen previously connected, exit
    server = http.createServer(function (request, response) {
        console.log('request starting...');

        var filePath = rootDir + request.url;
        //var filePath = '/home/luis/basura/index.html';
        /*if (filePath == './')
         filePath = './index.html';*/

        var extname = path.extname(filePath);
        var contentType = 'text/html';
        switch (extname) {
            case '.js':
                contentType = 'text/javascript';
                break;
            case '.css':
                contentType = 'text/css';
                break;
            case '.json':
                contentType = 'application/json';
                break;
            case '.png':
                contentType = 'image/png';
                break;
            case '.jpg':
                contentType = 'image/jpg';
                break;
            case '.wav':
                contentType = 'audio/wav';
                break;
            case '.zip':
                contentType = 'application/octet-stream';
        }

        fs.readFile(filePath, function(error, content) {
            if (error) {
                if(error.code == 'ENOENT'){
                    /*fs.readFile('./404.html', function(error, content) {
                        response.writeHead(200, { 'Content-Type': contentType });
                        response.end(content, 'utf-8');
                    });*/
                    response.writeHead(500);
                    response.end('Error 404. File Not Found  ..\n');
                    response.end();
                }
                else {
                    response.writeHead(500);
                    response.end('Sorry, check with the site admin for error: '+error.code+' ..\n');
                    response.end();
                }
            }
            else {
                response.writeHead(200, { 'Content-Type': contentType });
                response.end(content, 'utf-8');
            }
        });

    }).listen(port);
    console.log('Server running at http://127.0.0.1:' + port + '/');

}


const shouldBeDeleted = (timeNow,dirName,numberOfDays)=>{
    var mdy = dirName.split('_');
    if(mdy.length==3){
        let dirDate = new Date(mdy[0], mdy[1]-1, mdy[2]);
        let diffDays = Math.round((timeNow - dirDate)/(1000*60*60*24));
        let toDelete;
        (diffDays > numberOfDays) ?  toDelete = true : toDelete = false;
        return toDelete;
    } else {
        return false;
    }

}

const getCurrentFolder = ()=>{
    let timeNow = new Date();
    let year = timeNow.getFullYear();
    let month = timeNow.getMonth() + 1;
    let day = timeNow.getDate();
    return year + "_" + month + "_" + day ;
}

const deletePastTrashAndCreateNewOne = (days,rootFile,callback)=>{
    let timeNow = new Date();
    fs.readdir(rootFile, (err, files) => {
        files.forEach((file)=>{
            if(shouldBeDeleted(timeNow,path.parse(file).name,days)){
                fsHelper.deleteFolderRecursiveSync(path.join(rootFile,file));
            }
        })
        let dirName = getCurrentFolder();
        fsHelper.createDirectory(path.join(rootFile,dirName),(result)=>{
            callback(dirName);
        })
    })

}

/**
 * Check all the dirs that exist in rootFile, They should have the format YYYY_MM_DD
 * If the are older than the number of days (third param), the entire dir will be deleted
 * @param {string} rootFolder - root folder of the web service
 * @param {interger} days - number of days before to now to keep undelete
 */
const checkDirAndDeleteOlder = (rootFolder, days,callback) => {
    //let fileObj = path.parse(fileName);
    // Returns:
    // { root: '/',
    //   dir: '/home/user/dir',
    //   base: 'file.txt',
    //   ext: '.txt',
    //   name: 'file' }
    deletePastTrashAndCreateNewOne(days,rootFolder,(dirName) =>{
        //fs.renameSync(fileName,path.join(rootFolder,dirName,fileObj.base));
        //return (path.join(dirName,fileObj.base))
        callback(dirName);
    });


}

export {connectServer,checkDirAndDeleteOlder,getCurrentFolder}