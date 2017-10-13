import React from 'react';
import PropTypes from 'prop-types';

const Icon = ({ icon }) => (<span className={`fa fa-${icon}`} aria-hidden="true" />);

Icon.propTypes = {
  icon: PropTypes.string.isRequired,
};

export default Icon;
