import React, { useEffect } from "react";
import List from "@material-ui/core/List";
import makeStyles from "@material-ui/core/styles/makeStyles";
import NotificationCard from "./NotificationCard";
import { connect } from "react-redux";
import getUsers from "../../../../common/thunks/getUsers";

const useStyles = makeStyles(theme => ({
  root: {
    width: "100%",
    maxWidth: 360,
    backgroundColor: "#FFFFFF"
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
    <List
      className={classes.root}
      style={{ paddingTop: "0px", paddingBottom: "0px" }}
    >
      {props.notifications.map(notification => {
        const newNotif = replaceMentionerName(notification);
        return <NotificationCard notification={newNotif} key={newNotif.id} />;
      })}
    </List>
  );
};

const mapStateToProps = state => ({
  notifications: state.notifications,
  allUsers: state.users.all
});

const mapDispatchToProps = { getUsers: getUsers };

export default connect(mapStateToProps, mapDispatchToProps)(NotificationList);
