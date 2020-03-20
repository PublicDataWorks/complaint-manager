import ListItemText from "@material-ui/core/ListItemText";
import React from "react";
import Typography from "@material-ui/core/Typography";
import ListItem from "@material-ui/core/ListItem";
import Divider from "@material-ui/core/Divider";
import { getDateAsString } from "./getDateAsString";

const NotificationCard = props => {
  const title = `${props.notification.mentioner} mentioned you in ${props.notification.caseReference}`;

  const dateAsString = getDateAsString(props.notification.updatedAt);
  const timestamp = dateAsString;
  return (
    <div>
      <ListItem style={{ backgroundColor: "white", width: "300px" }}>
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
    </div>
  );
};

export default NotificationCard;
