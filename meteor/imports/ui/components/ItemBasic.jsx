import React, { Component } from 'react';
import PropTypes from 'prop-types';
import ButtonBasic from './ButtonBasic';

const ItemBasic = ({ props }) => (
    // ver este link https://facebook.github.io/react/docs/thinking-in-react.html
    <Row bsClass="row precise-width search-item-list" >
        <Col md={10} lg={10} sm={10} xs={10}>
            <ButtonBasic title={this.props.name} onCLick={()=>this.props.editHandler(this.props.guid)} isButtonList={true}/>
        </Col>
        <Col md={2} lg={2} sm={2} xs={2}>
            <ButtonBasic title="" onCLick={()=>this.props.deleteHandler(this.props.guid)} glyphicon="trash" isButtonList={true}/>
        </Col>
    </Row>
);

ItemBasic.PropTypes = {
    name           : PropTypes.string.isRequired,
    key            : PropTypes.string.isRequired,
    guid           : PropTypes.string.isRequired,
    deleteHandler  : PropTypes.func.isRequired,
    editHandler    : PropTypes.func.isRequired
}

export default ItemBasic;
