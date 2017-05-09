import React,{PropTypes} from 'react';

export  class ButtonBasic extends React.Component{
    constructor(props){
        super(props);

    }

    render(){
        let buttonClass =  "btn btn-block button-basic";
        if (this.props.isButtonList){
            buttonClass = "list-button";
        }
        let spanObj = "";
        if(this.props.glyphicon){
            spanObj = <span className={this.props.glyphicon}></span>
        }
        let title = this.props.title;
        if(this.props.isBlack){
            title = <b>{this.props.title}</b>;
        }
        return(
            <button className={buttonClass} onClick={()=>this.props.onCLick()}>
                {spanObj} {title}
            </button>
        )
    }
}

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