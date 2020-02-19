import React, { Fragment } from "react";
import { IconButton, Menu, MenuItem } from "@material-ui/core";
import MoreVertIcon from "@material-ui/icons/MoreVert";
import { connect } from "react-redux";
import {
  openCaseNoteDialog,
  openRemoveCaseNoteDialog
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
      initialize("CaseNotes", {
        ...this.props.activity,
        actionTakenAt: moment(this.props.activity.actionTakenAt).format(
          "YYYY-MM-DDTHH:mm:ss"
        )
      })
    );
    this.props.dispatch(openCaseNoteDialog("Edit", this.props.activity));
    this.handleMenuClose();
  };

  handleRemoveNoteClick = () => {
    this.props.dispatch(openRemoveCaseNoteDialog(this.props.activity));
    this.handleMenuClose();
  };

  render() {
    return (
      <Fragment>
        <IconButton
          data-testid="activityMenuButton"
          onClick={this.handleMenuOpen}
        >
          <MoreVertIcon />
        </IconButton>
        <Menu
          open={this.state.menuOpen}
          anchorEl={this.state.anchorEl}
          onClose={this.handleMenuClose}
        >
          <MenuItem
            data-testid="editMenuItem"
            onClick={this.handleEditNoteClick}
          >
            Edit Note
          </MenuItem>
          {this.props.disableCaseNotesRemoval ? null : (
            <MenuItem
              data-testid="removeMenuItem"
              onClick={this.handleRemoveNoteClick}
            >
              Remove Note
            </MenuItem>
          )}
        </Menu>
      </Fragment>
    );
  }
}

const mapStateToProps = state => ({
  disableCaseNotesRemoval: state.featureToggles.disableCaseNotesRemoval
});

export default connect(mapStateToProps)(ActivityMenu);
