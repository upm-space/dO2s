import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { createContainer } from 'meteor/react-meteor-data';

// import { ItemBasic } from '../components/ItemBasic';
// import { SearchLayout } from './SearchLayoutBasic';
import User from '../components/User';

export class UserManagementLayout extends Component{

    componentDidMount(){
        console.log("Componente Montado");
        setTimeout(()=>{
            this.printUsers(this.state.usuarios);},100
        )

    }
    printUsers(usuarios1){
        usuarios1.forEach((usuario) => {
            //console.log("Usuario AA : " + usuario.emails[0].address);
        })
    }
    editUser(id){
        console.log("Editing user "+ id);
    }
    deleteUser(id){
        console.log("Deleting user "+ id);
    }
    render(){

        return(
            <div className="appUserManagement">
                <h1>User Management</h1>
                <div className="row precise-width">
                    <div className="col-md-3 col-lg-3">
                        {this.props.users.map((user) => {
                        return <User user={user} key={user._id}/>
                    })}
                    </div>
                    <div className="col-md-9 col-lg-9">
                        {this.props.children}
                    </div>
                </div>
            </div>
        )
    }
};



export default createContainer(() => {
    let usersSub = Meteor.subscribe('allUserData');
    let usersArray = Meteor.users.find({}).fetch();
    return{
        users: usersArray
    }
}, UserManagementLayout);
