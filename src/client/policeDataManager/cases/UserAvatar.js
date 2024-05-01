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

const UserAvatar = (props) => {
  const [initials, setInitials] = useState(''); 
  const classes = useStyles(); 

  useEffect(() => {
    let isMounted = true; // Boolean flag to track component's mounted state

    const fetchInitials = async () => {
      const getUserNameInitialsForAvatar = async () => {
        try {
          const getListOfUsers = await getUsers();
          const findSelectedUser = getListOfUsers.find((user) => user.email === props.email);

          if (findSelectedUser) {
            const nameParts = findSelectedUser.name.trim().split(/\s+/);
            const firstInitial = nameParts[0][0];
            const lastInitial = nameParts.length > 1 ? nameParts[nameParts.length - 1][0] : '';
            return firstInitial + lastInitial;
          }

          return ''; // Return empty string if no user is found
        } catch (error) {
          console.error('Error fetching user:', error);
          return '';
        }
      };

      const initials = await getUserNameInitialsForAvatar(); // Await the initials
      if (isMounted) {
        setInitials(initials); // Update the state only if the component is still mounted
      }
    };

    if (props.email) {
      fetchInitials(); // Call the async function to fetch initials
    }

    // Cleanup function to set isMounted to false when component unmounts
    return () => {
      isMounted = false;
    };
  }, [props.email]);

  return (
    <div>
      {props.email ? (
        <Tooltip data-testid={`tooltip-${initials}`} title={props.email}>
          <Avatar className={classes.avatar}>{initials}</Avatar>
        </Tooltip>
      ) : (
        <div data-testid="no-avatar"></div>
      )}
    </div>
  );
};

export default UserAvatar;
