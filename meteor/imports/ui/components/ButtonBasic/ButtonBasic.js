import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { Button, Glyphicon } from 'react-bootstrap';

const ButtonBasic = ( props ) => {
        let title = props.title;
        if(props.isBlack){
            title = <b>{props.title}</b>
        };

        let spanObj = "";

        if(props.glyphicon){
            spanObj = <Glyphicon glyph={props.glyphicon}/>
        };

        if (props.isButtonList){
            return(
            <Button bsStyle="link" onClick={props.clickAction} disabled={props.isDisabled}>
                {spanObj} {title}
            </Button>
            )
        } else {
            return(
                <Button bsStyle="primary" onClick={props.clickAction} block disabled={props.isDisabled}>
                    {spanObj} {title}
                </Button>
            )
        }
};

ButtonBasic.propTypes = {
    title           : PropTypes.string.isRequired,
    glyphicon       : PropTypes.string,
    isButtonList    : PropTypes.bool,
    isBlack         : PropTypes.bool,
    clickAction     : PropTypes.func.isRequired,
    isDisabled      : PropTypes.bool
};

ButtonBasic.defaultProps = {
    isButtonList    : false,
    isBlack         : false,
    isDisabled      : false
};

export default ButtonBasic;
