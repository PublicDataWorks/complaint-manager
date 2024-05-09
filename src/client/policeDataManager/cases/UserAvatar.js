import { Avatar, Tooltip } from "@material-ui/core";
import { makeStyles } from "@material-ui/core/styles";
import React from "react";
import { useEffect, useState } from "react";
import { connect } from "react-redux";

const useStyles = makeStyles({
  avatar: {
    color: "#474747",
    backgroundColor: "#E1E1E1",
    width: "45px",
    height: "45px",
    fontWeight: "500"
  }
});

const UserAvatar = ({ email, users }) => {
  const [userInitials, setUserInitials] = useState(''); 
  const classes = useStyles(); 

  useEffect(() => {
    if (email) {
      try {
        const user = users.find((user) => user.email === email);

        if (user) {
          const nameParts = user.name.trim().split(/\s+/);
          const firstInitial = nameParts[0][0];
          const lastInitial = nameParts.length > 1 ? nameParts[nameParts.length - 1][0] : '';
            setUserInitials(firstInitial + lastInitial);
        }
      } catch (error) {
        console.error('Error while loading list of users:', error);
        return error;
      }
    }
    
  }, [email, users]);

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
export default connect(mapStateToProps)(UserAvatar);
