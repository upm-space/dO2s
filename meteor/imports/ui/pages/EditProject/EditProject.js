import React from 'react';
import PropTypes from 'prop-types';
import { createContainer } from 'meteor/react-meteor-data';
import { Meteor } from 'meteor/meteor';
import Projects from '../../../api/Projects/Projects';
import ProjectEditor from '../../components/ProjectEditor/ProjectEditor';
import NotFound from '../NotFound/NotFound';

const EditProject = ({ project, history }) => (project ? (
  <div className="EditProject">
    <h4 className="page-header">{`Editing "${project.name}"`}</h4>
    <ProjectEditor project={project} history={history} />
  </div>
) : <NotFound />);

EditProject.defaultProps = {
  project: {},
};

EditProject.propTypes = {
  project: PropTypes.object,
  history: PropTypes.object.isRequired,
};

export default createContainer(({ match }) => {
  const projectId = match.params.project_id;
  const subscription = Meteor.subscribe('projects.view', projectId);

  return {
    loading: !subscription.ready(),
    project: Projects.findOne(projectId),
  };
}, EditProject);
