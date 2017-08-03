import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { Alert } from 'react-bootstrap';
import { Accounts } from 'meteor/accounts-base';
import { Bert } from 'meteor/themeteorchef:bert';

class VerifyEmail extends Component {
  constructor(props) {
    super(props);
    this.state = { error: null };
  }

  componentDidMount() {
    const { match, history } = this.props;
    Accounts.verifyEmail(match.params.token, (error) => {
      if (error) {
        Bert.alert(error.reason, 'danger');
        this.setState({ error: `${error.reason}. Please try again.` });
      } else {
        setTimeout(() => {
          Bert.alert('All set, thanks!', 'success');
          history.push('/projects');
        }, 2000);
      }
    });
  }

  render() {
    return (<div className="VerifyEmail">
      <Alert bsStyle={!this.state.error ? 'info' : 'danger'}>
        {!this.state.error ? 'Verifying...' : this.state.error}
      </Alert>
    </div>);
  }
}

VerifyEmail.PropTypes = {
  match: PropTypes.object.isRequired,
  history: PropTypes.object.isRequired,
};

export default VerifyEmail;
