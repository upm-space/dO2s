import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { Button, ButtonToolbar } from 'react-bootstrap';
import handleExternalLogin from '../../modules/social-logins.js';


export default class LoginButtons extends Component {
    constructor(props) {
        super(props);
        this.handleClick = this.handleClick.bind(this);
    }

    handleClick(event) {
        handleExternalLogin(event);
    }

    render() {
        return(
            <ButtonToolbar>
                <Button bsClass="btn btn-social btn-block btn-facebook" onClick={(event)=>this.handleClick(event.target.getAttribute("data-social-login"))} data-social-login="loginWithFacebook">
                    <span className="fa fa-facebook"></span>Facebook
                </Button>
                <Button bsClass="btn btn-social btn-block btn-google" onClick={(event)=>this.handleClick(event.target.getAttribute("data-social-login"))} data-social-login="loginWithGoogle">
                    <span className="fa fa-google"></span>Google
                </Button>
            </ButtonToolbar>
        )
    }
};
