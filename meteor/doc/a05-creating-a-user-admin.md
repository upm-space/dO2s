# Managing Users with React
-   [Managing Users With React - The Meteor Chef]

## 1. User Creation

We manage creating our user with the following packages:

-   See Rolling Your Own Authentication from docs.

-   Meteor packages that manage user creation.
    -   `accounts-password`
    -   `accounts-facebook`
    -   `accounts-google`

##2. Accessing the `Meteor.users` collection
-   [Users and Accounts - Meteor](https://guide.meteor.com/accounts.html)

The Meteor [`accounts-base`][`accounts-base` Package] package crates a collection with a Simple Schema to manage this users. See rolling your own authentication to see how to add a Schema to this collection.

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

We create the file `/imports/api/users/server/publications.js`. Here we are publishing our users and roles collections, take care not to publish unnecessary data from the users collection, as of now we only want the emails, roles and profile fields. We also added a layer of security so that only an admin can subscribe to this published data.

```javascript
Meteor.publish('users', function users() {
    if (Roles.userIsInRole(this.userId, ['admin'])) {
        return [
            Meteor.users.find({}, { fields: { emails: 1, roles: 1, profile: 1 } }),
            Roles.getAllRoles(),
        ];
    }
    return this.ready();
});

Meteor.publish('users.roles', () => Roles.getAllRoles());
```

## 3. Subscribing to the users collection

Now this data is published but it wont appear on our client side unless we subscribe to it. We want to subscribe to it on our users page with a `createContainer` component from `react-meteor-data` to wrap our component. As you can see we use the `.fetch()` method to get an array instead of a MongoDB cursor. We also want information of our current user and we pass all this data as `props` to our `UserManagementLayout` component. We also want to define our `PropTypes` for this.


```javascript
UserManagementLayout.PropTypes = {
    users: PropTypes.array,
    currentUser: PropTypes.object,
    applicationRoles: PropTypes.array
}


export default createContainer(() => {
    let usersSub = Meteor.subscribe('users');
    const usersArray = Meteor.users.find().fetch();
    const currentUser = Meteor.user();
    const applicationRoles = Roles.getAllRoles().fetch();

    return {
        users: usersArray,
        currentUser: currentUser,
        applicationRoles: applicationRoles,
    }
}, UserManagementLayout);
```

## 3. User Collection Methods

As of right now we only have one method defined to change the users role, it doesn't work properly but we are getting there. This method checks that the user calling is an admin and then goes on to change the roles accordingly.

We'll also need methods to create new users and to soft delete and hard delete users for the moment.

```javascript
Meteor.methods({
  'users.changeRole': function usersChangeRole(update) {
    check(update, { _id: String, role: String });

    if (Roles.userIsInRole(this.userId, ['admin'])) {
      Roles.setUserRoles(update._id, update.role);
    } else {
      throw new Meteor.Error('500', 'Ha! Nice try, slick.');
    }
  },
});
```

## 4. Creating the Users Management Layout

Now we'll see how to create the Users Management Layout. This is the whole component, lets go bit by bit. We are going to use `react-bootstrap` and we are going to use reusable React components for this layout, so that we can user them on other parts of the app.

```javascript
class UserManagementLayout extends Component {
    constructor(props) {
        super(props);
        this.authorizeAccess = this.authorizeAccess.bind(this);
        this.handleChangeRole = this.handleChangeRole.bind(this);
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

    checkIfCurrentUser(mappedUserId, currentUserId) {
        return mappedUserId === currentUserId;
    }

    handleChangeRole(_id, role) {
        Meteor.call('users.changeRole', { _id, role }, (error) => {
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

    editUser(id){
        console.log("Editing user "+ id);
    }

    softDeleteUser(id){
        console.log("Soft Deleting user "+ id);
    }

    hardDeleteUser(id){
        console.log("Hard Deleting user "+ id);
    }

    render() {
        let count = 0;
        const { users, currentUser, applicationRoles } = this.props;
        var rows = [];
        users.map( ({ _id, emails, profile }) => {
            const username = (emails ? emails[0].address : profile.name)
            return(
                rows.push({name:username, key:_id})
            )
        })
        return(
            <div className="appUserManagement">
                <Row>
                    <Col md={12} lg={12} sm={12} xs={12} xsHidden>
                        <PageHeader>User Management</PageHeader>
                    </Col>
                </Row>
                <Row>
                    <SearchLayout rows={rows} listname="User" softDeleteHandler={this.softDeleteUser}
                    hardDeleteHandler={this.hardDeleteUser} editHandler={this.editUser}/>
                    <Col md={9} lg={9} sm={12} xs={12}>
                        {this.props.children}
                    </Col>
                </Row>
            </div>
        )
    }
};
```

### Component functions

This are the functions defined for our component

#### checkIfCurrentUser
This check if the current user you are parsing from the array is the current user logged in.

#### handleChangeRole
This function calls the method `users.changeRole` to change the user's roles. It's called on a triggered even from the form. Also throws alerts when an error occurred of if the method call went smoothly.

[Alert Handling in Meteor with Bert]

#### authorizeAccess
This function is called when the component mounts and updates to redirect the user to a page if he doesn't have authorization to access the user admin.

#### componentDidUpdate, componentWillMount
This functions run `authorizeAccess`.

#### editUser, softDeleteUser and hardDeleteUser
These functions handle user logic, they will call methods that update the collection with the respective action like the `handleChangeRole` funtion.

### The render function

The render function outputs the main layout for this component. As of right now, the page would be split in thirds, 1/3 for the user list which we will render with a generic component to render the lists in our app, the `<SearchLayout>` and the other 2/3 to the space where we will load our user component. Which is black at the moment.

## The `SearchLayout` Component.

This component is going to handle the logic for generating the user list, this list can be any other thing. As you saw in UserManagementLayout, we created a `row` array which we populated with the users, then we pass this prop to SearchLayout.

This would be the `row`.

```javascript
const { users, currentUser, applicationRoles } = this.props;
var rows = [];
users.map( ({ _id, emails, profile }) => {
    const username = (emails ? emails[0].address : profile.name)
    return(
        rows.push({name:username, key:_id})
    )
})
```

Then we call SearchLayout like this:

```javascript
<SearchLayout rows={rows} listname="User" softDeleteHandler={this.softDeleteUser}
hardDeleteHandler={this.hardDeleteUser} editHandler={this.editUser}/>
```

In the SearchLayout component we'll also handle deleting and editing a list item as well as the Recycle Bin. But we will pass the functions that handle this logic from the parent component. So here we will have a barebones list to be reused elsewhere.

Our List of going to be a Bootstrap Panel populated with a List Group. The items inside this list come from another generic component to handle a single item from the list, this would be our `<ItemBasic/>` component.

Here we will also load the modals to handle the Recycle bin and deleting and adding a new item. We will also use a generic modal defined in our `<BasicModal/>` component.

```javascript
export default class SearchLayout extends Component{
    constructor() {
        super();
        this.state = {
            deleteModalShow: false,
            newItemShow: false,
            trashShow: false
        }
    }

    getInitialState() {
      return {
          deleteModalShow: false,
          newItemShow: false,
          trashShow: false
       }
    }

    saluda(){
        console.log("Saluda");
    }

    renderItems(){
        if(this.props.rows.length > 0) {
            let objetos = this.props.rows.map((row)=>(
                <ItemBasic
                name={row.name}
                key={row.key}
                guid={row.key}
                deleteHandler={this.props.softDeleteHandler}
                editHandler={this.props.editHandler}/>
            ));
            return (
                objetos
            );
        }
    }

    render(){
        const newitem = " Add " + this.props.listname;
        const panelheader = this.props.listname + " List";
        let deleteClose = () => this.setState( {deleteModalShow: false} );
        let newItemClose = () => this.setState( {newItemShow: false} );
        let trashClose = () => this.setState( {trashShow: false} );
        const paneltitle = (
            <span className="clearfix">
                <h3 className="pull-left">{panelheader}</h3>
                <span className="pull-right" style={{paddingTop: "1.2em"}}>
                <Button bsStyle="link" onClick={()=>this.setState({ trashShow: true })}>
                <b>Delete</b>
                </Button>
                </span>
            </span>);

        return(
            <Col md={3} lg={3} sm={12} xs={12}>
                <Row>
                    <Col md={12} lg={12} sm={12} xs={12}>
                        <Button bsStyle="primary" onClick={()=>this.setState({ newItemShow: true })} block>
                            <Glyphicon glyph="plus"></Glyphicon>{newitem}
                        </Button>
                    </Col>
                </Row>
                <Row>
                    <Col md={12} lg={12} sm={12} xs={12}>
                        <Panel collapsible={false} header={paneltitle}>
                            <ListGroup fill componentClass="div">
                                {this.renderItems()}
                            </ListGroup>
                        </Panel>
                    </Col>
                </Row>

                <BasicModal
                    title="Delete this user" show={this.state.deleteModalShow}
                    onHide={deleteClose}
                    text={<p>This is going to be forever, are you sure?</p>}
                    actionStyle="danger"
                    action={this.props.hardDeleteHandler}
                    actionText="Delete"
                />

                <BasicModal
                    title="New Item Modal"
                    show={this.state.newItemShow}
                    onHide={newItemClose}
                    body={<h3>New Item Form</h3>}
                    actionStyle="primary"
                    action={this.saluda}
                    actionText="Save New Item"
                />

                <BasicModal
                    title="Recycle Bin"
                    show={this.state.trashShow}
                    onHide={trashClose}
                    body={<h3>Deteled Users</h3>}
                    actionStyle="warning"
                    action={()=>this.setState({ deleteModalShow: true })}
                    actionText="Restore"
                />

            </Col>
        )
    }
}

SearchLayout.PropTypes = {
    rows               : PropTypes.array.isrequired,
    softDeleteHandler  : PropTypes.func.isRequired,
    hardDeleteHandler  : PropTypes.func.isRequired,
    editHandler        : PropTypes.func.isRequired,
    listname           : PropTypes.string.isrequired,
}

```

## The `ItemBasic` component

This component is used to load items from the list. We use a `div` with the  `list-group-item` class. We have the item being a button that when it's clicked you edit the item and another button to handle deleting the item. Also the necessary variables to make this component as generic as possible.

```javascript
const ItemBasic = ( props ) => (
    <div className={props.isDisabled ? "list-group-item disabled" : "list-group-item"} >
        <Button bsStyle="link" onClick={()=>props.editHandler(props.guid)} disabled={props.isDisabled}>{props.name}</Button>
        <span className="pull-right">
            <Button bsStyle="link" onClick={()=>props.deleteHandler(props.guid)} disabled={props.isDisabled}>
            <Glyphicon glyph="trash"/></Button>
        </span>
    </div>
);


ItemBasic.PropTypes = {
    name           : PropTypes.string.isRequired,
    key            : PropTypes.string.isRequired,
    guid           : PropTypes.string.isRequired,
    deleteHandler  : PropTypes.func.isRequired,
    editHandler    : PropTypes.func.isRequired,
    isDisabled      : PropTypes.bool
};

ItemBasic.defaultProps = {
    isDisabled      : false
};

export default ItemBasic;
```

## The Basic Modal component.

```javascript
const BasicModal = (props) => (
    <Modal show={props.show} onHide={props.onHide}>
        <Modal.Header closeButton>
            <Modal.Title>{props.title}</Modal.Title>
        </Modal.Header>
        <Modal.Body>
            {props.body}
        </Modal.Body>
        <Modal.Footer>
            <Button bsStyle="default" onClick={props.onHide}>Close</Button>
            <Button bsStyle={props.actionStyle} onClick={props.action}>{props.actionText}</Button>
        </Modal.Footer>
    </Modal>
);

BasicModal.PropTypes = {
    show:           PropTypes.bool.isRequired,
    onHide:         PropTypes.func.isRequired,
    title:          PropTypes.string.isRequired,
    body:           PropTypes.string.isRequired,
    action:         PropTypes.func.isRequired,
    actionStyle:    PropTypes.oneOf.isRequired,
    actionText:     PropTypes.func.isRequired
};

export default BasicModal;
```

[Managing Users With React - The Meteor Chef]: https://themeteorchef.com/tutorials/managing-users-with-react
[Users and Accounts - Meteor]: https://guide.meteor.com/accounts.html
[`accounts-base` Package]: http://docs.meteor.com/api/accounts.html
[Alert Handling in Meteor with Bert]: https://github.com/themeteorchef/bert
