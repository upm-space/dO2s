import { Redirect } from 'react-router-dom';
import { Meteor } from 'meteor/meteor';
import { Bert } from 'meteor/themeteorchef:bert';

const login = (service) => {
    const options = { requestPermissions: [ 'email' ] };

    if ( service === 'loginWithGoogle' ) {
        options.requestPermissions.push( 'profile' )
    }

    Meteor[ service ](options, (error) => {
        if (error) {
            Bert.alert(error.reason, 'warning');
        } else {
            Bert.alert('Logged in!', 'success');
        }
      });
};

export default function handleExternalLogin(service) {
    login(service);
}
