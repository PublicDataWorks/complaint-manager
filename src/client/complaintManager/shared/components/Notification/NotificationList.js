import React, { useEffect } from "react";
import makeStyles from "@material-ui/core/styles/makeStyles";
import NotificationCard from "./NotificationCard";
import { connect } from "react-redux";
import getUsers from "../../../../common/thunks/getUsers";
import ButtonGroup from "@material-ui/core/ButtonGroup";
import Button from "@material-ui/core/Button";
import axios from "axios";
import history from "../../../../history";
import { snackbarError } from "../../../actionCreators/snackBarActionCreators";
import { MuiThemeProvider, createMuiTheme } from "@material-ui/core/styles";
import Divider from "@material-ui/core/Divider";

const buttonTheme = createMuiTheme({
  overrides: {
    MuiButton: {
      root: {
        backgroundColor: "white",
        "&:hover": {
          backgroundColor: "#d8d8d8"
        },
        color: "#eceff1",
        width: "300px",
        textTransform: "none",
        textAlign: "left",
        borderRadius: "2px"
      },
      text: {
        paddingTop: "7.5px",
        paddingBottom: "8px",
        paddingLeft: "16px",
        paddingRight: "16px"
      }
    }
  }
});

const useStyles = makeStyles(theme => ({
  root: {
    width: "100%",
    maxWidth: 360,
    paddingTop: "0px",
    paddingBottom: "0px"
  }
}));

const NotificationList = props => {
  const classes = useStyles;

  const closeNotificationDrawer = () => {
    props.handleClickAway();
  };

  const handleNotificationCardClick = notification => {
    return async () => {
      const response = await axios.get(
        `/api/notifications/${notification.caseNoteId}/${notification.id}`
      );
      const notificationStatus = response.data;

      if (
        !notificationStatus.caseNoteExists ||
        !notificationStatus.notificationExists
      ) {
        closeNotificationDrawer();
        if (!notificationStatus.caseNoteExists) {
          props.snackbarError(
            "The case note for this notification has been removed from the complaint"
          );
        } else {
          props.snackbarError(
            "The case note for this notification no longer mentions you"
          );
        }
      } else {
        if (window.location.href.endsWith(notification.caseId)) {
          closeNotificationDrawer();
        } else {
          history.push(`/cases/${notification.caseId}`);
        }
      }
    };
  };

  return (
    <ButtonGroup orientation="vertical" className={classes.root}>
      {props.notifications.map(notification => {
        return (
          <MuiThemeProvider theme={buttonTheme} key={notification.id}>
            <div>
              <Button
                data-testid={"notificationCard"}
                onClick={handleNotificationCardClick(notification)}
                key={notification.id}
              >
                <NotificationCard notification={notification} />
              </Button>
              <Divider />
            </div>
          </MuiThemeProvider>
        );
      })}
    </ButtonGroup>
  );
};

const mapStateToProps = state => ({
  notifications: state.notifications,
  allUsers: state.users.all
});

const mapDispatchToProps = { getUsers, snackbarError };

export default connect(mapStateToProps, mapDispatchToProps)(NotificationList);
