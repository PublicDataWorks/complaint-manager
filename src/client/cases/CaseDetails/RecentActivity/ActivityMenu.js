import React, { Fragment } from "react";
import { IconButton, MenuItem } from "material-ui";
import MoreVertIcon from "@material-ui/icons/MoreVert";
import { Menu } from "material-ui";
import { connect } from "react-redux";
import {
  openRemoveUserActionDialog,
  openUserActionDialog
} from "../../../actionCreators/casesActionCreators";
import { initialize } from "redux-form";
import moment from "moment";

class ActivityMenu extends React.Component {
  state = {
    menuOpen: false,
    anchorEl: null
  };

  handleMenuOpen = event => {
    this.setState({
      menuOpen: true,
      anchorEl: event.currentTarget
    });
  };

  handleMenuClose = () => {
    this.setState({ menuOpen: false, anchorEl: null });
  };

  handleEditNoteClick = () => {
    this.props.dispatch(
      initialize("UserActions", {
        ...this.props.activity,
        actionTakenAt: moment(this.props.activity.actionTakenAt).format(
          "YYYY-MM-DDTHH:mm:ss"
        )
      })
    );
    this.props.dispatch(openUserActionDialog("Edit"));
    this.handleMenuClose();
  };

  handleRemoveNoteClick = () => {
    this.props.dispatch(openRemoveUserActionDialog(this.props.activity));
    this.handleMenuClose();
  };

  render() {
    return (
      <Fragment>
        <IconButton
          data-test="activityMenuButton"
          onClick={this.handleMenuOpen}
        >
          <MoreVertIcon />
        </IconButton>
        <Menu
          open={this.state.menuOpen}
          anchorEl={this.state.anchorEl}
          onClose={this.handleMenuClose}
        >
          <MenuItem data-test="editMenuItem" onClick={this.handleEditNoteClick}>
            Edit Note
          </MenuItem>
          <MenuItem
            data-test="removeMenuItem"
            onClick={this.handleRemoveNoteClick}
          >
            Remove Note
          </MenuItem>
        </Menu>
      </Fragment>
    );
  }
}

export default connect()(ActivityMenu);
