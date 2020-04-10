import React, { useEffect } from "react";
import makeStyles from "@material-ui/core/styles/makeStyles";
import NotificationCard from "./NotificationCard";
import { connect } from "react-redux";
import getUsers from "../../../../common/thunks/getUsers";
import ButtonGroup from "@material-ui/core/ButtonGroup";
import Button from "@material-ui/core/Button";
import getCaseDetails from "../../../cases/thunks/getCaseDetails";
import axios from "axios";
import history from "../../../../history";
import { snackbarError } from "../../../actionCreators/snackBarActionCreators";

const useStyles = makeStyles(theme => ({
  root: {
    width: "100%",
    maxWidth: 360,
    backgroundColor: "#FFFFFF",
    paddingTop: "0px",
    paddingBottom: "0px"
  }
}));

const NotificationList = props => {
  const classes = useStyles;

  useEffect(() => {
    props.getUsers();
  }, []);

  const replaceMentionerName = notification => {
    for (const user in props.allUsers) {
      if (props.allUsers[user].email === notification.mentioner) {
        const mentioner = props.allUsers[user].name;
        notification.mentioner = mentioner;
      }
    }
    return notification;
  };

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
          props.getCaseDetails(notification.caseId);
        }
      }
    };
  };

  return (
    <ButtonGroup orientation="vertical" className={classes.root}>
      {props.notifications.map(notification => {
        const newNotif = replaceMentionerName(notification);
        return (
          <Button
            data-testid={"notificationCard"}
            onClick={handleNotificationCardClick(notification)}
            style={{
              backgroundColor: "white",
              width: "300px",
              textTransform: "none",
              textAlign: "left",
              paddingTop: "7.5px",
              paddingBottom: "8px",
              borderRadius: "0px"
            }}
            key={newNotif.id}
          >
            <NotificationCard notification={newNotif} />
          </Button>
        );
      })}
    </ButtonGroup>
  );
};

const mapStateToProps = state => ({
  notifications: state.notifications,
  allUsers: state.users.all
});

const mapDispatchToProps = { getUsers, getCaseDetails, snackbarError };

export default connect(mapStateToProps, mapDispatchToProps)(NotificationList);
