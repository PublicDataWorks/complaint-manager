import React, { Component } from "react";
import UsersTable from "./UsersTable/UsersTable";
import CreateUserDialog from "./CreateUserDialog/CreateUserDialog";
import UserCreationSnackbar from "./UserCreationSnackbar/UserCreationSnackbar";
import NavBar from "../shared/components/NavBar/NavBar";
import { Typography } from "material-ui";
import { connect } from "react-redux";
import { closeSnackbar } from "../actionCreators/snackBarActionCreators";

class UserDashboard extends Component {
  componentWillMount() {
    this.props.dispatch(closeSnackbar());
  }

  render() {
    return (
      <div>
        <NavBar>
          <Typography data-test="pageTitle" variant="title" color="inherit">
            Manage Users
          </Typography>
        </NavBar>
        <CreateUserDialog />
        <UsersTable />
        <UserCreationSnackbar />
      </div>
    );
  }
}

export default connect()(UserDashboard);
