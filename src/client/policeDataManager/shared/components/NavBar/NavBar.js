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
import { Link, withRouter } from "react-router-dom";
import { connect } from "react-redux";
import MenuNavigator from "./MenuNavigator";
import standards from "../../../../common/globalStyling/standards";
import styles from "../../../../common/globalStyling/styles";
import NotificationDrawer from "../Notification/NotificationDrawer";
import { createMuiTheme } from "@material-ui/core/styles";
import NotificationsIcon from "@material-ui/icons/Notifications";
import getNotificationsForUser from "../../thunks/getNotificationsForUser";
import Badge from "@material-ui/core/Badge";
import { isAuthDisabled } from "../../../../isAuthDisabled";
import UserAvatar from "../../../cases/UserAvatar";
import SearchCasesForm from "../../../cases/SearchCases/SearchCasesForm";
import { resetWorkingCasesPaging } from "../../../actionCreators/casesActionCreators";
import getWorkingCases from "../../../cases/thunks/getWorkingCases";
import {
  SORT_CASES_BY,
  DESCENDING
} from "../../../../../sharedUtilities/constants";

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
    let { showHome, nickname, children, menuType, dataTest, showSearchBar } =
      this.props;

    if (isAuthDisabled()) {
      menuType = menuType.filter(item => item.dataTestName !== "logOutButton");
    }

    const appBarStyle = showHome ? styles.appBarStyle : this.props.customStyle;
    const dataTestTitle = dataTest ? dataTest : "pageTitle";
    const theme = createMuiTheme();
    return (
      <nav role="navigation">
      <AppBar
        position="static"
        style={{ ...appBarStyle, ...{ zIndex: theme.zIndex.drawer + 1000 } }}
        data-testid="header"
      >
        <Toolbar>
          {showHome ? (
            <IconButton
              title="Home Button"
              component={Link}
              to="/"
              data-testid="homeButton"
              style={{
                color: !this.state.notificationDrawer ? "inherit" : "white"
              }}
              disabled={this.state.notificationDrawer}
              onClick={() => {
                this.props.resetWorkingCasesPaging();
                if (this.props.location.pathname === "/") {
                  this.props.getWorkingCases(
                    SORT_CASES_BY.CASE_REFERENCE,
                    DESCENDING,
                    1
                  );
                }
              }}
            >
              <HomeIcon />
            </IconButton>
          ) : (
            ""
          )}
          <Typography data-testid={dataTestTitle} variant="h6" color="inherit">
            {children}
          </Typography>

          <div
            style={{
              flex: 1,
              flexDirection: "row",
              alignItems: "center",
              justifyContent: "center"
            }}
          />

          {this.props.featureToggles.searchCasesFeature && showSearchBar ? (
            <SearchCasesForm />
          ) : (
            <div />
          )}

          <div style={{ flex: 1, flexDirection: "row-reverse" }} />
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
          <NotificationDrawer
            open={this.state.notificationDrawer}
            onClose={() => this.handleNotificationClick()}
          />
          <IconButton
            data-testid="userAvatarButton"
            onClick={this.handleMenuOpen}
            style={{
              color: !this.state.notificationDrawer ? "inherit" : "white"
            }}
            disabled={this.state.notificationDrawer}
          >
            <UserAvatar email={nickname} />
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
              location={this.props.location}
            />
          </Menu>
        </Toolbar>
      </AppBar>
      </nav>
    );
  }
}

NavBar.defaultProps = {
  showHome: true
};

const mapStateToProps = state => ({
  nickname: state.users.current.userInfo.nickname,
  permissions: state.users.current.userInfo.permissions,
  realtimeNotificationsFeature:
    state.featureToggles.realtimeNotificationsFeature,
  featureToggles: state.featureToggles,
  notifications: state.notifications
});

const mapDispatchToProps = {
  getNotificationsForUser,
  getWorkingCases,
  resetWorkingCasesPaging
};

export default connect(mapStateToProps, mapDispatchToProps)(withRouter(NavBar));
