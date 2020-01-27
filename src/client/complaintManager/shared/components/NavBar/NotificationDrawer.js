import React, { Component } from "react";
import styles from "../../../../common/globalStyling/styles";
import Drawer from "@material-ui/core/Drawer";
import withStyles from "@material-ui/core/styles/withStyles";

const style = {
  paper: styles.drawer
};

const StyledDrawer = withStyles(style)(Drawer);

class NotificationDrawer extends Component {
  render() {
    return (
      <StyledDrawer
        open={this.props.open}
        onBackdropClick={this.props.onClose}
        variant="temporary"
        anchor="right"
        data-test="notificationDrawer"
      >
        {"You have no new notifications."}
      </StyledDrawer>
    );
  }
}

export default NotificationDrawer;
