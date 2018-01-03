import React from 'react'
import NavBar from '../NavBar'
import CreateUser from './CreateUser'

const Dashboard = () => {
    return (
        <div>
            <NavBar>Admin</NavBar>
            <CreateUser />
        </div>
    )
}

export default Dashboard