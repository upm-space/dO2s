import React, { Component } from 'react';
import PropTypes from 'prop-types';

import { ItemBasic } from '../../components/ItemBasic/ItemBasic';
import SearchComponent from '../../components/SearchComponent/SearchComponent';

class UserManagementLayout extends Component {
  constructor(props) {
    super(props);
    this.usuarios = Users.find({});
    this.state = {
      usuarios: Users.find({}),
    };
    console.log('componente construido');
  }

  componentDidMount() {
    console.log('Componente Montado');
    setTimeout(() => {
      this.printUsers(this.state.usuarios);
    }, 100);
  }

  printUsers(usuarios1) {
    usuarios1.forEach((usuario) => {
            // console.log("Usuario AA : " + usuario.emails[0].address);
    });
  }

  editUser(id) {
    console.log(`Editing user ${id}`);
  }

  deleteUser(id) {
    console.log(`Deleting user ${id}`);
  }

  render() {
    const rows = [];
    this.usuarios.forEach((usuario) => {
            // console.log(usuario.emails[0].address);
      rows.push({ name: usuario.username, key: usuario._id });
            // rows.push(<ItemBasic name={usuario.emails[0].address} key={usuario._id} />)
    });
    return (
      <div className="appUserManagement">
        <h1>User Management</h1>
        <div className="row precise-width">
          <div className="col-md-3 col-lg-3">
            <SearchComponent
              rows={rows}
              deleteHandler={this.deleteUser}
              editHandler={this.editUser}
            />
          </div>
          <div className="col-md-9 col-lg-9">
            {this.props.children}
          </div>
        </div>
        {/* {rows} */}
      </div>
    );
  }
}

export default UserManagementLayout;
