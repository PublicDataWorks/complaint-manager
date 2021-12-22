import React, { useEffect, useRef, useState } from "react";
import styles from "../../../../common/globalStyling/styles";
import Drawer from "@material-ui/core/Drawer";
import NotificationsIcon from "@material-ui/icons/Notifications";
import makeStyles from "@material-ui/core/styles/makeStyles";
import useOnClickOutside from "./useOnClickOutside";
import { DEFAULT_NOTIFICATION_TEXT } from "../../../../../sharedUtilities/constants";
import NotificationList from "./NotificationList";
import { connect } from "react-redux";

const useStyles = makeStyles(theme => ({
  // Show "fake/empty" tool bar": https://material-ui.com/components/app-bar/
  toolbar: theme.mixins.toolbar
}));

const NotificationDrawer = props => {
  const classes = useStyles();
  const ref = useRef();
  const [hasNotifications, setHasNotifications] = useState(false);

  useEffect(() => {
    if (props.notifications && props.notifications.length > 0) {
      setHasNotifications(true);
    } else {
      setHasNotifications(false);
    }
  }, [props.notifications]);

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
      data-testid="notificationDrawer"
      SlideProps={{
        timeout: { enter: 300, exit: 300 },
        enter: true,
        exit: true,
        appear: true
      }}
    >
      <div className={classes.toolbar} />

      {hasNotifications ? (
        <NotificationList handleClickAway={handleClickAway} />
      ) : (
        <div style={styles.drawerContent}>
          <NotificationsIcon
            style={{ justifyContent: "center", width: "100%" }}
            fontSize="large"
            color="secondary"
          />
          <div style={{ textAlign: "center", width: "100%", color: "#586972" }}>
            {DEFAULT_NOTIFICATION_TEXT}
          </div>
        </div>
      )}
    </Drawer>
  );
};

const mapStateToProps = state => ({
  notifications: state.notifications
});

export default connect(mapStateToProps)(NotificationDrawer);
