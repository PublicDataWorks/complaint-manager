import React, { useEffect } from "react";
import makeStyles from "@material-ui/core/styles/makeStyles";
import NotificationCard from "./NotificationCard";
import { connect } from "react-redux";
import getUsers from "../../../../common/thunks/getUsers";
import ButtonGroup from "@material-ui/core/ButtonGroup";
import Button from "@material-ui/core/Button";

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

  return (
    <ButtonGroup orientation="vertical" className={classes.root}>
      {props.notifications.map(notification => {
        const newNotif = replaceMentionerName(notification);
        return (
          <Button
            style={{
              backgroundColor: "white",
              width: "300px",
              textTransform: "none",
              textAlign: "left",
              paddingTop: "7.5px",
              paddingBottom: "8px",
              borderRadius: "0px"
            }}
          >
            <NotificationCard notification={newNotif} key={newNotif.id} />
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

const mapDispatchToProps = { getUsers: getUsers };

export default connect(mapStateToProps, mapDispatchToProps)(NotificationList);
