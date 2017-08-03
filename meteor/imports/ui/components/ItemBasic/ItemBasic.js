import React from 'react';
import PropTypes from 'prop-types';
import { Button, Glyphicon } from 'react-bootstrap';

const ItemBasic = props => (
  <div className={props.isDisabled ? 'list-group-item disabled' : 'list-group-item'} >
    <Button
      bsStyle="link"
      onClick={() => props.editHandler(props.guid)}
      disabled={props.isDisabled}
    >
      {props.name}
    </Button>
    <span className="pull-right">
      <Button
        bsStyle="link"
        onClick={() => props.deleteHandler(props.guid)}
        disabled={props.isDisabled}
      >
        <Glyphicon glyph="trash" />
      </Button>
    </span>
  </div>
);


ItemBasic.propTypes = {
  name: PropTypes.string.isRequired,
  // key: PropTypes.string.isRequired,
  guid: PropTypes.string.isRequired,
  deleteHandler: PropTypes.func.isRequired,
  editHandler: PropTypes.func.isRequired,
  isDisabled: PropTypes.bool,
};

ItemBasic.defaultProps = {
  isDisabled: false,
};

export default ItemBasic;
