import React from 'react';
import { NavLink } from 'react-router-dom';
/*
export const Navigation = () => (
    <nav className="navbar navbar-ipsilum">
        <ul className="nav navbar-nav">
            <li><IndexLink to="/" activeClassName="active">Index</IndexLink></li>
            <li><IndexLink to="/urrmng" activeClassName="active">User Management</IndexLink></li>
            <li><Link to="/one" activeClassName="active">Page One</Link></li>
            <li><Link to="/two" activeClassName="active">Page Two</Link></li>
        </ul>
    </nav>
)
    */

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
