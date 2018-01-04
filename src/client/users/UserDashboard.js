import React from 'react'
import NavBar from '../NavBar'
import CreateUserDialog from './CreateUserDialog'

const UserDashboard = () => {
    return (
        <div>
            <NavBar>Admin</NavBar>
            <CreateUserDialog />
        </div>
    )
}

export default UserDashboard