import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import { Row, Col, FormGroup, ControlLabel, Button } from 'react-bootstrap';
import PropTypes from 'prop-types';
import { Meteor } from 'meteor/meteor';
import { Accounts } from 'meteor/accounts-base';
import { Bert } from 'meteor/themeteorchef:bert';


import OAuthLoginButtons from '../../components/OAuthLoginButtons/OAuthLoginButtons';
import InputHint from '../../components/InputHint/InputHint';
import AccountPageFooter from '../../components/AccountPageFooter/AccountPageFooter';
import validate from '../../../modules/validate';

class SignUp extends Component {
  constructor(props) {
    super(props);
    this.handleSubmit = this.handleSubmit.bind(this);
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
        password: {
          required: true,
          minlength: 6,
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
        password: {
          required: 'Need a password here.',
          minlength: 'Please use at least six characters.',
        },
      },
      submitHandler() { component.handleSubmit(); },
    });
  }

  handleSubmit() {
    const { history } = this.props;

    Accounts.createUser({
      email: this.emailAddress.value,
      password: this.password.value,
      profile: {
        name: {
          first: this.firstName.value,
          last: this.lastName.value,
        },
      },
    }, (error) => {
      if (error) {
        Bert.alert(error.reason, 'danger');
      } else {
        Meteor.call('users.sendVerificationEmail');
        Bert.alert('Welcome!', 'success');
        history.push('/projects');
      }
    });
  }

  render() {
    return (<div className="SignUp">
      <Row>
        <Col xs={12} smOffset={3} sm={6} mdOffset={4} md={4}>
          <h4 className="page-header">Sign Up</h4>
          <Row><Col xs={12}>
            <OAuthLoginButtons
              services={['facebook', 'google']}
              emailMessage={{
                offset: 97,
                text: 'Sign Up with an Email Address',
              }}
            />
          </Col></Row>
          <hr />
          <form
            ref={form => (this.form = form)}
            onSubmit={event => event.preventDefault()}
          >
            <Row>
              <Col xs={6} sm={6}>
                <FormGroup>
                  <ControlLabel>First Name</ControlLabel>
                  <input
                    type="text"
                    ref={firstName => (this.firstName = firstName)}
                    name="firstName"
                    className="form-control"
                  />
                </FormGroup>
              </Col>
              <Col xs={6} sm={6}>
                <FormGroup>
                  <ControlLabel>Last Name</ControlLabel>
                  <input
                    type="text"
                    ref={lastName => (this.lastName = lastName)}
                    className="form-control"
                    name="lastName"
                  />
                </FormGroup>
              </Col>
            </Row>
            <FormGroup>
              <ControlLabel>Email Address</ControlLabel>
              <input
                type="text"
                name="emailAddress"
                ref={emailAddress => (this.emailAddress = emailAddress)}
                className="form-control"
              />
            </FormGroup>
            <FormGroup>
              <ControlLabel>Password</ControlLabel>
              <input
                type="password"
                name="password"
                ref={password => (this.password = password)}
                className="form-control"
              />
              <InputHint>Use at least six characters.</InputHint>
            </FormGroup>
            <Button type="submit" bsStyle="success" block>Sign Up</Button>
            <hr />
            <AccountPageFooter>
              <p>Already have an account? <Link to="/login">Log In</Link>.</p>
            </AccountPageFooter>
          </form>
        </Col>
      </Row>
    </div>);
  }
}

SignUp.propTypes = {
  history: PropTypes.object.isRequired,
};

export default SignUp;
