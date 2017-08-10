import React from 'react';
import PropTypes from 'prop-types';
import ProjectEditor from '../../components/ProjectEditor/ProjectEditor';

const NewProject = ({ history }) => (
  <div className="NewProject">
    <h4 className="page-header">New Project</h4>
    <ProjectEditor history={history} />
  </div>
);

NewProject.propTypes = {
  history: PropTypes.object.isRequired,
};

export default NewProject;
