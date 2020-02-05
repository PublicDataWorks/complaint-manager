import React, { useRef } from "react";
import styles from "../../../../common/globalStyling/styles";
import Drawer from "@material-ui/core/Drawer";
import NotificationsIcon from "@material-ui/icons/Notifications";
import makeStyles from "@material-ui/core/styles/makeStyles";
import useOnClickOutside from "./useOnClickOutside";
import { DEFAULT_NOTIFICATION_TEXT } from "../../../../../sharedUtilities/constants";

const useStyles = makeStyles(theme => ({
  // Show "fake/empty" tool bar": https://material-ui.com/components/app-bar/
  toolbar: theme.mixins.toolbar,
  paper: styles.drawer
}));

const NotificationDrawer = props => {
  const classes = useStyles();
  const ref = useRef();

  const handleClickAway = () => {
    props.onClose();
  };

  useOnClickOutside(ref, () => {
    handleClickAway();
  });

  return (
    <Drawer
      ref={ref}
      open={props.open}
      onClose={handleClickAway}
      variant="temporary"
      anchor="right"
      data-test="notificationDrawer"
      data-testid="notificationDrawer"
      SlideProps={{
        timeout: { enter: 300, exit: 300 },
        enter: true,
        exit: true,
        appear: true
      }}
    >
      <div className={classes.toolbar} />
      <div style={styles.drawerContent}>
        <NotificationsIcon
          style={{ justifyContent: "center", width: "100%" }}
          fontSize="large"
          color="secondary"
        />
        <div style={{ textAlign: "center", width: "100%", color: "#62757f" }}>
          {DEFAULT_NOTIFICATION_TEXT}
        </div>
      </div>
    </Drawer>
  );
};

export default NotificationDrawer;
