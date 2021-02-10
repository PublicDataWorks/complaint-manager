import ListItemText from "@material-ui/core/ListItemText";
import React from "react";
import Typography from "@material-ui/core/Typography";
import moment from "moment";

const NotificationCardText = props => {
  const author = props.notification.author.name
    ? props.notification.author.name
    : props.notification.author.email;

  const title = `${author} mentioned you in ${props.notification.caseReference}`;

  const NOTIFICATION_TIME_FORMAT = "MMM D h:mm A";
  const timestamp = moment(props.notification.updatedAt).format(
    NOTIFICATION_TIME_FORMAT
  );
  return (
    <ListItemText
      primary={
        <React.Fragment>
          <Typography
            component="span"
            style={{ fontWeight: 600, color: "black", wordBreak: "break-word" }}
          >
            {title}
          </Typography>
        </React.Fragment>
      }
      secondary={timestamp}
    />
  );
};

export default NotificationCardText;
