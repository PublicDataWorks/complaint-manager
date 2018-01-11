import React from 'react'
import HomeIcon from 'material-ui-icons/Home';
import Settings from 'material-ui-icons/Settings';
import {AppBar, IconButton, Menu, MenuItem, Toolbar, Typography} from 'material-ui'
import StyledLink from "./StyledLink";
import {Link} from "react-router-dom";

const styles = {
    flex:{
        flex:1
    },
    appBar:{
        width: '100%',
        overflowX: 'scroll'
    }
}

class NavBar extends React.Component{

    state = {
        menuOpen: false,
        anchorEl: null,
    }

    handleMenu = event => {
        this.setState({
            menuOpen: true,
            anchorEl: event.currentTarget
        })
    }

    handleClose = () => {
        this.setState({
            menuOpen: false,
            anchorEl: null
        })
    }

    render() {
        return (
            <AppBar position="static" style={styles.appBar}>
                <Toolbar>
                    <IconButton
                        color="contrast"
                        component={Link}
                        to="/"
                    >
                        <HomeIcon/>
                    </IconButton>
                    <Typography
                        data-test="pageTitle"
                        type="title"
                        color="inherit"
                        style={styles.flex}
                    >
                        {this.props.children
                          ? this.props.children
                          : ""}
                    </Typography>
                    <Typography
                        data-test="userName"
                        type="title"
                        color="inherit"
                      > Name </Typography>
                    <IconButton
                        color="contrast"
                        data-test="gearButton"
                        onClick={this.handleMenu}
                    >
                        <Settings/>
                    </IconButton>
                    <Menu
                        open={this.state.menuOpen}
                        data-test="menu"
                        anchorEl={this.state.anchorEl}
                        onClose={this.handleClose}
                    >
                        <MenuItem
                            data-test="adminButton"
                            component={Link}
                            to="/admin"
                        >
                            Admin
                        </MenuItem>
                    </Menu>
                </Toolbar>
            </AppBar>
        )}
}

export default NavBar