import React from 'react'
import HomeIcon from 'material-ui-icons/Home';
import AccountCircleIcon from 'material-ui-icons/AccountCircle';
import {AppBar, IconButton, Toolbar, Typography} from 'material-ui'

const NavBar = (props) => {
    return (
    <AppBar position="static">
        <Toolbar>
            <IconButton>
                <HomeIcon/>
            </IconButton>
            <Typography
                data-test="pageTitle"
                type="title"
                color="inherit"
            >
                {props.children}
            </Typography>
            <IconButton>
                <AccountCircleIcon/>
            </IconButton>
            <a data-test="adminLink" href="/admin">Admin</a>
        </Toolbar>
    </AppBar>)
}

export default NavBar