import React, { Component } from "react";
import HomeIcon from "@material-ui/icons/Home";
import Settings from "@material-ui/icons/MenuSharp";
import {
  AppBar,
  IconButton,
  Menu,
  Toolbar,
  Typography
} from "@material-ui/core";
import { Link } from "react-router-dom";
import { connect } from "react-redux";
import MenuNavigator from "./MenuNavigator";
import standards from "../../../../common/globalStyling/standards";
import styles from "../../../../common/globalStyling/styles";
import NotificationDrawer from "../Notification/NotificationDrawer";
import createMuiTheme from "@material-ui/core/styles/createMuiTheme";
import NotificationsIcon from "@material-ui/icons/Notifications";
import getNotificationsForUser from "../../thunks/getNotificationsForUser";
import Badge from "@material-ui/core/Badge";

class NavBar extends Component {
  state = {
    menuOpen: false,
    anchorEl: null,
    exportDialogOpen: false,
    notificationDrawer: false,
    notifications: []
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
    const open = this.state.notificationDrawer;
    if (!open && !this.props.realtimeNotificationsFeature) {
      this.props.getNotificationsForUser(this.props.nickname);
    }
    this.setState({
      notificationDrawer: !open
    });
  };

  countUnreadNotifications = () => {
    let count = 0;
    const allNotifications = this.props.notifications;

    for (let i = 0; i < allNotifications.length; i++) {
      if (!allNotifications[i].hasBeenRead) {
        count++;
      }
    }
    return count;
  };

  render() {
    const { showHome, nickname, children, menuType, dataTest } = this.props;
    const appBarStyle = showHome ? styles.appBarStyle : this.props.customStyle;
    const dataTestTitle = dataTest ? dataTest : "pageTitle";
    const theme = createMuiTheme();
    return (
      <AppBar
        position="static"
        style={{ ...appBarStyle, ...{ zIndex: theme.zIndex.drawer + 1000 } }}
        data-testid="header"
      >
        <Toolbar>
          {showHome ? (
            <IconButton
              component={Link}
              to="/"
              data-testid="homeButton"
              style={{
                color: !this.state.notificationDrawer ? "inherit" : "white"
              }}
              disabled={this.state.notificationDrawer}
            >
              <HomeIcon />
            </IconButton>
          ) : (
            ""
          )}
          <Typography data-testid={dataTestTitle} variant="h6" color="inherit">
            {children}
          </Typography>

          <div style={{ flex: 1, flexDirection: "row-reverse" }} />

          <Typography
            data-testid="userNickName"
            variant="h6"
            color="inherit"
          >{`${nickname}`}</Typography>
          {this.props.notificationFeature ? (
            <IconButton
              color="inherit"
              className="notificationBell"
              data-testid="notificationBell"
              style={{ marginLeft: standards.small }}
              onClick={() => this.handleNotificationClick()}
            >
              <Badge
                color={"error"}
                badgeContent={this.countUnreadNotifications()}
              >
                <NotificationsIcon />
              </Badge>
            </IconButton>
          ) : null}
          <NotificationDrawer
            open={this.state.notificationDrawer}
            onClose={() => this.handleNotificationClick()}
          />
          <IconButton
            data-testid="hamburgerButton"
            onClick={this.handleMenuOpen}
            style={{
              color: !this.state.notificationDrawer ? "inherit" : "white"
            }}
            disabled={this.state.notificationDrawer}
          >
            <Settings />
          </IconButton>
          <Menu
            open={this.state.menuOpen}
            data-testid="menu"
            style={{ zIndex: theme.zIndex.drawer + 10000 }}
            getContentAnchorEl={null}
            anchorOrigin={{
              vertical: "bottom",
              horizontal: "center"
            }}
            anchorEl={this.state.anchorEl}
            onClose={this.handleMenuClose}
          >
            <MenuNavigator
              menuType={menuType}
              handleMenuClose={this.handleMenuClose}
              featureToggles={this.props.featureToggles}
            />
          </Menu>
        </Toolbar>
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
  notificationFeature: state.featureToggles.notificationFeature,
  realtimeNotificationsFeature:
    state.featureToggles.realtimeNotificationsFeature,
  featureToggles: state.featureToggles,
  notifications: state.notifications
});

const mapDispatchToProps = {
  getNotificationsForUser
};

export default connect(mapStateToProps, mapDispatchToProps)(NavBar);
