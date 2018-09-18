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
import ExportConfirmationDialog from "./ExportConfirmationDialog";
import handleLogout from "../../../users/thunks/handleLogout";
import { USER_PERMISSIONS } from "../../../../sharedUtilities/constants";
import {
  openExportAuditLogConfirmationDialog,
  closeExportConfirmationDialog
} from "../../../actionCreators/navBarActionCreators";

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

  componentWillUnmount() {
    this.props.dispatch(closeExportConfirmationDialog());
  }

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
        onClick={() => {
          this.setState({ menuOpen: false });
          this.props.dispatch(openExportAuditLogConfirmationDialog());
        }}
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
            <MenuItem
              data-test="exportAllCases"
              component={Link}
              to="/all/export"
            >
              Export All Case Information
            </MenuItem>
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
