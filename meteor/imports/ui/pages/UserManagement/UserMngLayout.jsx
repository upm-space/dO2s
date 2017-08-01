import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { createContainer } from 'meteor/react-meteor-data';
import SearchLayout from './SearchLayoutBasic';
import { Meteor } from 'meteor/meteor';
import { Roles } from 'meteor/alanning:roles';
import { Row, Col, Grid, PageHeader } from 'react-bootstrap';

class UserManagementLayout extends Component {
    constructor(props) {
        super(props);
        this.authorizeAccess = this.authorizeAccess.bind(this);
        this.handleChangeRole = this.handleChangeRole.bind(this);
    }

    authorizeAccess() {
        if (!Roles.userIsInRole(this.props.currentUser, ['admin'])) {
          <Redirect to="/"/>
        }
    }

    componentDidUpdate() {
        this.authorizeAccess();
    }

    componentWillMount() {
        this.authorizeAccess();
    }

    checkIfCurrentUser(mappedUserId, currentUserId) {
        return mappedUserId === currentUserId;
    }

    handleChangeRole(_id, role) {
        Meteor.call('users.changeRole', { _id, role }, (error) => {
            if (error) {
                    <Alert bsStyle="danger">
                    <strong>Holy guacamole!</strong>
                    </Alert>
                // Bert.alert(error.reason, 'danger');
            } else {
                <Alert bsStyle="success">
                <strong>Holy guacamole!</strong> Role Updated
                </Alert>
                // Bert.alert('Role updated!', 'success');
            }
        });
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
                <Row>
                    <Col md={12} lg={12} sm={12} xs={12} xsHidden>
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
            </div>
        )
    }
};

UserManagementLayout.PropTypes = {
    users: PropTypes.array,
    currentUser: PropTypes.object,
    applicationRoles: PropTypes.array
}


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
