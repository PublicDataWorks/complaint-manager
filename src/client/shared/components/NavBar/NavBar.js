import React from "react";
import HomeIcon from "@material-ui/icons/Home";
import Settings from "@material-ui/icons/SettingsSharp";
import {
  AppBar,
  IconButton,
  Menu,
  MenuItem,
  Toolbar,
  Typography
} from "@material-ui/core";
import { Link } from "react-router-dom";
import { connect } from "react-redux";
import ExportConfirmationDialog from "../../../export/ExportConfirmationDialog";
import handleLogout from "../../../users/thunks/handleLogout";

const styles = {
  appBarStyle: {
    position: "static",
    width: "100%"
  }
};

class NavBar extends React.Component {
  state = {
    menuOpen: false,
    anchorEl: null,
    exportDialogOpen: false
  };

  handleMenuOpen = event => {
    this.setState({
      menuOpen: true,
      anchorEl: event.currentTarget
    });
  };

  handleMenuClose = () => {
    this.setState({
      menuOpen: false,
      anchorEl: null
    });
  };

  render() {
    const { isHome, nickname, children } = this.props;
    const appBarStyle = isHome ? styles.appBarStyle : this.props.customStyle;
    return (
      <AppBar position="static" style={appBarStyle}>
        <Toolbar>
          {isHome ? (
            <IconButton
              color="inherit"
              component={Link}
              to="/"
              data-test="homeButton"
            >
              <HomeIcon />
            </IconButton>
          ) : (
            ""
          )}

          {children}

          <div style={{ flex: 1, flexDirection: "row-reverse" }} />

          <Typography
            data-test="userNickName"
            variant="title"
            color="inherit"
          >{`${nickname}`}</Typography>
          <IconButton
            color="inherit"
            data-test="gearButton"
            onClick={this.handleMenuOpen}
          >
            <Settings />
          </IconButton>
          <Menu
            open={this.state.menuOpen}
            data-test="menu"
            anchorEl={this.state.anchorEl}
            onClose={this.handleMenuClose}
          >
            <MenuItem data-test="exports" component={Link} to="/export/all">
              Export
            </MenuItem>
            <MenuItem
              data-test="archivedCases"
              component={Link}
              to={"/archived-cases"}
            >
              Archived Cases
            </MenuItem>
            <MenuItem
              data-test="logOutButton"
              onClick={() => {
                handleLogout();
              }}
            >
              Log Out
            </MenuItem>
          </Menu>
        </Toolbar>
        <ExportConfirmationDialog />
      </AppBar>
    );
  }
}

NavBar.defaultProps = {
  isHome: true
};

const mapStateToProps = state => ({
  nickname: state.users.current.userInfo.nickname,
  permissions: state.users.current.userInfo.permissions
});

export default connect(mapStateToProps)(NavBar);
