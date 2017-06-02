const getUserEmail = ( user ) => {
    let emails   = user.emails,
    services = user.services;
    return _getEmailFromService( services );
};

const _getEmailFromService = ( services ) => {
    for ( let service in services ) {
        let current = services[ service ];
        return current.email;
    }
};

export default function getEmail(user) { return getUserEmail(user); };
