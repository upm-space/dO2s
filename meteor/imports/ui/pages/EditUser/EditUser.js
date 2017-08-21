import React from 'react';
import PropTypes from 'prop-types';
import { createContainer } from 'meteor/react-meteor-data';
import { Meteor } from 'meteor/meteor';
import UserEditor from '../../components/UserEditor/UserEditor';
import NotFound from '../NotFound/NotFound';

const getUserName = name => ({
  string: name,
  object: `${name.first} ${name.last}`,
}[typeof name]);

const EditUser = ({ user, history }) => (user ? (
  <div className="EditUser">
    <h4 className="page-header">{`Editing "${getUserName(user.profile.name)}"`}</h4>
    <UserEditor user={user} history={history} />
  </div>
) : <NotFound />);

EditUser.defaultProps = {
  user: {},
};

EditUser.propTypes = {
  user: PropTypes.object,
  history: PropTypes.object.isRequired,
};

export default createContainer(({ match }) => {
  const userId = match.params.user_id;
  const userSub = Meteor.subscribe('users.view', userId);

  return {
    loading: !userSub.ready(),
    user: Meteor.users.findOne(userId),
  };
}, EditUser);
