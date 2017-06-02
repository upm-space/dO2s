import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { Redirect } from 'react-router-dom';
import { Accounts } from 'meteor/accounts-base';

export default class VerifyEmail extends Component{
    componentDidMount(){
        Accounts.verifyEmail( this.props.match.params.token, ( error ) =>{
            if ( error ) {
                Bert.alert( error.reason, 'danger' );
                this.props.history.push('/');
            } else {
                Bert.alert( 'Email verified! Thanks!', 'success' );
                this.props.history.push('/one');
            }
        });
    }
    render() {
        return (<div></div>);
    }
}

VerifyEmail.PropTypes = {
  match: PropTypes.object,
};
