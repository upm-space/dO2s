import React, { Component, PropTypes } from 'react';

import FtpClientItems from './ftp-client-items.jsx';

let rootDirectory = '~/uploads/test/';

// ver este ejemplo en el caso de que queramos uilizar checboxes en los items del ftp
// http://react.tips/checkboxes-in-react/

export default class FtpUi extends Component {
    constructor(props) {
        super(props);

        this.state = {
            localFiles : [],
            serverFiles : [],
            uploadedSoFar : ''
        }
        rootDirectory = this.props.serverPath;
        this.selectedLocalFiles = new Set();

    }
    componentDidMount(){
        $('#uploadFile').hide();
    }
    selectFiles() {
        this.selectedLocalFiles = new Set();
        let btnFiles = this.refs.btnSelectedFiles;
        for(let i = 0; i < this.refs.btnSelectedFiles.files.length;i++){
            this.selectedLocalFiles.add(this.refs.btnSelectedFiles.files[i]);
        }
        this.renderLocalFiles(this.selectedLocalFiles);
    }

    renderLocalFiles(files){
        fileList = [];
        //for(let i = 0; i < files.length; i++){
        files.forEach((file) => {
            let fileObj = <FtpClientItems
                objFile={file}
                key={file.name}
                onchangeCheck={this.onChangeCheck}
                onDelete={this.removeLocalFile}
                onUpload={this.uploadLocalFile}
                parent={this}
                drawCheck={false}
                drawTrash={true}
                drawUpload={true} />;

            fileList.push(fileObj);
        })

        this.setState({
            localFiles : fileList
        });

    }
    removeLocalFile(parent,file){
        if(parent.selectedLocalFiles.has(file)){
            parent.selectedLocalFiles.delete(file);
        }
        parent.renderLocalFiles(parent.selectedLocalFiles);
    }

    uploadLocalFile(parent,file,callback){
        parent.uploadFile(file,(result)=>{
            if (result.result === 'ok') {
                //let msg = counter ;
                //this.setState({uploadedSoFar:msg});
                parent.removeLocalFile(parent,file);
                parent.renderLocalFiles(parent.selectedLocalFiles);
                parent.refreshRemoteDir(parent);
                callback(true)
            }

        })

    }

    /**
     * This strange algorithm is to make the loop syncronous, we use a setInterval insteadOf a foreach
     */
    uploadLocalFiles(){
        let counter = 0;
        let flag = true;
        let interval = setInterval(()=>{
            files = Array.from(this.selectedLocalFiles);
            //if(counter < files.length ){
            if(files.length > 0 ){ // files depends on this.selectedLocalFiles (which is a set). For each interaction files decrease one item
                if(flag){
                    flag = false;
                    this.uploadLocalFile(this,files[0],(result) => {
                        flag = true;
                        counter++;
                        msg = counter.toString() + "/" + (files.length + counter - 1).toString();
                        this.setState({uploadedSoFar:msg});

                        d = new Date();
                        console.log("files.length : " + files.length);
                        console.log("Contador: " + counter + " " + d.toLocaleTimeString());
                    })

                }
            }else{
                clearInterval(interval)
            }
        },500)
        /*
        this.selectedLocalFiles.forEach((file)=>{
            counter++;
            let flag = false;
            this.uploadLocalFile(this,file,(result) => { flag=true});
            let interval = setInterval(()=>{
                if(flag){
                    let msg = counter ;
                    this.setState({uploadedSoFar:msg});
                    clearInterval(interval);
                }
            },500)
        })
        */
    }
    uploadLocalFiles_OLD(){
        console.log(this.selectedLocalFiles.length);
        let btnFiles = this.refs.btnSelectedFiles;

        for(var i=0;i<btnFiles.files.length;i++){
            if(this.selectedLocalFiles.has(btnFiles.files[i].name)){
                this.uploadFile(btnFiles.files[i],()=>{
                        this.refreshRemoteDir(this);
                });
            }
            /*
            this.state.localFiles.forEach((file)=>{
                if(file.props.name == btnFiles.files[i].name && file.state.checked()){
                    console.log("Coincide para " + file.getName());
                }

            })*/
        }

    }

    refreshRemoteDir(parent){
        let serverFiles = [];
        Meteor.apply('getFileList',[parent.props.serverPath], {  wait: true, onResultReceived: (error, result) => {
            if(result){
                let serverCounter = 0;
                result.forEach((serFileName)=>{
                    serverCounter++;
                    let file = {name:serFileName};
                    let fileObj = <FtpClientItems
                        objFile={file}
                        key={file.name}
                        onchangeCheck={this.onChangeCheck}
                        onDelete={this.removeRemoteFile}
                        onUpload={this.uploadRemoteFile}
                        parent={this}
                        drawCheck={false}
                        drawTrash={true}
                        drawUpload={false} />;
                    serverFiles.push(fileObj);
                })
                parent.setState({
                    serverFiles : serverFiles
                });
            }
        }})
    }


    onChangeCheck(locaFile,parent){
        if(parent.selectedLocalFiles.has(locaFile)){
            parent.selectedLocalFiles.delete(locaFile);
        }else{
            parent.selectedLocalFiles.add(locaFile);
        }
    }
    selectFiles_OLD(){
        rootDirectory = this.props.serverPath;
        let btnFiles = this.refs.btnSelectedFiles;
        this.selectedLocalFiles = btnFiles.files;
        this.renderLocalFiles(this.selectedLocalFiles);
        return;

        let counter = 0;
        let files = [];
        let serverFiles = [];

        for(var i=0;i<btnFiles.files.length;i++){
            counter++;
            let file = <FtpClientItems name={btnFiles.files[i].name} key={counter} onchangeCheck={this.onChangeCheck} parent={this} drawTrash={false} drawUpload={false} />;
            this.selectedLocalFiles.add(btnFiles.files[i].name);
            files.push(file);
            console.log("Managing file: " + btnFiles.files[i].name);
            /*
            this.uploadFile(btnFiles.files[i],(serverFile)=>{
                if(btnFiles.files[btnFiles.files.length - 1].name==serverFile.fileName){
                    Meteor.apply('getFileList',[this.props.serverPath], {  wait: true, onResultReceived: (error, result) => {
                        if(result){
                            let serverCounter = 0;
                            result.files.forEach((serFileName)=>{
                                serverCounter++;
                                let servFile = <FtpClientItems name={serFileName} key={serverCounter} />;
                                serverFiles.push(servFile);
                            })
                            this.setState({
                                serverFiles : serverFiles
                            });
                        }
                    }})
                }
            });
            */
        }

        this.setState({
            localFiles : files
        });
    }

    uploadFile(file,callback){

        var reader = new FileReader();

        reader.onload = (event)=>{
            var buffer = new Uint8Array(reader.result) // convert to binary

            Meteor.apply('saveFile', [buffer,this.props.serverPath,file.name], {  wait: true, onResultReceived: (error, result) => {
                if(result) {
                    if (result.result === 'ok') {
                        console.log("file copied" + result);
                        callback(result);
                    } else {
                        console.log("Ooops. Something strange has happened copying the file: " + result);
                        callback(result);
                    }
                }
            }});

        }

        reader.readAsArrayBuffer(file);
    }

    removeRemoteFile(parent, file){
        Meteor.apply('deleteFile', [parent.props.serverPath,file.name], {  wait: true, onResultReceived: (error, result) => {
            if(result) {
                if (result.result === 'ok') {
                    console.log("file copied" + result);
                    parent.refreshRemoteDir(parent);
                } else {
                    console.log("Ooops. Something strange has happened copying the file: " + result);
                }
            }
        }});
    }
    DeleteAllRemoteFiles(){
        Meteor.call('deleteAllRemoteFiles',this.props.serverPath,(error, result) => {
            if(result){
                console.log('Removed ' + result.deletedFiles + ' files and ' + result.folders + ' folders');
                this.refreshRemoteDir(this);
            }
        })
    }

    render(){
        return(
        <div className="modal fade" id="ftpUserInterface" role="dialog">
            <div className="modal-dialog modal-lg">
                <div className="modal-content">
                    <div className="modal-header">
                        <button type="button" className="close" data-dismiss="modal">&times;</button>
                        <h4 className="modal-title redColored big-glyph">FILES MANAGEMENT USER INTERFACE</h4>
                    </div>
                    <div className="modal-body">



                            <div className="row">
                                <div className="col-md-5">
                                    <h3 className="redColored big-glyph text-center">Client side</h3>

                                    <div className="ftpFileContainer" id="ftpClientSide">
                                        {this.state.localFiles}
                                    </div>
                                    <div className="row btn-group centerBlock data-input">

                                            <label className="btn btn-lg btn-danger centerBlock">
                                                <i className="fa fa-folder-open" aria-hidden="true"></i> Browse
                                            <input ref="btnSelectedFiles" id="uploadFile" className="file" type="file" multiple onChange={this.selectFiles.bind(this)} />
                                            </label>
                                            <label className="btn btn-lg btn-danger" onClick={this.uploadLocalFiles.bind(this)}>
                                                <i className="fa fa-upload" aria-hidden="true"></i> Upload {this.state.uploadedSoFar}
                                            </label>

                                    </div>
                                </div>
                                <div className="col-md-2">

                                </div>

                                <div className="col-md-5">
                                    <h3 className="redColored big-glyph text-center">Server side</h3>
                                    <div className="ftpFileContainer" id="ftpServerSide">
                                        {this.state.serverFiles}
                                    </div>
                                    <div className="row btn-group centerBlock data-input">
                                        <label className="btn btn-lg btn-danger" onClick={this.DeleteAllRemoteFiles.bind(this)}>
                                            <i className="fa fa-trash-o" aria-hidden="true"></i> Delete all
                                        </label>

                                    </div>
                                </div>
                            </div>


                    </div>
                    <div className="modal-footer">
                        <button type="button" className="btn btn-danger" data-dismiss="modal" >Cancel</button>

                        <button type="submit" id="confirmationBtn" className="btn btn-default btn-default pull-right" data-dismiss="modal" >
                            <i className="fa fa-plane" aria-hidden="true"></i> Confirm
                        </button>

                    </div>
                </div>

            </div>
        </div>
        )
    }
}

FtpUi.propTypes = {
    serverPath           : PropTypes.string

}

//let pathD = '/home/luis/basura/projects/' + Session.get('selectedMission')
/*
Images = new FS.Collection("images", {
    stores: [new FS.Store.FileSystem("images", {path: '~/uploads'})]
});
    */


//https://github.com/CollectionFS/Meteor-CollectionFS/issues/252
//http://stackoverflow.com/questions/32138644/example-of-collectionfs-transformwrite-in-meteor
/*
var userHome = new FS.Store.FileSystem('home', { path: '~/uploads', internal: true });

var Images = new FS.Collection('images', new FS.Store.FileSystem('userfiles', {

    transformWrite: function(fileObj, readStream, writeStream) {
        if (aldeed) {
            readStream.pipe(userHome.createReadStream('foo.jpg', { folder: 'test' }));
        }
    },
}));
*/

/*
var myTransformWriteFunction = function(fileObj, readStream, writeStream){

};

var myTransformReadFunction = function(){

};

var imageStore = new FS.Store.FileSystem("images", {
    path: rootDirectory, //optional, default is "/cfs/files" path within app container
    transformWrite: myTransformWriteFunction, //optional
    transformRead: myTransformReadFunction, //optional
    maxTries: 1 //optional, default 5
});


Images = new FS.Collection("images", {
    stores: [imageStore]
    //stores: [new FS.Store.FileSystem("images", {path: rootDirectory})]

    //stores: [new FS.Store.FileSystem("images", {fileKeyMaker:'~/uploads/test/foto1.jpg' })]
});
*/