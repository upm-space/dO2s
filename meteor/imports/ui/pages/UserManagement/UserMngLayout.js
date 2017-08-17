import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { createContainer } from 'meteor/react-meteor-data';
import { Meteor } from 'meteor/meteor';
import { Roles } from 'meteor/alanning:roles';
import { Row, Col, PageHeader } from 'react-bootstrap';
import { Bert } from 'meteor/themeteorchef:bert';
import { Redirect } from 'react-router-dom';

import SearchComponent from '../../components/SearchComponent/SearchComponent';

class UserManagementLayout extends Component {
  constructor(props) {
    super(props);
    this.authorizeAccess = this.authorizeAccess.bind(this);
    this.handleChangeRole = this.handleChangeRole.bind(this);
  }

  componentWillMount() {
    this.authorizeAccess();
  }

  componentDidUpdate() {
    this.authorizeAccess();
  }

  authorizeAccess() {
    if (!Roles.userIsInRole(this.props.currentUser, ['admin'])) {
      return <Redirect to="/" />;
    }
  }

  checkIfCurrentUser(mappedUserId, currentUserId) {
    return mappedUserId === currentUserId;
  }

  handleChangeRole(_id, role) {
    Meteor.call('users.changeRole', { _id, role }, (error) => {
      if (error) {
        Bert.alert(error.reason, 'warning');
      } else {
        Bert.alert('Role updated!', 'success');
      }
    });
  }

  editUser(id) {
    console.log(`Editing user ${id}`);
  }

  softDeleteUser(id) {
    console.log(`Soft Deleting user ${id}`);
  }

  hardDeleteUser(id) {
    console.log(`Hard Deleting user ${id}`);
  }

  render() {
    const { users, currentUser, applicationRoles } = this.props;
    const rows = [];
    users.map(({ _id, emails, profile }) => {
      const username = (emails ? emails[0].address : profile.name);
      return (rows.push({ name: username, key: _id }));
    });
    return (
      <div className="appUserManagement">
        <Row>
          <Col md={12} lg={12} sm={12} xs={12} xsHidden>
            <PageHeader>User Management</PageHeader>
          </Col>
        </Row>
        <Row>
          <SearchComponent
            rows={rows}
            listname="User"
            softDeleteHandler={this.softDeleteUser}
            hardDeleteHandler={this.hardDeleteUser}
            editHandler={this.editUser}
          />
          <Col md={9} lg={9} sm={12} xs={12}>
            {/* {this.props.children} */}
          </Col>
        </Row>
      </div>
    );
  }
}

UserManagementLayout.propTypes = {
  users: PropTypes.array.isRequired,
  currentUser: PropTypes.object.isRequired,
  applicationRoles: PropTypes.array.isRequired,
  // children: PropTypes.node,
};


export default createContainer(() => {
  const usersSub = Meteor.subscribe('users');
  const usersArray = Meteor.users.find().fetch();
    // const isReady = usersSub.ready() && Roles.usersSub.ready();
  const currentUser = Meteor.user();
  const applicationRoles = Roles.getAllRoles().fetch();

  return {
    loading: !usersSub.ready(),
    users: usersArray,
    currentUser,
    applicationRoles,
  };
}, UserManagementLayout);
