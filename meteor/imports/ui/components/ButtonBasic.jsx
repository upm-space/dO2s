import React, { Component } from 'react';
import PropTypes from 'prop-types';
import Button from 'react-bootstrap';

const ButtonBasic = ({props}) => (
    render() {
        let spanObj = "";
        if(props.glyphicon){
            spanObj = <Glyphicon glyph="{props.glyphicon}"/>
        }

        let title = props.title;
        if(props.isBlack){
            title = <b>{props.title}</b>;
        }

        if (props.isButtonList){
            return(
                <Button bsClass="list-button" onClick={()=>props.onCLick()}>
                    {spanObj} {title}
                </Button>
            )
        } else {
            return(
                <Button bsClass="btn button-basic" onClick={()=>props.onCLick()} block>
                    {spanObj} {title}
                </Button>
            )
        }

    }
);

ButtonBasic.propTypes = {
    title           : PropTypes.string.isRequired,
    glyphicon       : PropTypes.string,
    isButtonList    : PropTypes.bool,
    isBlack         : PropTypes.bool,
    onCLick         : PropTypes.func.isRequired

}

ButtonBasic.defaultProps = {
    isButtonList    : false,
    isBlack         : false
}

export default ButtonBasic;
