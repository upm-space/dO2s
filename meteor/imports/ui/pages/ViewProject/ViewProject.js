import React from 'react';
import PropTypes from 'prop-types';
import { ButtonToolbar, ButtonGroup, Button, Row, Col } from 'react-bootstrap';
import { createContainer } from 'meteor/react-meteor-data';
import { Meteor } from 'meteor/meteor';
import { Bert } from 'meteor/themeteorchef:bert';
import Projects from '../../../api/Projects/Projects';
import NotFound from '../NotFound/NotFound';
import Loading from '../../components/Loading/Loading';
import MapComponent from '../../components/MapComponent/MapComponent';
import Missions from '../../components/Missions/Missions';

const handleRemove = (projectId, history) => {
  if (confirm('Move to Trash?')) {
    Meteor.call('projects.softDelete', projectId, (error) => {
      if (error) {
        Bert.alert(error.reason, 'danger');
      } else {
        Bert.alert('Project deleted!', 'warning');
        history.push('/projects');
      }
    });
  }
};

const renderProject = (project, match, history) => (project && project.deleted === 'no' ? (
  <div className="ViewProject">
    <div className="page-header clearfix">
      <h4 className="pull-left">{ project && project.name }</h4>
      <ButtonToolbar className="pull-right">
        <ButtonGroup bsSize="small">
          <Button onClick={() => history.push(`${match.url}/edit`)}>Edit</Button>
          <Button onClick={() => handleRemove(project._id, history)} className="text-danger">
            Delete
          </Button>
        </ButtonGroup>
      </ButtonToolbar>
    </div>
    <Row>
      <Col xs={12} sm={3}>
        { project && project.description }
      </Col>
      <Col xs={12} sm={9}>
        <MapComponent
          location={project && project.mapLocation}
          height="200px"
          onLocationChange={() => {}}
        />
      </Col>
    </Row>
    <Row>
      <Col xs={12} sm={12} md={12} lg={12}>
        <Missions projectId={project._id} match={match} history={history} />
      </Col>
    </Row>


  </div>
) : <NotFound />);

const ViewProject = ({ loading, project, match, history }) => (
  !loading ? renderProject(project, match, history) : <Loading />
);

ViewProject.propTypes = {
  loading: PropTypes.bool.isRequired,
  project: PropTypes.object,
  match: PropTypes.object.isRequired,
  history: PropTypes.object.isRequired,
};

export default createContainer(({ match }) => {
  const projectId = match.params.project_id;
  const subscription = Meteor.subscribe('projects.view', projectId);

  return {
    loading: !subscription.ready(),
    project: Projects.findOne(projectId),
  };
}, ViewProject);
