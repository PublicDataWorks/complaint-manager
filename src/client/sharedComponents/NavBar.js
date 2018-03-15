import React from 'react'
import HomeIcon from 'material-ui-icons/Home';
import Settings from 'material-ui-icons/Settings';
import {AppBar, IconButton, Menu, MenuItem, Toolbar, Typography} from 'material-ui'
import {Link} from "react-router-dom";
import {connect} from "react-redux";
import Auth from "../auth/Auth";

const styles = {
    appBarStyle: {
        position: 'static',
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
        const {isHome, nickname, children} = this.props
        const appBarStyle = isHome ? styles.appBarStyle : this.props.customStyle
        return (

            <AppBar position="static" style={appBarStyle}>
                <Toolbar>
                    {
                        isHome
                            ?
                            <IconButton
                                color='inherit'
                                component={Link}
                                to="/"
                                data-test='homeButton'
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
                        data-test="userNickName"
                        type="title"
                        color="inherit"

                    >{`${nickname}`}</Typography>
                    <IconButton
                        color='inherit'
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
                            Manage Users
                        </MenuItem>
                        <MenuItem
                            data-test="logOutButton"
                            onClick={()=>{new Auth().logout()}}
                        >
                           Log Out
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

const mapStateToProps = state => ({
    nickname: state.users.current.userInfo.nickname
})

export default connect(mapStateToProps)(NavBar)
