import React from 'react';
import { NavLink } from 'react-router-dom';
import { LoginButtons } from 'meteor/okgrow:accounts-ui-react';

const Navigation = () => (
    <nav className="navbar navbar-ipsilum">
        <div className="container-fluid">
            <div className="navbar-header">
                <button type="button" className="navbar-toggle" data-toggle="collapse" data-target="#myNavbar">
                    <span className="icon-bar"></span>
                    <span className="icon-bar"></span>
                    <span className="icon-bar"></span>
                </button>
            </div>
            <div className="collapse navbar-collapse" id="myNavbar">
                <ul className="nav navbar-nav">
                    <li><NavLink to="/" activeClassName="active"><span className="glyphicon glyphicon-home"></span> <b>HOME</b></NavLink></li>
                    <li><NavLink to="/usrmng" activeClassName="active"><span className="glyphicon glyphicon-user"></span> <b>USER MNG</b></NavLink></li>
                    <li><LoginButtons /></li>
                </ul>
                <ul className="nav navbar-nav navbar-right">

                    <div className="centerBlock">
                        <li><img className="img-responsive logo" src="/img/svg/ipsilum-light.svg" /></li>
                    </div>
                </ul>
            </div>
        </div>
    </nav>

);

export default Navigation;
