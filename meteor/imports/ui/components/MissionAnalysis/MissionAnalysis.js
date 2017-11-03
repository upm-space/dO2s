import React, { Component } from 'react';
import PropTypes from 'prop-types';
import FileTransferUi from '../FileTransfer/FileTransferUi';

class MissionAnalysis extends Component {
  render() {
    return (
      <div>
        <h1>MissionAnalysis</h1>
        {/* <p>{JSON.stringify(mission)}</p> */}
        <div><FileTransferUi /> </div>
      </div>
    );
  }
}


MissionAnalysis.propTypes = {
  mission: PropTypes.object.isRequired,
};


export default MissionAnalysis;
