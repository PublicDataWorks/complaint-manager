import ListItemText from "@material-ui/core/ListItemText";
import React from "react";
import Typography from "@material-ui/core/Typography";
import ListItem from "@material-ui/core/ListItem";
import Divider from "@material-ui/core/Divider";
import moment from "moment";

const NotificationCard = props => {
  const title = `${props.notification.mentioner} mentioned you in ${props.notification.caseReference}`;

  const NOTIFICATION_TIME_FORMAT = "MMM D h:mm A";
  const timestamp = moment(props.notification.updatedAt).format(
    NOTIFICATION_TIME_FORMAT
  );
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
