/* eslint-disable jsx-a11y/no-noninteractive-element-interactions, consistent-return */
import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { Link, Redirect } from 'react-router-dom';
import { Table, Alert, Button, Glyphicon } from 'react-bootstrap';
import { monthDayYearAtTime } from '@cleverbeagle/dates';
import { Meteor } from 'meteor/meteor';
import { Roles } from 'meteor/alanning:roles';
import { withTracker } from 'meteor/react-meteor-data';
import { Bert } from 'meteor/themeteorchef:bert';

import Loading from '../../components/Loading/Loading';
import TrashModal from '../../components/TrashModal/TrashModal';

class UserManagement extends Component {
  constructor(props) {
    super(props);

    this.handleHardRemove = this.handleHardRemove.bind(this);
    this.handleSoftRemove = this.handleSoftRemove.bind(this);
    this.handleRestore = this.handleRestore.bind(this);
    this.renderUsers = this.renderUsers.bind(this);
    this.trashClose = this.trashClose.bind(this);
    this.authorizeAccess = this.authorizeAccess.bind(this);
    this.getUserType = this.getUserType.bind(this);
    this.renderOAuthUser = this.renderOAuthUser.bind(this);
    this.renderPasswordUser = this.renderPasswordUser.bind(this);
    this.renderEmailCell = this.renderEmailCell.bind(this);
    this.getUserName = this.getUserName.bind(this);

    this.state = {
      hideCompleted: false,
      trashShow: false,
      showGrid: false,
      showList: true,
    };
  }

  getInitialState() {
    return {
      trashShow: false,
    };
  }

  componentWillMount() {
    this.authorizeAccess();
  }

  componentDidUpdate() {
    this.authorizeAccess();
  }

  getUserType(user) {
    const userToCheck = user;
    delete userToCheck.services.resume;
    const service = Object.keys(userToCheck.services)[0];
    return service === 'password' ? 'password' : 'oauth';
  }

  getUserName(name) {
    return ({
      string: name,
      object: `${name.first} ${name.last}`,
    }[typeof name]);
  }

  authorizeAccess() {
    if (!Roles.userIsInRole(this.props.currentUserId, ['admin'])) {
      return <Redirect to="/" />;
    }
  }


  handleSoftRemove(userId) {
    if (confirm('Move to Trash?')) {
      if (userId === Meteor.userId()) {
        Bert.alert("You can't delete your own account", 'danger');
      } else {
        Meteor.call('users.softDelete', userId, (error) => {
          if (error) {
            Bert.alert(error.reason, 'danger');
          } else {
            Bert.alert('User moved to Trash!', 'warning');
          }
        });
      }
    }
  }

  handleRestore(userId) {
    if (confirm('Restore User?')) {
      Meteor.call('users.restore', userId, (error) => {
        if (error) {
          Bert.alert(error.reason, 'danger');
        } else {
          Bert.alert('User Restored!', 'success');
        }
      });
    }
  }

  handleHardRemove(userId) {
    if (confirm('Are you sure? This is permanent!')) {
      if (userId === Meteor.userId()) {
        Bert.alert("You can't delete your own account", 'danger');
      } else {
        Meteor.call('users.hardDelete', userId, (error) => {
          if (error) {
            Bert.alert(error.reason, 'danger');
          } else {
            Bert.alert('User deleted!', 'danger');
          }
        });
      }
    }
  }


  trashClose() {
    this.setState({
      trashShow: false,
    });
  }

  renderOAuthUser(user, currentUserId) {
    const isThisCurrentUser = currentUserId === user._id;
    const goToUser = () => { !isThisCurrentUser ? this.props.history.push(`${this.props.match.url}/${user._id}/edit`) : ''; };
    return (<td onClick={goToUser} className="OAuthCell">
      {Object.keys(user.services).map(service => (
        <div key={service} className={`LoggedInWith ${service}`}>
          <div className="ServiceIcon"><i className={`fa fa-${service === 'facebook' ? 'facebook-official' : service}`} /></div>
          <p>{user.services[service].email}</p>
        </div>
      ))}
    </td>);
  }

  renderPasswordUser(user, currentUserId) {
    const isThisCurrentUser = currentUserId === user._id;
    const goToUser = () => { !isThisCurrentUser ? this.props.history.push(`${this.props.match.url}/${user._id}/edit`) : ''; };
    return <td className={user.emails[0].verified ? '' : 'warning'} onClick={goToUser}>{user.emails[0].address}</td>;
  }

  renderEmailCell(user, currentUserId) {
    return ({
      password: this.renderPasswordUser,
      oauth: this.renderOAuthUser,
    }[this.getUserType(user)])(user, currentUserId);
  }


  renderUsers(users, currentUserId) {
    return users.map((user) => {
      let userRoles = '';
      for (let i = 0; i < user.roles.length; i += 1) {
        if (i === user.roles.length - 1) {
          userRoles += `${user.roles[i]}`;
        } else {
          userRoles += `${user.roles[i]}, `;
        }
      }
      const isThisCurrentUser = currentUserId === user._id;
      const goToUser = () => { !isThisCurrentUser ? this.props.history.push(`${this.props.match.url}/${user._id}/edit`) : ''; };
      return (
        <tr
          key={user._id}
        >
          <td onClick={goToUser}>{this.getUserName(user.profile.name)}</td>
          {this.renderEmailCell(user, currentUserId)}
          <td onClick={goToUser}>{userRoles}</td>
          <td onClick={goToUser}>
            {monthDayYearAtTime(user.createdAt)}</td>
          <td className="button-column">
            <Button
              bsStyle="danger"
              onClick={() => this.handleSoftRemove(user._id)}
              disabled={isThisCurrentUser}
            ><i className="fa fa-times" aria-hidden="true" /></Button>
          </td>
        </tr>);
    });
  }

  render() {
    const { loading, users, match, userId: currentUserId } = this.props;
    return (!loading ? (
      <div className="UserManagement">
        <TrashModal
          title="Recycle Bin"
          show={this.state.trashShow}
          onHide={() => this.trashClose()}
          itemName="Users"
          loading={loading}
          deletedCount={this.props.deletedCount}
          handleRestore={this.handleRestore}
          handleHardRemove={this.handleHardRemove}
          deletedItems={this.props.deletedUsers}
        />
        <div className="page-header clearfix">
          <h4 className="pull-left">User Manager</h4>
          <Link className="btn btn-success pull-right" to={`${match.url}/new`}>Add User</Link>
        </div>
        {users.length ? <div className="ItemList"><Table responsive hover>
          <thead>
            <tr>
              <th>
                Users ({this.props.totalCount})
              </th>
              <th>Email</th>
              <th>Roles</th>
              <th>Created</th>
              <th><Button
                bsStyle="default"
                onClick={() => this.setState({ trashShow: true })}
                block
              ><Glyphicon glyph="trash" /></Button></th>
            </tr>
          </thead>
          <tbody>
            {this.renderUsers(users, currentUserId)}
          </tbody>
        </Table></div> : <Alert bsStyle="warning">Something went wrong!</Alert>}
      </div>
    ) : <Loading />);
  }
}

UserManagement.propTypes = {
  loading: PropTypes.bool.isRequired,
  userId: PropTypes.string.isRequired,
  users: PropTypes.arrayOf(PropTypes.object).isRequired,
  deletedUsers: PropTypes.arrayOf(PropTypes.object).isRequired,
  match: PropTypes.object.isRequired,
  history: PropTypes.object.isRequired,
  deletedCount: PropTypes.number.isRequired,
  totalCount: PropTypes.number.isRequired,
};

export default withTracker(() => {
  const usersSub = Meteor.subscribe('users.management');
  return {
    loading: !usersSub.ready(),
    users: Meteor.users.find({ deleted: { $eq: 'no' } }).fetch(),
    deletedUsers: Meteor.users.find({ deleted: { $ne: 'no' } }).fetch(),
    deletedCount: Meteor.users.find({ deleted: { $ne: 'no' } }).count(),
    totalCount: Meteor.users.find({ deleted: { $eq: 'no' } }).count(),
  };
})(UserManagement);
