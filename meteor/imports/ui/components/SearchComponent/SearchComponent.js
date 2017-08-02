import React, { Component } from 'react';
import PropTypes from 'prop-types';
import BasicModal from '../BasicModal/BasicModal';
import ItemBasic from '../ItemBasic/ItemBasic';
import { Row, Col, Grid, ListGroup, Button, Glyphicon, Panel } from 'react-bootstrap';

export default class SearchLayout extends Component{
    constructor() {
        super();
        this.state = {
            deleteModalShow: false,
            newItemShow: false,
            trashShow: false
        }
    }

    getInitialState() {
      return {
          deleteModalShow: false,
          newItemShow: false,
          trashShow: false
       }
    }

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
                deleteHandler={this.props.softDeleteHandler}
                editHandler={this.props.editHandler}/>
            ));
            return (
                objetos
            );
        }
    }

    render(){
        const newitem = " Add " + this.props.listname;
        const panelheader = this.props.listname + " List";
        let deleteClose = () => this.setState( {deleteModalShow: false} );
        let newItemClose = () => this.setState( {newItemShow: false} );
        let trashClose = () => this.setState( {trashShow: false} );
        const paneltitle = (
            <span className="clearfix">
                <h3 className="pull-left">{panelheader}</h3>
                <span className="pull-right" style={{paddingTop: "1.2em"}}>
                <Button bsStyle="link" onClick={()=>this.setState({ trashShow: true })}>
                <b>Delete</b>
                </Button>
                </span>
            </span>);

        return(
            <Col md={3} lg={3} sm={12} xs={12}>
                <Row>
                    <Col md={12} lg={12} sm={12} xs={12}>
                        <Button bsStyle="primary" onClick={()=>this.setState({ newItemShow: true })} block>
                            <Glyphicon glyph="plus"></Glyphicon>{newitem}
                        </Button>
                    </Col>
                </Row>
                <Row>
                    <Col md={12} lg={12} sm={12} xs={12}>
                        <Panel collapsible={false} header={paneltitle}>
                            <ListGroup fill componentClass="div">
                                {this.renderItems()}
                            </ListGroup>
                        </Panel>
                    </Col>
                </Row>

                <BasicModal
                    title="Delete this user" show={this.state.deleteModalShow}
                    onHide={deleteClose}
                    text={<p>This is going to be forever, are you sure?</p>}
                    actionStyle="danger"
                    action={this.props.hardDeleteHandler}
                    actionText="Delete"
                />

                <BasicModal
                    title="New Item Modal"
                    show={this.state.newItemShow}
                    onHide={newItemClose}
                    body={<h3>New Item Form</h3>}
                    actionStyle="primary"
                    action={this.saluda}
                    actionText="Save New Item"
                />

                <BasicModal
                    title="Recycle Bin"
                    show={this.state.trashShow}
                    onHide={trashClose}
                    body={<h3>Deteled Users</h3>}
                    actionStyle="warning"
                    action={()=>this.setState({ deleteModalShow: true })}
                    actionText="Restore"
                />

            </Col>
        )
    }
}

SearchLayout.PropTypes = {
    rows               : PropTypes.array.isrequired,
    softDeleteHandler  : PropTypes.func.isRequired,
    hardDeleteHandler  : PropTypes.func.isRequired,
    editHandler        : PropTypes.func.isRequired,
    listname           : PropTypes.string.isrequired,
}
