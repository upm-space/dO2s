/* eslint-disable max-len, no-return-assign */
import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { Row, Col, FormGroup, ControlLabel, Button, FormControl } from 'react-bootstrap';
import _ from 'lodash';
import { Meteor } from 'meteor/meteor';
import { Accounts } from 'meteor/accounts-base';
import { Bert } from 'meteor/themeteorchef:bert';

import validate from '../../../modules/validate';

class UserEditor extends Component {
  constructor(props) {
    super(props);

    this.getUserType = this.getUserType.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
    this.renderOAuthUser = this.renderOAuthUser.bind(this);
    this.renderPasswordUser = this.renderPasswordUser.bind(this);
    this.renderProfileForm = this.renderProfileForm.bind(this);
    this.handleResetPassword = this.handleResetPassword.bind(this);
    this.getUserType = this.getUserType.bind(this);
  }

  componentDidMount() {
    const component = this;

    validate(component.form, {
      rules: {
        firstName: {
          required: true,
        },
        lastName: {
          required: true,
        },
        emailAddress: {
          required: true,
          email: true,
        },
      },
      messages: {
        firstName: {
          required: 'What\'s your first name?',
        },
        lastName: {
          required: 'What\'s your last name?',
        },
        emailAddress: {
          required: 'Need an email address here.',
          email: 'Is this email address correct?',
        },
      },
      submitHandler() { component.handleSubmit(); },
    });
  }

  getUserType(user) {
    const userToCheck = user;
    delete userToCheck.services.resume;
    const service = Object.keys(userToCheck.services)[0];
    return service === 'password' ? 'password' : 'oauth';
  }

  handleResetPassword(userId) {
    Meteor.call('users.setPassword', userId, (error) => {
      if (error) {
        Bert.alert(error.reason, 'danger');
      } else {
        Bert.alert('User password reset to (password)', 'success');
      }
    },
  );
  }

  handleSubmit() {
    const { history } = this.props;
    const existingUser = this.props.user && this.props.user._id;
    const methodToCall = existingUser ? 'users.update' : 'users.insert';
    const user = {
      email: this.emailAddress.value,
      profile: {
        name: {
          first: this.firstName.value,
          last: this.lastName.value,
        },
      },
    };
    if (existingUser) {
      user._id = existingUser;
    } else {
      user.password = 'password';
    }
    Meteor.call(methodToCall, user, (error, userId) => {
      if (error) {
        Bert.alert(error.reason, 'danger');
      } else {
        const confirmation = existingUser ? 'User updated!' : 'User added!';
        this.form.reset();
        if (!existingUser) {
          Meteor.call('users.sendVerificationEmail', userId);
          Bert.alert(confirmation, 'success');
          history.push('/users');
        } else {
          Bert.alert(confirmation, 'success');
          history.push('/users');
        }
      }
    });
  }

  renderOAuthUser(user) {
    return (<div className="OAuthProfile">
      {Object.keys(user.services).map(service => (
        <div key={service} className={`LoggedInWith ${service}`}>
          <div className="ServiceIcon"><i className={`fa fa-${service === 'facebook' ? 'facebook-official' : service}`} /></div>
          <p>{`This user is registered with ${_.capitalize(service)} using the email address ${user.services[service].email}.`}</p>
        </div>
      ))}
    </div>);
  }

  renderPasswordUser(user) {
    const existingUser = user && user._id;
    return (<div>
      <Row>
        <Col sm={6}>
          <FormGroup>
            <ControlLabel>First Name</ControlLabel>
            <input
              type="text"
              name="firstName"
              defaultValue={user.profile.name.first}
              ref={firstName => (this.firstName = firstName)}
              className="form-control"
            />
          </FormGroup>
        </Col>
        <Col sm={6}>
          <FormGroup>
            <ControlLabel>Last Name</ControlLabel>
            <input
              type="text"
              name="lastName"
              defaultValue={user.profile.name.last}
              ref={lastName => (this.lastName = lastName)}
              className="form-control"
            />
          </FormGroup>
        </Col>
      </Row>
      <Row>
        <Col sm={6}>
          <FormGroup>
            <ControlLabel>Email Address</ControlLabel>
            <input
              type="email"
              name="emailAddress"
              defaultValue={user.emails[0].address}
              ref={emailAddress => (this.emailAddress = emailAddress)}
              className="form-control"
            />
          </FormGroup>
        </Col>
        <Col sm={6}>
          <FormGroup>
            <ControlLabel>Password</ControlLabel>
            <Col sm={8}>
              {<FormControl.Static>
                The new password will be <strong>password</strong>
              </FormControl.Static>}
            </Col>
            <Col sm={4}>
              {existingUser ? (<Button bsStyle="warning" onClick={() => this.handleResetPassword(existingUser)}>Reset Password</Button>) : ''}
            </Col>
          </FormGroup>
        </Col>
      </Row>


      <hr />
      <Button type="submit" bsStyle="success">
        {existingUser ? 'Save Changes' : 'Add User'}
      </Button>
    </div>);
  }

  renderProfileForm(user) {
    const existingUser = user && user._id;
    if (existingUser) {
      return ({
        password: this.renderPasswordUser,
        oauth: this.renderOAuthUser,
      }[this.getUserType(user)])(user);
    }
    return this.renderPasswordUser(user);
  }

  render() {
    const { user } = this.props;
    return (
      <form ref={form => (this.form = form)} onSubmit={event => event.preventDefault()}>
        {this.renderProfileForm(user)}
      </form>);
  }
}

UserEditor.defaultProps = {
  user: {
    profile: { name: { first: '', last: '' } },
    emails: [{ address: '' }],
  },
};

UserEditor.propTypes = {
  history: PropTypes.object.isRequired,
  user: PropTypes.object.isRequired,
};

export default UserEditor;
