import React, { Fragment } from "react";
import { withStyles } from "@material-ui/core/styles";
import { IconButton, Menu, MenuItem } from "@material-ui/core";
import MoreVertIcon from "@material-ui/icons/MoreVert";
import { connect } from "react-redux";
import {
  openCaseNoteDialog,
  openRemoveCaseNoteDialog
} from "../../../actionCreators/casesActionCreators";
import { initialize } from "redux-form";
import moment from "moment";

const styles = () => ({
  iconBtn: {
    alignItems: "flex-start",
    height: "50px"
  }
});

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
        {this.props.nickname === this.props.activity.author.email ? (
          <IconButton
            data-testid="activityMenuButton"
            onClick={this.handleMenuOpen}
            className={this.props.classes.iconBtn}
          >
            <MoreVertIcon />
          </IconButton>
        ) : (
          <div
            data-testid="menuButtonPadding"
            style={{
              width: "48px"
            }}
          />
        )}
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
          {this.props.removeCaseNotesFeature ? (
            <MenuItem
              data-testid="removeMenuItem"
              onClick={this.handleRemoveNoteClick}
            >
              Remove Note
            </MenuItem>
          ) : null}
        </Menu>
      </Fragment>
    );
  }
}

const mapStateToProps = state => ({
  removeCaseNotesFeature: state.featureToggles.removeCaseNotesFeature,
  nickname: state.users.current.userInfo.nickname
});

export default connect(mapStateToProps)(
  withStyles(styles, { withTheme: false })(ActivityMenu)
);
