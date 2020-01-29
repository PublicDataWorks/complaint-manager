import React, { useRef } from "react";
import styles from "../../../../common/globalStyling/styles";
import Drawer from "@material-ui/core/Drawer";
import withStyles from "@material-ui/core/styles/withStyles";
import NotificationsIcon from "@material-ui/icons/Notifications";
import makeStyles from "@material-ui/core/styles/makeStyles";
import ClickAwayListener from "@material-ui/core/ClickAwayListener";
import useOnClickOutside from "./useOnClickOutside";

const useStyles = makeStyles(theme => ({
  // Show "fake/empty" tool bar": https://material-ui.com/components/app-bar/
  toolbar: theme.mixins.toolbar
}));

const NotificationDrawer = props => {
  const classes = useStyles();
  const ref = useRef();
  const style = {
    paper: styles.drawer
  };
  const StyledDrawer = withStyles(style)(Drawer);

  const handleClickAway = event => {
    console.log("What's happening?", event.target);
    props.onClose();
  };

  useOnClickOutside(ref, event => {
    props.onClose();
  });

  return (
    <StyledDrawer
      ref={ref}
      open={props.open}
      onClose={handleClickAway}
      variant="temporary"
      anchor="right"
      data-test="notificationDrawer"
      // ModalProps={{closeAfterTransition: true}}
      // same numbers as the code sandbox
      SlideProps={{
        timeout: { enter: 300, exit: 300 },
        enter: true,
        exit: true,
        appear: true
      }}
      // transitionDuration={{ enter: 5000, exit: 5000 }}
    >
      <div className={classes.toolbar} />
      <div style={styles.drawerContent}>
        <NotificationsIcon
          style={{ justifyContent: "center", width: "100%" }}
          fontSize="large"
          color="secondary"
        />
        <div style={{ textAlign: "center", width: "100%", color: "#62757f" }}>
          You have no new notifications.
        </div>
      </div>
    </StyledDrawer>
  );
};

export default NotificationDrawer;
