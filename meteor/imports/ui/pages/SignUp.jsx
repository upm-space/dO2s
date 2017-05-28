import React, { Component } from 'react';
import { NavLink } from 'react-router-dom';
import { Row, Col, FormGroup, ControlLabel, FormControl, Button, ButtonToolbar } from 'react-bootstrap';
import LoginButtons from '../components/LoginButtons';
// import handleSignup from '../../modules/signup';


export default class SignUp extends Component {
  // componentDidMount() {
  //   handleSignup({ component: this });
  // }
  saluda() {
      console.log("hola");
  }

  handleSubmit(event) {
    event.preventDefault();
  }

  render() {
    return (
      <div className="center-block SignupButtons">
        <Row>
            <Col xs={ 12 } smOffset={3} sm={ 6 } mdOffset={4} md={ 4 }>
                <h3 className="page-header">Sign Up</h3>
                <LoginButtons userAction={this.saluda}></LoginButtons>
                <hr/>
          <form
            ref={ form => (this.signupForm = form) }
            // onSubmit={ this.handleSubmit }
          >
            <Row>
              <Col xs={ 6 } sm={ 6 }>
                <FormGroup>
                  <ControlLabel>First Name</ControlLabel>
                  <FormControl
                    type="text"
                    ref="firstName"
                    name="firstName"
                    placeholder="First Name"
                  />
                </FormGroup>
              </Col>
              <Col xs={ 6 } sm={ 6 }>
                <FormGroup>
                  <ControlLabel>Last Name</ControlLabel>
                  <FormControl
                    type="text"
                    ref="lastName"
                    name="lastName"
                    placeholder="Last Name"
                  />
                </FormGroup>
              </Col>
            </Row>
                <FormGroup>
                  <ControlLabel>Email Address</ControlLabel>
                  <FormControl
                    type="text"
                    ref="emailAddress"
                    name="emailAddress"
                    placeholder="Email Address"
                  />
                </FormGroup>
                <FormGroup>
                  <ControlLabel>Password</ControlLabel>
                  <FormControl
                    type="password"
                    ref="password"
                    name="password"
                    placeholder="Password"
                  />
                </FormGroup>
                <Button type="submit" bsStyle="success" block>Sign Up</Button>
              </form>
              <p>Already have an account? <NavLink to="/login">Log In</NavLink>.</p>
            </Col>
        </Row>
      </div>
    );
  }
}
