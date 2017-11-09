/* eslint-disable jsx-a11y/no-noninteractive-element-interactions */
import React from 'react';
import PropTypes from 'prop-types';
import { Button, Panel, ListGroup, ListGroupItem } from 'react-bootstrap';

import Loading from '../../components/Loading/Loading';

const renderListItems =
({
  items, checkColumn,
  deleteItem, checkItem, uploadButton, uploadItem, downloadButton, downloadItem,
}) => items.map(item =>
  // item structure
  // item = {
  //   id: an id identifying the item,
  //   name: a name to display for the item,
  //   checked: boolean, is the item checked?
  // }
  (<ListGroupItem key={item.id} >
    {`File ${item.id} : ${item.name}`}
    <span className="pull-right">
      {uploadButton ?
        <Button
          bsStyle="default"
          onClick={() => uploadItem(item.id)}
          bsSize="xsmall"
        >
          <span className="fa fa-upload" aria-hidden="true" />
        </Button> : ''}
      {' '}
      {downloadButton ?
        <Button
          bsStyle="default"
          onClick={() => downloadItem(item.id)}
          bsSize="xsmall"
        >
          <span className="fa fa-download" aria-hidden="true" />
        </Button> : ''}
      {' '}
      {checkColumn ?
        <Button
          bsStyle={item.checked ? 'success' : 'default'}
          onClick={() => checkItem(item.id, item.checked)}
          bsSize="xsmall"
        >
          {item.checked ?
            <span className="fa fa-check-square-o" aria-hidden="true" /> :
            <span className="fa fa-square-o" aria-hidden="true" />}
        </Button>
        : ''}
      {' '}
      <Button
        bsStyle="danger"
        onClick={() => deleteItem(item.id)}
        bsSize="xsmall"
      ><span className="fa fa-times" aria-hidden="true" />
      </Button>
    </span>
  </ListGroupItem>));

const renderListBody = props => (
  <ListGroup fill style={{ height: props.panelHeight, maxHeight: props.panelMaxHeight, overflow: 'auto' }}>
    {renderListItems(props)}
  </ListGroup>
);

const FilePanelComponent = props => (
  <Panel
    defaultExpanded
    header={props.title}
    bsStyle={props.panelStyle}
  >
    {!props.loading ? renderListBody(props) : <Loading />}
  </Panel>
);

FilePanelComponent.defaultProps = {
  hideCompleted: false,
  checkItem: (() => console.log('i dont have a function to complete anything')),
  uploadItem: (() => console.log('I am here for your safety')),
  uploadButton: false,
  panelMaxHeight: '25vh',
  panelHeight: 'auto',
  loading: false,
  panelStyle: 'default',
  checkColumn: false,
  downloadButton: false,
  downloadItem: (() => console.log('I am here for your safety')),
};

FilePanelComponent.propTypes = {
  panelStyle: PropTypes.string,
  panelMaxHeight: PropTypes.string,
  panelHeight: PropTypes.string,
  title: PropTypes.string.isRequired,
  loading: PropTypes.bool,
  checkColumn: PropTypes.bool,
  items: PropTypes.arrayOf(PropTypes.object).isRequired,
  hideCompleted: PropTypes.bool,
  deleteItem: PropTypes.func.isRequired,
  checkItem: PropTypes.func,
  uploadButton: PropTypes.bool,
  downloadButton: PropTypes.bool,
  downloadItem: PropTypes.func,
  uploadItem: PropTypes.func,
};

export default FilePanelComponent;
