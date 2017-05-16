import React from 'react';
import PropTypes from 'prop-types';
import { ButtonBasic } from './button-basic';

export  class ItemBasic extends React.Component{
    // ver este link https://facebook.github.io/react/docs/thinking-in-react.html
    constructor(props){
        super(props);

    }
    render(){
        return(
            <div className="row precise-width search-item-list">

                <div className="col-md-10 col-lg-10 col-sm-10 col-xs-10">
                    <ButtonBasic title={this.props.name} onCLick={()=>this.props.editHandler(this.props.guid)} isButtonList={true}/>
                </div>

                <div className="col-md-2 col-lg-2 col-sm-2 col-xs-2">
                    <ButtonBasic title="" onCLick={()=>this.props.deleteHandler(this.props.guid)} glyphicon="glyphicon glyphicon-trash" isButtonList={true}/>
                </div>

            </div>
        )
    }
}

ItemBasic.PropTypes = {
    name           : PropTypes.string.isRequired,
    key            : PropTypes.string.isRequired,
    guid           : PropTypes.string.isRequired,
    deleteHandler  : PropTypes.func.isRequired,
    editHandler    : PropTypes.func.isRequired
}
