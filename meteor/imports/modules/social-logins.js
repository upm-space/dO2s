import { Redirect } from 'react-router-dom';
import { Meteor } from 'meteor/meteor';
import { Bert } from 'meteor/themeteorchef:bert';

const login = (service) => {
    const options = { requestPermissions: [ 'email' ] };

    
    if ( service === 'loginWithTwitter' ) {
      delete options.requestPermissions;
    }

    Meteor[ service ](options, (error) => {
        if (error) {
            Bert.alert(error.reason, 'warning');
        } else {
            Bert.alert('Logged in!', 'success');

            // const { location } = component.props;
            // if (location.state && location.state.nextPathname) {
            //     history.push(location.state.nextPathname)
            // } else {
            //     history.push('/')
            // }
        }
      });
};

export default function handleExternalLogin(service) {
    login(service);
}
