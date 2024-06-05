import { Avatar, Tooltip } from "@material-ui/core";
import { makeStyles } from "@material-ui/core/styles";
import React from "react";
import { useEffect, useState } from "react";
import { connect } from "react-redux";
import getUsers from "../../common/thunks/getUsers";

const useStyles = makeStyles({
  avatar: {
    color: "#474747",
    backgroundColor: "#E1E1E1",
    width: "45px",
    height: "45px",
    fontWeight: "500"
  }
});

const UserAvatar = ({ email, users, getUsers }) => {
  const [userInitials, setUserInitials] = useState("");
  const classes = useStyles();

  useEffect(() => {
    if (email) {
      try {
        const user = users.find(user => user.email === email);

        const getInitialsFromUser = user => {
          const firstNameIndex = 0;
          const firstInititalIndex = 0;
          const nameParts = user.name
            ? user.name.trim().split(/\s+/)
            : [user.email];
          const lastNameIndex = nameParts.length - 1;
          const firstInitial = nameParts[firstNameIndex][firstInititalIndex];
          const lastInitial =
            nameParts.length > 1
              ? nameParts[lastNameIndex][firstInititalIndex]
              : "";
          return firstInitial + lastInitial;
        };

        const initials = user ? getInitialsFromUser(user) : email[0];

        setUserInitials(initials.toUpperCase());
      } catch (error) {
        console.error("Error while loading list of users:", error);
        return error;
      }
    }
  }, [email, users]);

  useEffect(() => {
    if (users.length === 0) {
      getUsers();
    }
  }, [getUsers]);
  return (
    <div>
      {email ? (
        <Tooltip data-testid={`tooltip-${userInitials}`} title={email}>
          <Avatar className={classes.avatar}>{userInitials}</Avatar>
        </Tooltip>
      ) : (
        <div data-testid="no-avatar"></div>
      )}
    </div>
  );
};
const mapStateToProps = state => ({
  users: state.users.all
});
export default connect(mapStateToProps, { getUsers })(UserAvatar);
