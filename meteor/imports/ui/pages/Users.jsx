import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { createContainer } from 'meteor/react-meteor-data';
import { Meteor } from 'meteor/meteor';
import { Roles } from 'meteor/alanning:roles';
import { PageHeader, Row, Table, Label, FormGroup, FormControl,  } from 'react-bootstrap';

class Users extends Component {
    constructor(props) {
        super(props);
    }

    checkIfCurrentUser(mappedUserId, currentUserId) {
        return mappedUserId === currentUserId;
    }

    render() {
        let count = 0;
        const { users, currentUser, applicationRoles } = this.props;
        return (<div className="users">
            <PageHeader>Users</PageHeader>
            <Table bordered responsive>
                <thead>
                    <tr>
                        <th>#</th>
                        <th>Email Address</th>
                        <th>Verified</th>
                        <th>Roles</th>
                    </tr>
                </thead>
                <tbody>
                    {users.map(({ _id, emails, roles, profile }) => {
                    const isCurrentUser = this.checkIfCurrentUser(_id, currentUser._id);
                    return (<tr key={_id}>
                        <td className="vertical-align" width="5%">
                            {++count}
                        </td>
                        <td className="vertical-align" width="40%">
                            {isCurrentUser ? <Label bsStyle="success">You!</Label> : ''}
                            {emails ? emails[0].address : profile.name}
                        </td>
                        <td className="vertical-align" width="10%">
                            {emails ? (emails[0].verified ? "Yes" : "No") : "Other Login"}
                        </td>
                        <td className="vertical-align" width="45%">
                            {roles ? (roles.map((role) => {
                                return(
                                    <FormGroup controlId="formControlsSelectMultiple">
                                    <FormControl componentClass="select" multiple value={role}
                                    disabled={isCurrentUser}>
                                    {applicationRoles.map((role) => (
                                    <option key={role._id} value={role.name}>{role.name}</option>
                                    ))}
                                    </FormControl>
                                    </FormGroup>
                                    /* <select
                                        className="form-control"
                                        value={role}
                                        disabled={isCurrentUser}
                                        >
                                        {applicationRoles.map((role) => (
                                        <option key={role._id} value={role.name}>{role.name}</option>
                                        ))}
                                    </select> */
                                );
                            })) :
                            (<select
                                className="form-control"
                                value="empty"
                                disabled={isCurrentUser}
                                >
                                    {console.log(applicationRoles)}
                                <option key="empty" value="empty">-</option>
                                {applicationRoles.map((role) => (
                                <option key={role._id} value={role.name}>{role.name}</option>
                                ))}
                            </select>)
                        }
                        </td>
                    </tr>);
                    })}
                </tbody>
            </Table>
        </div>
        );
    }
};

Users.propTypes = {
  users: PropTypes.array,
  currentUser: PropTypes.object,
  applicationRoles: PropTypes.array,
};


export default createContainer(({props}) => {
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
}, Users);