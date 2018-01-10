import React from 'react'
import HomeIcon from 'material-ui-icons/Home';
import AccountCircleIcon from 'material-ui-icons/AccountCircle';
import {AppBar, IconButton, Toolbar, Typography} from 'material-ui'
import StyledLink from "./StyledLink";

const styles = {
    flex:{
        flex:1
    },
    appBar:{
        width: '100%',
        overflowX: 'scroll'
    }
}

const NavBar = (props) => {
    return (
    <AppBar position="static" style={styles.appBar}>
        <Toolbar>
            <IconButton color="contrast" href="/">
                <HomeIcon/>
            </IconButton>
            <Typography
                data-test="pageTitle"
                type="title"
                color="inherit"
            >
                {props.children
                  ? props.children
                  : ""}
            </Typography>
            <StyledLink
              data-test="adminLink"
              href="/admin"
              style={styles.flex}
            >Admin</StyledLink>
              <Typography
                data-test="userName"
                type="title"
                color="inherit"
              > Name </Typography>
            <IconButton color="contrast">
                <AccountCircleIcon/>
            </IconButton>

        </Toolbar>
    </AppBar>)
}

export default NavBar