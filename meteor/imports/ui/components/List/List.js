/* eslint-disable jsx-a11y/no-noninteractive-element-interactions */
import React from 'react';
import PropTypes from 'prop-types';
import { Button } from 'react-bootstrap';
import { timeago, monthDayYearAtTime } from '@cleverbeagle/dates';
import classnames from 'classnames';

import Loading from '../../components/Loading/Loading';

const renderListItems =
({
  history, match, items, hideCompleted, completedColumn,
  softDeleteItem, completeItem, exportButton, exportItem,
}) => {
  let filteredItems = items;
  if (completedColumn && hideCompleted) {
    filteredItems = filteredItems.filter(item => !item.done);
  }
  return filteredItems.map((item) => {
    const goToItem = () => history.push(`${match.url}/${item._id}`);
    const itemClassName = (completedColumn ? classnames({ info: item.done }) : '');
    return (
      <tr
        className={itemClassName}
        key={item._id}
      >
        <td onClick={goToItem}>{item.name}</td>
        <td onClick={goToItem} className="hidden-xs">
          {timeago(item.updatedAt)}
        </td>
        <td onClick={goToItem} className="hidden-xs">
          {monthDayYearAtTime(item.createdAt)}
        </td>
        {exportButton ? (
          <td className="button-column">
            <Button
              bsStyle="default"
              onClick={() => exportItem(item._id)}
            >
              <span className="fa fa-download fa-lg" aria-hidden="true" />
            </Button>
          </td>) : null}
        {completedColumn ? (
          <td className="button-column">
            <Button
              bsStyle={item.done ? 'success' : 'default'}
              onClick={() => completeItem(item._id, item.done)}
            >
              {item.done ?
                <i className="fa fa-check-square-o" aria-hidden="true" /> :
                <i className="fa fa-square-o" aria-hidden="true" />}
            </Button>
          </td>) : null}
        <td className="button-column">
          <Button
            bsStyle="danger"
            onClick={() => softDeleteItem(item._id)}
          ><i className="fa fa-times" aria-hidden="true" />
          </Button>
        </td>
      </tr>);
  });
};

const renderListBody = props => (
  <tbody>
    {renderListItems(props)}
  </tbody>);

const List = props => (
  !props.loading ? renderListBody(props) : <Loading />
);

List.defaultProps = {
  hideCompleted: false,
  completeItem: (() => console.log('i dont have a function to complete anything')),
  exportItem: (() => console.log('I am here for your safety')),
  exportButton: false,
};

List.propTypes = {
  loading: PropTypes.bool.isRequired,
  completedColumn: PropTypes.bool.isRequired,
  items: PropTypes.arrayOf(PropTypes.object).isRequired,
  match: PropTypes.object.isRequired,
  history: PropTypes.object.isRequired,
  hideCompleted: PropTypes.bool,
  softDeleteItem: PropTypes.func.isRequired,
  completeItem: PropTypes.func,
  exportButton: PropTypes.bool,
  exportItem: PropTypes.func,
};

export default List;
