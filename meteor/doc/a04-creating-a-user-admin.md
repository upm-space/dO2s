# Managing Users with React
-   [Managing Users With React - The Meteor Chef](https://themeteorchef.com/tutorials/managing-users-with-react)

## 1. User Creation

We manage creating our user with the following packages:

-   `okgrow:accounts-ui-react`

    Package that wraps the user creation in Blaze templates on React components.

    FIXME - find a package that manages user creation on React without Blaze. Our roll our own.

-   Meteor packages that manage user creation.
    -   `accounts-password`
    -   `accounts-facebook`
    -   `facebook-config-ui`
    -   `accounts-google`
    -   `google-config-ui`
-   TODO - Dig into this.

##2. Accessing the `Meteor.users` collection
-   [Users and Accounts - Meteor](https://guide.meteor.com/accounts.html)

The Meteor [`accounts-base`](http://docs.meteor.com/api/accounts.html) package crates a collection with a Simple Schema to manage this users. (Dig into this, how can I change this Schema).

First we are going to change how the code loads on the server. To start we are going to create an entry point, an `index.js` file on `/imports/startup/server` and we are going to import this on our `/server/main.js` to have only this line of code.

```javascript
import '../imports/startup/server';
```

Now on our `/imports/startup/server/index.js` we are going to import all our server run code like this:

```javascript
import './api';
import './roles';
```

The `roles.js` file has code to run, whereas the `api.js` file has all the server side code from our `api` folder, like this:

```javascript
import '../../api/users/server/methods.js';
import '../../api/users/server/publications.js';
```

Now that we are properly loading our server side code, let's see how to publish the users collection to access it on our user admin.

We create the file `/imports/api/users/server/publications.js`. Here we are publishing our users and roles collections, take care not to publish unnecessary data from the users collection, as of now we only want the emails, roles and profile fields.

```javascript
Meteor.publish('users', () => ([
  Meteor.users.find({}, { fields: { emails: 1, roles: 1, profile: 1 } }),
  Roles.getAllRoles(),
]));

Meteor.publish('users.roles', () => Roles.getAllRoles());

Meteor.publish('currentUser', function() {
    return Meteor.users.find({_id: this.userId}, {
        fields: {
            roles: 1,
        }
    });
});
```

## 3. Subscribing to the users collection

Now this data is published but it wont appear on our client side unless we subscribe to it. We want to subscribe to it on our users page with a `createContainer` component from `react-meteor-data` to wrap our component. As you can see we use the `.fetch()` method to get an array instead of a MongoDB cursor. We also want information of our current user and we pass all this data as `props` to our Users component. We also want to define our `PropTypes`


```javascript
Users.propTypes = {
  users: PropTypes.array,
  currentUser: PropTypes.object,
  applicationRoles: PropTypes.array,
};


export default createContainer(({props}) => {
    let usersSub = Meteor.subscribe('users');
    const usersArray = Meteor.users.find().fetch();
    // const isReady = usersSub.ready() && Roles.usersSub.ready();
    const currentUser = Meteor.user();
    const applicationRoles = Roles.getAllRoles().fetch();

    return {
        // ready: isReady,
        users: usersArray,
        currentUser: currentUser,
        applicationRoles: applicationRoles,
    }
}, Users);
```

## 3. User Collection Methods

As os right now we only have one method defined to change the users role, it doesn't work properly but we are getting there. This method checks that the user calling is an admin and then goes on to change the roles accordingly.

```javascript
Meteor.methods({
  'users.changeRole': function usersChangeRole(update) {
    check(update, { _id: String, role: String, hasRole: Boolean });

    if (Roles.userIsInRole(this.userId, ['admin'])) {
        if (update.hasRole === "on"){
            Roles.addUsersToRoles(update._id, update.role);
        } else {
            Roles.removeUsersFromRoles(update._id, update.role);
        }

    } else {
      throw new Meteor.Error('500', 'Ha! Nice try, slick.');
    }
  },
});

```

## 4. Creating the Users Page

Now we'll see how to create the Users page. Right now we are using the `react-bootstrap` package but that is going to change. This is the whole component, lets go bit by bit.

```javascript
class Users extends Component {
    constructor(props) {
        super(props);
        this.authorizeAccess = this.authorizeAccess.bind(this);
        this.handleChangeRole = this.handleChangeRole.bind(this);
    }

    checkIfCurrentUser(mappedUserId, currentUserId) {
        return mappedUserId === currentUserId;
    }

    handleChangeRole(_id, role, hasRole) {
        Meteor.call('users.changeRole', { _id, role, hasRole }, (error) => {
            if (error) {
                    <Alert bsStyle="danger">
                    <strong>Holy guacamole!</strong>
                    </Alert>
                // Bert.alert(error.reason, 'danger');
            } else {
                <Alert bsStyle="success">
                <strong>Holy guacamole!</strong> Role Updated
                </Alert>
                // Bert.alert('Role updated!', 'success');
            }
        });
    }

    authorizeAccess() {
        if (!Roles.userIsInRole(this.props.currentUser, ['admin'])) {
          <Redirect to="/"/>
        }
    }

    componentDidUpdate() {
        this.authorizeAccess();
    }

    componentWillMount() {
        this.authorizeAccess();
    }

    render() {
        let count = 0;
        const { users, currentUser, applicationRoles } = this.props;
        return (<div className="users">
            <PageHeader>Users</PageHeader>
            <Table bordered responsive>
                <thead>
                    <tr>
                        <th>#</th>
                        <th>Email Address</th>
                        <th>Verified</th>
                        <th>Roles</th>
                    </tr>
                </thead>
                <tbody>
                    {users.map(({ _id, emails, roles, profile }) => {
                    const isCurrentUser = this.checkIfCurrentUser(_id, currentUser._id);
                    return (<tr key={_id}>
                        <td className="vertical-align" width="5%">
                            {++count}
                        </td>
                        <td className="vertical-align" width="40%">
                            {isCurrentUser ? <Label bsStyle="success">You!</Label> : ''}
                            {emails ? emails[0].address : profile.name}
                        </td>
                        <td className="vertical-align" width="10%">
                            {emails ? (emails[0].verified ? "Yes" : "No") : "Other Login"}
                        </td>
                        <td className="vertical-align" width="45%">
                            <FormGroup controlId="roles">
                            {applicationRoles.map((role) => {
                                return(
                                    <Checkbox
                                        key={role._id}
                                        name={role.name}
                                        disabled={isCurrentUser}
                                        checked={Roles.userIsInRole(_id, role.name)}
                                        inline
                                        onChange={(event) => { this.handleChangeRole(_id, event.target.name, !event.target.value); }}>
                                        {role.name}
                                    </Checkbox>
                                );
                            })}
                            </FormGroup>
                        </td>
                    </tr>);
                    })}
                </tbody>
            </Table>
        </div>
        );
    }
};
```

### Component functions

This are the functions defined for our component

#### checkIfCurrentUser
This check if the current user you are parsing from the array is the current user logged in.

#### handleChangeRole
This function calls the method `users.changeRole` to change the user's roles. It's called on a triggered even from the form. Also throws alerts when an error occurred of if the method call went smoothly.

[Alert Handling in Meteor with Bert](https://github.com/themeteorchef/bert)

#### authorizeAccess
This function is called when the component mounts and updates to redirect the user to a page if he doesn't have authorization to access the user admin.

#### componentDidUpdate, componentWillMount
This functions run `authorizeAccess`.

### The render function

The render functions outputs a table that maps each user to a row to output the desired info, as of right now the only change option lies on the roles, which can be changed for all the users except the current logged in user.
