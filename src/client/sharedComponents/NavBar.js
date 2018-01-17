import React from 'react'
import HomeIcon from 'material-ui-icons/Home';
import Settings from 'material-ui-icons/Settings';
import {AppBar, IconButton, Menu, MenuItem, Toolbar, Typography} from 'material-ui'
import {Link} from "react-router-dom";

const styles = {
    appBarStyle: {
        position: 'static',
        overflowX: 'scroll',
        width: "100%"
    }
}


class NavBar extends React.Component {

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
        const {isHome, children} = this.props
        const appBarStyle = isHome ? styles.appBarStyle : this.props.customStyle
        return (

            <AppBar position="static" style={appBarStyle}>
                <Toolbar>
                    {
                        isHome
                            ?
                            <IconButton
                                color="contrast"
                                component={Link}
                                to="/"
                            >
                                <HomeIcon/>
                            </IconButton>
                            :
                            ""
                    }

                    {children}

                    <div style={{flex: 1, flexDirection: 'row-reverse'}}>
                    </div>

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
        )
    }

}

NavBar.defaultProps = {
    isHome: true
}

export default NavBar