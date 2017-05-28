import React, { Component } from 'react';
import PropTypes from 'prop-types';import { Button, ButtonToolbar } from 'react-bootstrap';

const LoginButtons = (props) => (
    <ButtonToolbar>
        <Button bsClass="btn btn-social btn-block btn-twitter" onClick={props.userAction}>
            <span className="fa fa-twitter"></span>Twitter
        </Button>
        <Button bsClass="btn btn-social btn-block btn-facebook" onClick={props.userAction}>
            <span className="fa fa-facebook"></span>Facebook
        </Button>
        <Button bsClass="btn btn-social btn-block btn-google" onClick={props.userAction}>
            <span className="fa fa-google"></span>Google
        </Button>
    </ButtonToolbar>
);

LoginButtons.PropTypes = {
  userAction: PropTypes.func.isRequired
};


export default LoginButtons;
