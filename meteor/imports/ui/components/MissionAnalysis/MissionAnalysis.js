import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { Button, Row, Col, ProgressBar, Panel, ListGroup, ListGroupItem } from 'react-bootstrap';

import WebSocketTelemetry from '../../../modules/flight-telemetry';
import FileTransferUi from '../FileTransfer/FileTransferUi';

class MissionAnalysis extends Component {
  constructor(props) {
    super(props);
    this.state = {
      noData: true,
      connStatus: false,
      logList: [],
    };
    this.renderLogList = this.renderLogList.bind(this);
  }

  componentDidMount() {
    const client = new WebSocketTelemetry();
    this.client = client;

    client.on('connStatus', (msg) => {
      this.setState({ connStatus: msg.status });
    });

    client.on('itemLogList', (msg) => {
      console.log(msg);
      this.setState(prevState => ({
        logList: [...prevState.logList, msg],
      }));
    });


    client.on('noData', (value) => {
      this.setState({ noData: value });
    });
  }

  componentWillUnmount() {
    this.client.closeWebService();
  }

  renderLogList(logList) {
    logList.map(logItem => (
      <ListGroupItem key={logItem._id}>{`Nº ${logItem._id} : ${logItem.MbSize} + Mb`}</ListGroupItem>
    ));
  }

  render() {
    return (
      <div>
        <h5>Request Log Files</h5>
        <Row>
          <Col xs={12} sm={8} md={8} lg={8}>
            <Button
              bsStyle={this.state.connStatus ? 'primary' : 'default'}
              block
              onClick={() => this.client.connectToServer()}
            >
              {this.state.connStatus ? 'Connected' : 'No Conection'}
            </Button>
          </Col>
          <Col xs={12} sm={4} md={4} lg={4}>
            <Button
              bsStyle={this.state.noData ? 'warning' : 'info'}
              block
            >
              {this.state.noData ? 'No Data' : 'Data ON'}
            </Button>
          </Col>
        </Row>
        <br />
        <Row>
          <Col xs={12} sm={8} md={6} lg={4}>
            <Button
              bsStyle="primary"
              block
              onClick={() => this.client.requestLogList()}
            >
              Request Log List
            </Button>
            <Panel defaultExpanded header="Log List">
              <ListGroup fill>
                <ListGroupItem>Test log 1</ListGroupItem>
                <ListGroupItem>Test log 2</ListGroupItem>
                {this.renderLogList(this.state.logList)}
              </ListGroup>
            </Panel>
          </Col>
        </Row>

        {/* <FileTransferUi /> */}
      </div>
    );
  }
}


MissionAnalysis.propTypes = {
  mission: PropTypes.object.isRequired,
};


export default MissionAnalysis;
