import React from "react";
import HomeIcon from "@material-ui/icons/Home";
import Settings from "@material-ui/icons/Settings";
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
import ExportAuditLogConfirmationDialog from "./ExportAuditLogConfirmationDialog";
import handleLogout from "../../../users/thunks/handleLogout";
import { USER_PERMISSIONS } from "../../../../sharedUtilities/constants";

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

  handleExportDialogOpen = () => {
    this.setState({ exportDialogOpen: true, menuOpen: false });
  };

  handleExportDialogClose = () => {
    this.setState({ exportDialogOpen: false });
  };

  renderExportAuditLogOption = () => {
    if (
      !this.props.permissions ||
      !this.props.permissions.includes(USER_PERMISSIONS.EXPORT_AUDIT_LOG)
    ) {
      return null;
    }
    return (
      <MenuItem
        data-test="exportAuditLog"
        onClick={this.handleExportDialogOpen}
      >
        Export Audit Log
      </MenuItem>
    );
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
            {this.renderExportAuditLogOption()}
            <MenuItem data-test="adminButton" component={Link} to="/admin">
              Manage Users
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
        <ExportAuditLogConfirmationDialog
          dialogOpen={this.state.exportDialogOpen}
          handleClose={this.handleExportDialogClose}
        />
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
