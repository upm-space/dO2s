import React from 'react';
import PropTypes from 'prop-types';
import { ButtonToolbar, ButtonGroup, Button, Row, Col } from 'react-bootstrap';
import { createContainer } from 'meteor/react-meteor-data';
import { Meteor } from 'meteor/meteor';
import { Bert } from 'meteor/themeteorchef:bert';
import RPAs from '../../../api/RPAs/RPAs';
import NotFound from '../NotFound/NotFound';
import Loading from '../../components/Loading/Loading';

const handleRemove = (rpaId, history) => {
  if (confirm('Move to Trash?')) {
    Meteor.call('rpas.softDelete', rpaId, (error) => {
      if (error) {
        Bert.alert(error.reason, 'danger');
      } else {
        Bert.alert('RPA deleted!', 'warning');
        history.push('/hangar/rpas');
      }
    });
  }
};

const renderRPA = (rpa, match, history) => (rpa && rpa.deleted === 'no' ? (
  <div className="ViewRPA">
    <div className="page-header clearfix">
      <h4 className="pull-left">{ rpa && rpa.name }</h4>
      <ButtonToolbar className="pull-right">
        <ButtonGroup bsSize="small">
          <Button onClick={() => history.push(`${match.url}/edit`)}>Edit</Button>
          <Button onClick={() => handleRemove(rpa._id, history)} className="text-danger">
            Delete
          </Button>
        </ButtonGroup>
      </ButtonToolbar>
    </div>
    <Row>
      <Col xs={12} sm={3}>
        { rpa && rpa.description }
      </Col>
      <Col xs={12} sm={9} />
    </Row>

  </div>
) : <NotFound />);

const ViewRPA = ({ loading, rpa, match, history }) => (
  !loading ? renderRPA(rpa, match, history) : <Loading />
);

ViewRPA.propTypes = {
  loading: PropTypes.bool.isRequired,
  rpa: PropTypes.object,
  match: PropTypes.object.isRequired,
  history: PropTypes.object.isRequired,
};

export default createContainer(({ match }) => {
  const rpaId = match.params.rpa_id;
  const subscription = Meteor.subscribe('rpas.view', rpaId);

  return {
    loading: !subscription.ready(),
    rpa: RPAs.findOne(rpaId),
  };
}, ViewRPA);
