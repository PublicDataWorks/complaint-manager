import React from "react";
import FiberManualRecordIcon from "@material-ui/icons/FiberManualRecord";
import ListItemIcon from "@material-ui/core/ListItemIcon";
import { createTheme, MuiThemeProvider } from "@material-ui/core/styles";
import Button from "@material-ui/core/Button";
import NotificationCardText from "./NotificationCardText";
import Divider from "@material-ui/core/Divider";

const NotificationCard = props => {
  const buttonTheme = createTheme({
    overrides: {
      MuiButton: {
        root: {
          backgroundColor: props.notification.hasBeenRead ? "#ECEFF1" : "white",
          "&:hover": {
            backgroundColor: "#d8d8d8"
          },
          width: "300px",
          textTransform: "none",
          textAlign: "left",
          borderRadius: "2px"
        },
        text: {
          paddingTop: "7.5px",
          paddingBottom: "8px",
          paddingLeft: "16px",
          paddingRight: "16px"
        }
      }
    }
  });
  const notifDataTestId = "notificationCard-" + props.notification.id;
  return (
    <MuiThemeProvider theme={buttonTheme}>
      <Button
        data-testid={notifDataTestId}
        onClick={props.handleNotificationCardClick(props.notification)}
      >
        <ListItemIcon style={{ minWidth: "20px" }}>
          {props.notification.hasBeenRead ? (
            <div></div>
          ) : (
            <FiberManualRecordIcon
              data-testid={"unreadDot"}
              style={{ color: "#d32f2f", fontSize: 9 }}
            />
          )}
        </ListItemIcon>
        <NotificationCardText notification={props.notification} />
      </Button>
      <Divider />
    </MuiThemeProvider>
  );
};

export default NotificationCard;
