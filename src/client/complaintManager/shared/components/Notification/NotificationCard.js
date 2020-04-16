import ListItemText from "@material-ui/core/ListItemText";
import React from "react";
import Typography from "@material-ui/core/Typography";
import moment from "moment";
import * as _ from "lodash";

const NotificationCard = props => {
  const author = _.isEmpty(props.notification.author.name)
    ? props.notification.author.email
    : props.notification.author.name;
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
            style={{ fontWeight: 600, color: "black" }}
          >
            {title}
          </Typography>
        </React.Fragment>
      }
      secondary={timestamp}
    />
  );
};

export default NotificationCard;
