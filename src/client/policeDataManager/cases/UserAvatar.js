import { Avatar, Tooltip } from "@material-ui/core";
import React from "react";

const UserAvatar = props => {
  const initials = props.email.substring(0, 2).toUpperCase();
  return (
    <div>
      <Tooltip data-testid={`tooltip-${initials}`} title={props.email}>
        <Avatar>{initials}</Avatar>
      </Tooltip>
    </div>
  );
};

export default UserAvatar;
