import React, { Component } from "react";
import HomeIcon from "@material-ui/icons/Home";
import Settings from "@material-ui/icons/SettingsSharp";
import {
  AppBar,
  IconButton,
  Menu,
  Toolbar,
  Typography
} from "@material-ui/core";
import { Link } from "react-router-dom";
import { connect } from "react-redux";
import ExportConfirmationDialog from "../../../export/ExportConfirmationDialog";
import MenuNavigator from "./MenuNavigator";
import NotificationsIcon from "@material-ui/icons/Notifications";
import standards from "../../../../common/globalStyling/standards";
import styles from "../../../../common/globalStyling/styles";
import NotificationDrawer from "./NotificationDrawer";

class NavBar extends Component {
  state = {
    menuOpen: false,
    anchorEl: null,
    exportDialogOpen: false,
    notificationDrawer: false
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

  handleNotificationClick = () => {
    this.setState({
      notificationDrawer: !this.state.notificationDrawer
    });
  };

  render() {
    const { showHome, nickname, children, menuType, dataTest } = this.props;
    const appBarStyle = showHome ? styles.appBarStyle : this.props.customStyle;
    const dataTestTitle = dataTest ? dataTest : "pageTitle";
    return (
      <AppBar position="static" style={appBarStyle}>
        <Toolbar>
          {showHome ? (
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
          <Typography data-test={dataTestTitle} variant="h6" color="inherit">
            {children}
          </Typography>

          <div style={{ flex: 1, flexDirection: "row-reverse" }} />

          <Typography
            data-test="userNickName"
            variant="h6"
            color="inherit"
          >{`${nickname}`}</Typography>
          {this.props.notificationFeature ? (
            <IconButton
              color="inherit"
              data-test="notificationBell"
              style={{ marginLeft: standards.small }}
              onClick={this.handleNotificationClick}
            >
              <NotificationsIcon />
            </IconButton>
          ) : null}
          <NotificationDrawer
            open={this.state.notificationDrawer}
            onClose={this.handleNotificationClick}
          />
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
            <MenuNavigator
              menuType={menuType}
              handleMenuClose={this.handleMenuClose}
            />
          </Menu>
        </Toolbar>
        <ExportConfirmationDialog />
      </AppBar>
    );
  }
}

NavBar.defaultProps = {
  showHome: true,
  matrixManager: false
};

const mapStateToProps = state => ({
  nickname: state.users.current.userInfo.nickname,
  permissions: state.users.current.userInfo.permissions,
  notificationFeature: state.featureToggles.notificationFeature
});

export default connect(mapStateToProps)(NavBar);
