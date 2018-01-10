import React from 'react'
import NavBar from '../NavBar'
import CreateUserDialog from './CreateUserDialog'
import UsersTable from "./UsersTable";
import UserCreationSnackbar from "./UserCreationSnackbar";

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