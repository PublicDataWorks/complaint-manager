import React from "react";
import List from "@material-ui/core/List";
import ListItem from "@material-ui/core/ListItem";
import ListItemText from "@material-ui/core/ListItemText";
import makeStyles from "@material-ui/core/styles/makeStyles";
import Typography from "@material-ui/core/Typography";
import Divider from "@material-ui/core/Divider";

const useStyles = makeStyles(theme => ({
  root: {
    width: "100%",
    maxWidth: 360,
    backgroundColor: "#FFFFFF"
  }
}));

const NotificationCard = props => {
  const title = "Temporary Notif. Title";
  const timestamp = "3/12/2020 at 3:10PM";
  const classes = useStyles;

  return (
    <List
      className={classes.root}
      style={{ paddingTop: "0px", paddingBottom: "0px" }}
    >
      <ListItem style={{ backgroundColor: "white" }}>
        <ListItemText
          primary={
            <React.Fragment>
              <Typography component="span" style={{ fontWeight: 600 }}>
                {title}
              </Typography>
            </React.Fragment>
          }
          secondary={timestamp}
        />
      </ListItem>
      <Divider component="li" />
    </List>
  );
};

export default NotificationCard;
