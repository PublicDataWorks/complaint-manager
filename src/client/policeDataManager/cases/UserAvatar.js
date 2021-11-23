import { Avatar, Tooltip } from "@material-ui/core";
import { makeStyles } from "@material-ui/core/styles";
import React from "react";

const useStyles = makeStyles({
  avatar: {
    color: "#474747",
    backgroundColor: "#E1E1E1",
    width: "45px",
    height: "45px",
    fontWeight: "500"
  }
});

const UserAvatar = props => {
  const classes = useStyles();

  if (props.email) {
    const initials = props.email.substring(0, 2).toUpperCase();

    return (
      <div>
        <Tooltip data-testid={`tooltip-${initials}`} title={props.email}>
          <Avatar className={classes.avatar}>{initials}</Avatar>
        </Tooltip>
      </div>
    );
  } else {
    return <div data-testid="no-avatar"></div>;
  }
};

export default UserAvatar;
