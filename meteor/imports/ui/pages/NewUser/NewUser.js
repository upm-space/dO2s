import React from 'react';
import PropTypes from 'prop-types';
import UserEditor from '../../components/UserEditor/UserEditor';

const NewUser = ({ history }) => (
  <div className="NewUser">
    <h4 className="page-header">New User</h4>
    <UserEditor history={history} />
  </div>
);

NewUser.propTypes = {
  history: PropTypes.object.isRequired,
};

export default NewUser;
