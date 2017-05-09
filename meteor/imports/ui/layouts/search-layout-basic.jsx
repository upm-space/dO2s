import React,{PropTypes} from 'react';
import {ButtonBasic} from './../components/button-basic.jsx';
import {ItemBasic} from './../components/item-basic.jsx';
export  class SearchLayout extends React.Component{
    constructor(props){
        super(props);
    }
    saluda(){
        console.log("Saluda");
    }
    renderItems(){
        if(this.props.rows.length>0) {
            let objetos = this.props.rows.map((row)=>(
                <ItemBasic name={row.name} key={row.key} guid={row.key} deleteHandler={this.props.deleteHandler}
                           editHandler={this.props.editHandler}/>
            ))
            return (
                <ul id="project-list" className="scroll">
                    {objetos}
                </ul>
            )
        }
    }
    render(){
        return(
            <div className="row precise-width">

                    <div className="row precise-width data-input">
                        <ButtonBasic title="Add User" onCLick={this.saluda} glyphicon="glyphicon glyphicon-plus"/>
                    </div>
                    <div className="row precise-width" >
                        <div className="col-md-10 col-lg-10 col-sm-8 col-xs-10">
                            <b>Project List ({this.props.nonDeletedCount})</b>
                        </div>
                        {/*
                        <div className="col-md-2 col-lg-2 col-sm-2 col-xs-2">
                            <div className="centerBlock">
                                <b>Done</b>
                            </div>
                        </div>
                        */}
                        <div className="col-md-2  col-lg-2 col-sm-2 col-xs-2">
                            <div className="centerBlock">
                                <ButtonBasic title="Delete" onCLick={this.saluda} isButtonList={true} isBlack={true} />
                            </div>
                        </div>
                    </div>
                    {this.renderItems()}


            </div>
        )
    }
}

SearchLayout.PropTypes = {
    rows            : PropTypes.array.isrequired,
    deleteHandler  : PropTypes.func.isRequired,
    editHandler    : PropTypes.func.isRequired
}