import React from 'react'
import NavBar from '../sharedComponents/NavBar'
import CreateUserDialog from './CreateUserDialog/CreateUserDialog'
import UsersTable from "./UsersTable/UsersTable";
import UserCreationSnackbar from "./UserCreationSnackbar/UserCreationSnackbar";

const UserDashboard = () => {
    return (
        <div>
            <NavBar>Admin</NavBar>
            <CreateUserDialog />
            <UsersTable />
            <UserCreationSnackbar />
        </div>
    )
}

export default UserDashboard