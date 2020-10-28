import React from "react";
import makeStyles from "@material-ui/core/styles/makeStyles";
import { connect } from "react-redux";
import ButtonGroup from "@material-ui/core/ButtonGroup";
import axios from "axios";
import history from "../../../../history";
import { snackbarError } from "../../../actionCreators/snackBarActionCreators";

import NotificationCard from "./NotificationCard";
import { highlightCaseNote } from "../../../actionCreators/highlightCaseNoteActionCreators";

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
        props.highlightCaseNote(notification.caseNoteId);
        await axios.put(`/api/notifications/mark-as-read/${notification.id}`);
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
          <NotificationCard
            notification={notification}
            key={notification.id}
            handleNotificationCardClick={handleNotificationCardClick}
          />
        );
      })}
    </ButtonGroup>
  );
};

const mapStateToProps = state => ({
  notifications: state.notifications
});

const mapDispatchToProps = { snackbarError, highlightCaseNote };

export default connect(mapStateToProps, mapDispatchToProps)(NotificationList);
