import React, { Component } from 'react';
import PropTypes from 'prop-types';

const IsRole = ({role, children}) => {
    if (Roles.userIsInRole(Meteor.userId(), role)) {
        return children;
    }
    return null;
}

IsRole.propTypes = {
    role: PropTypes.oneOfType([
    PropTypes.string,
    PropTypes.array
]).isRequired,
    children: PropTypes.object,
}

export default IsRole;
