import ListItemText from "@material-ui/core/ListItemText";
import React from "react";
import Typography from "@material-ui/core/Typography";
import moment from "moment";

const NotificationCard = props => {
  const title = `${props.notification.mentioner} mentioned you in ${props.notification.caseReference}`;

  const NOTIFICATION_TIME_FORMAT = "MMM D h:mm A";
  const timestamp = moment(props.notification.updatedAt).format(
    NOTIFICATION_TIME_FORMAT
  );
  return (
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
  );
};

export default NotificationCard;
