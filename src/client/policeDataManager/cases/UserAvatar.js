import { Avatar, Tooltip } from "@material-ui/core";
import { makeStyles } from "@material-ui/core/styles";
import React from "react";

const useStyles = makeStyles({
  avatar: {
    color: "#8E8E8E",
    backgroundColor: "#E1E1E1",
    width: "45px",
    height: "45px",
    fontWeight: "500"
  }
});

const UserAvatar = props => {
  const classes = useStyles();

  const initials = props.email.substring(0, 2).toUpperCase();

  return (
    <div>
      <Tooltip data-testid={`tooltip-${initials}`} title={props.email}>
        <Avatar className={classes.avatar}>{initials}</Avatar>
      </Tooltip>
    </div>
  );
};

export default UserAvatar;
