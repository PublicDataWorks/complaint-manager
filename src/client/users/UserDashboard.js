import React from 'react'
import NavBar from '../sharedComponents/NavBar'
import CreateUserDialog from './CreateUserDialog/CreateUserDialog'
import UsersTable from "./UsersTable/UsersTable";
import UserCreationSnackbar from "./UserCreationSnackbar/UserCreationSnackbar";
import {Typography} from "material-ui";

const UserDashboard = () => {
    return (
        <div>
            <NavBar>
                <Typography
                    data-test="pageTitle"
                    type="title"
                    color="inherit"
                >
                    Admin
                </Typography>
            </NavBar>

            <CreateUserDialog />
            <UsersTable />
            <UserCreationSnackbar />
        </div>
    )
}

export default UserDashboard