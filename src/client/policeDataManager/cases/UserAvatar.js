import { Avatar, Tooltip } from "@material-ui/core";
import { makeStyles } from "@material-ui/core/styles";
import React from "react";
import { useEffect, useState } from "react";
import { getUsers } from "../../../auth/okta/userService";

const useStyles = makeStyles({
  avatar: {
    color: "#474747",
    backgroundColor: "#E1E1E1",
    width: "45px",
    height: "45px",
    fontWeight: "500"
  }
});

const UserAvatar = ({ email }) => {
  const [initials, setInitials] = useState(''); 
  const classes = useStyles(); 

  useEffect(() => {
    let isMounted = true; // Boolean flag to track component's mounted state

    const fetchInitials = async () => {
      try {
        const users = await getUsers();
        const user = users.find((user) => user.email === email);

        if (user) {
          const nameParts = user.name.trim().split(/\s+/);
          const firstInitial = nameParts[0][0];
          const lastInitial = nameParts.length > 1 ? nameParts[nameParts.length - 1][0] : '';
          if (isMounted) {
            setInitials(firstInitial + lastInitial);
          }
        }
      } catch (error) {
        console.error('Error fetching user:', error);
        console.log('Error fetching user:', error);
        return error;
      }
    };

    if (email) {
      fetchInitials();
    }

    return () => {
      isMounted = false;
    };
    
  }, [email]);

  return (
    <div>
      {email ? (
        <Tooltip data-testid={`tooltip-${initials}`} title={email}>
          <Avatar className={classes.avatar}>{initials}</Avatar>
        </Tooltip>
      ) : (
        <div data-testid="no-avatar"></div>
      )}
    </div>
  );
};

export default UserAvatar;
