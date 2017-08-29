import React from 'react';
import PropTypes from 'prop-types';
import { ButtonToolbar, ButtonGroup, Button, Row, Col } from 'react-bootstrap';
import { createContainer } from 'meteor/react-meteor-data';
import { Meteor } from 'meteor/meteor';
import { Bert } from 'meteor/themeteorchef:bert';
import RPAS from '../../../api/RPAS/RPAS';
import NotFound from '../NotFound/NotFound';
import Loading from '../../components/Loading/Loading';

const handleRemove = (rpasId, history) => {
  if (confirm('Move to Trash?')) {
    Meteor.call('rpas.softDelete', rpasId, (error) => {
      if (error) {
        Bert.alert(error.reason, 'danger');
      } else {
        Bert.alert('RPAS deleted!', 'warning');
        history.push('/hangar/rpas');
      }
    });
  }
};

const renderRPAS = (rpas, match, history) => (rpas && rpas.deleted === 'no' ? (
  <div className="ViewRPAS">
    <div className="page-header clearfix">
      <h4 className="pull-left">{ rpas && rpas.name }</h4>
      <ButtonToolbar className="pull-right">
        <ButtonGroup bsSize="small">
          <Button onClick={() => history.push(`${match.url}/edit`)}>Edit</Button>
          <Button onClick={() => handleRemove(rpas._id, history)} className="text-danger">
            Delete
          </Button>
        </ButtonGroup>
      </ButtonToolbar>
    </div>
    <Row>
      <Col xs={12} sm={3}>
        { rpas && rpas.description }
      </Col>
      <Col xs={12} sm={9} />
    </Row>

  </div>
) : <NotFound />);

const ViewRPAS = ({ loading, rpas, match, history }) => (
  !loading ? renderRPAS(rpas, match, history) : <Loading />
);

ViewRPAS.propTypes = {
  loading: PropTypes.bool.isRequired,
  rpas: PropTypes.object,
  match: PropTypes.object.isRequired,
  history: PropTypes.object.isRequired,
};

export default createContainer(({ match }) => {
  const rpasId = match.params.rpas_id;
  const subscription = Meteor.subscribe('rpas.view', rpasId);

  return {
    loading: !subscription.ready(),
    rpas: RPAS.findOne(rpasId),
  };
}, ViewRPAS);
