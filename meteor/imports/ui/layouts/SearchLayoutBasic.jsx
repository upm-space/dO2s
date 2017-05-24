import React, { Component } from 'react';
import PropTypes from 'prop-types';
import ButtonBasic from '../components/ButtonBasic';
import ItemBasic from '../components/ItemBasic';
import { Row, Col, Grid, ListGroup, Button, Glyphicon, Panel } from 'react-bootstrap';

export default class SearchLayout extends Component{
    saluda(){
        console.log("Saluda");
    }

    renderItems(){
        if(this.props.rows.length > 0) {
            let objetos = this.props.rows.map((row)=>(
                <ItemBasic
                name={row.name}
                key={row.key}
                guid={row.key}
                deleteHandler={this.props.deleteHandler}
                editHandler={this.props.editHandler}/>
            ));
            return (
                // <ul id="project-list" className="scroll">
                objetos
                // </ul>
            );
        }
    }

    render(){
        const newitem = "Add " + this.props.listname;
        const panelheader = this.props.listname + " List";
        const paneltitle = (
            <span className="clearfix">
                <h3 className="pull-left">{panelheader}</h3>
                <span className="pull-right" style={{paddingTop: "1em"}}>
                <Button bsStyle="link" onClick={this.saluda}>
                <b>Delete</b>
                </Button>
                </span>
            </span>);
        return(
            <Col md={3} lg={3} sm={12} xs={12}>
                <Row>
                    <Col md={12} lg={12} sm={12} xs={12}>
                        <Button bsStyle="primary" onClick={this.saluda} block>
                            <Glyphicon glyph="plus"></Glyphicon>{newitem}
                        </Button>
                    </Col>
                </Row>
                <Row>
                    <Col md={12} lg={12} sm={12} xs={12}>
                        <Panel collapsible={false} header={paneltitle}>
                            <ListGroup fill>
                                {/* {this.props.rows > 0 ? (this.props.rows.map((row)=>(
                                    <ItemBasic
                                    name={row.name}
                                    key={row.key}
                                    guid={row.key}
                                    deleteHandler={this.props.deleteHandler}
                                    editHandler={this.props.editHandler}/>))) : null} */}
                                    {this.renderItems()}
                            </ListGroup>
                        </Panel>
                    </Col>
                </Row>
            </Col>
        )
    }
}

SearchLayout.PropTypes = {
    rows            : PropTypes.array.isrequired,
    deleteHandler  : PropTypes.func.isRequired,
    editHandler    : PropTypes.func.isRequired,
    listname       : PropTypes.string.isrequired,
}
