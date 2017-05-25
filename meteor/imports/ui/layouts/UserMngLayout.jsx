import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { createContainer } from 'meteor/react-meteor-data';
import SearchLayout from './SearchLayoutBasic';
import { Row, Col, Grid, PageHeader } from 'react-bootstrap';

// import { ItemBasic } from '../components/ItemBasic';
// import { SearchLayout } from './SearchLayoutBasic';
// import User from '../components/User';

class UserManagementLayout extends Component {

    checkIfCurrentUser(mappedUserId, currentUserId) {
        return mappedUserId === currentUserId;
    }

    editUser(id){
        console.log("Editing user "+ id);
    }

    softDeleteUser(id){
        console.log("Soft Deleting user "+ id);
    }

    hardDeleteUser(id){
        console.log("Hard Deleting user "+ id);
    }

    render() {
        let count = 0;
        const { users, currentUser, applicationRoles } = this.props;
        var rows = [];
        users.map( ({ _id, emails, profile }) => {
            const username = (emails ? emails[0].address : profile.name)
            return(
                rows.push({name:username, key:_id})
            )
        })
        return(
            <div className="appUserManagement">
                <Grid fluid>
                <Row>
                    <Col md={12} lg={12} sm={12} xs={12}>
                        <PageHeader>User Management</PageHeader>
                    </Col>
                </Row>
                <Row>
                    <SearchLayout rows={rows} listname="User" softDeleteHandler={this.softDeleteUser}
                    hardDeleteHandler={this.hardDeleteUser} editHandler={this.editUser}/>
                    <Col md={9} lg={9} sm={12} xs={12}>
                        {this.props.children}
                    </Col>
                </Row>
                </Grid>
            </div>
        )
    }
};


export default createContainer(() => {
    let usersSub = Meteor.subscribe('users');
    const usersArray = Meteor.users.find().fetch();
    // const isReady = usersSub.ready() && Roles.usersSub.ready();
    const currentUser = Meteor.user();
    const applicationRoles = Roles.getAllRoles().fetch();

    return {
        // ready: isReady,
        users: usersArray,
        currentUser: currentUser,
        applicationRoles: applicationRoles,
    }
}, UserManagementLayout);
