import React, { Component } from 'react';
import { NavLink } from 'react-router-dom';
import { Row, Col, FormGroup, ControlLabel, FormControl, Button } from 'react-bootstrap';
import LoginButtons from '../components/LoginButtons';
import handleLogin from '../../modules/login';

export default class Login extends Component {
    constructor(props) {
        super(props);
        this.state = {
            resultIsValid: false
        }
    }

    componentDidMount() {
        handleLogin({ component: this });
    }

    handleSubmit(event) {
        event.preventDefault();
    }

    render() {
        if (this.state.resultIsValid) {
            return <Redirect push to="/"/>
        }
        return (
            <div className="login">
                <Row>
                    <Col xs={ 12 } smOffset={3} sm={ 6 } mdOffset={4} md={ 4 }>
                        <h3 className="page-header">Log In</h3>
                        <LoginButtons />
                        <hr/>
                        <form
                        ref={ form => (this.loginForm = form) }
                        className="login"
                        onSubmit={ this.handleSubmit }
                        >
                            <FormGroup>
                                <ControlLabel>Email Address</ControlLabel>
                                <FormControl
                                type="email"
                                ref="emailAddress"
                                name="emailAddress"
                                placeholder="Email Address"
                                />
                            </FormGroup>
                            <FormGroup>
                                <ControlLabel>
                                    <span className="pull-left">Password</span>
                                </ControlLabel>
                                <ControlLabel className="pull-right">
                                    <NavLink to="/recover-password">Forgot Password?</NavLink>
                                </ControlLabel>
                                <FormControl
                                type="password"
                                ref="password"
                                name="password"
                                placeholder="Password"
                                />
                            </FormGroup>
                            <Button type="submit" bsStyle="success">Login</Button>
                        </form>
                        <hr/>
                        <p>Need to create an account? <NavLink to="/signup">Sign Up</NavLink>.</p>
                    </Col>
                </Row>
            </div>
        );
    }
}
