import React from 'react'
import NavBar from '../NavBar'
import CreateUserDialog from './CreateUserDialog'
import UsersTable from "./UsersTable";

const UserDashboard = () => {
    return (
        <div>
            <NavBar>Admin</NavBar>
            <CreateUserDialog />
            <UsersTable />
        </div>
    )
}

export default UserDashboard