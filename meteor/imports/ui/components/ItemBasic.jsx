import React, { Component } from 'react';
import PropTypes from 'prop-types';
import ButtonBasic from './ButtonBasic';
import { Row, Col, ListGroupItem, Button, Glyphicon} from 'react-bootstrap'

const ItemBasic = ( props ) => (
    // ver este link https://facebook.github.io/react/docs/thinking-in-react.html
    //  <Row bsClass="row precise-width search-item-list" >
    <div className="clearfix">
        <ListGroupItem onClick={()=>props.editHandler(props.guid)} >{props.name} <span className="pull-right">
            <Button bsStyle="link" onClick={()=>props.deleteHandler(props.guid)}><Glyphicon glyph="trash"/></Button>
        </span></ListGroupItem>
    </div>
);


ItemBasic.PropTypes = {
    name           : PropTypes.string.isRequired,
    key            : PropTypes.string.isRequired,
    guid           : PropTypes.string.isRequired,
    deleteHandler  : PropTypes.func.isRequired,
    editHandler    : PropTypes.func.isRequired,
    isDisabled      : PropTypes.oneOf(['disabled', null])
};

ItemBasic.defaultProps = {
    isDisabled      : null
};

export default ItemBasic;
