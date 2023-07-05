import React, { Component } from "react";
import { connect } from "react-redux";
import { reduxForm } from "redux-form";
import { REMOVE_CASE_TAG_FORM_NAME } from "../../../../../sharedUtilities/constants";
import {
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Typography
} from "@material-ui/core";
import {
  PrimaryButton,
  SecondaryButton
} from "../../../shared/components/StyledButtons";
import removeCaseTag from "../../thunks/removeCaseTag";

class RemoveCaseTagDialog extends Component {
  render() {
    const {
      dialogOpen,
      closeDialog,
      caseTagName,
      caseTagId,
      caseId,
      dispatch,
      submitting
    } = this.props;

    return (
      <Dialog open={dialogOpen} fullWidth={true}>
        <div>
          {this.props.isArchived ? (
            <DialogTitle data-testid="removeCaseTagDialogTitle">
              Cannot Remove Case Tag
            </DialogTitle>
          ) : (
            <DialogTitle data-testid="removeCaseTagDialogTitle">
              Remove Case Tag
            </DialogTitle>
          )}
        </div>
        <DialogContent>
          {this.props.isArchived ? (
            <Typography style={{ marginBottom: "24px" }}>
              This case has been archived. Changes to tags are not allowed while
              case is archived.
            </Typography>
          ) : (
            <Typography style={{ marginBottom: "24px" }}>
              This action will remove the <b>{caseTagName}</b> tag from the
              case. Are you sure you want to continue?
            </Typography>
          )}
          <div />
        </DialogContent>
        <DialogActions
          style={{
            padding: "0px 24px 16px 24px",
            marginLeft: "0",
            marginRight: "0",
            justifyContent: "space-between"
          }}
        >
          {this.props.isArchived ? (
            <div />
          ) : (
            <SecondaryButton
              style={{
                marginLeft: "0px"
              }}
              data-testid="cancelButton"
              onClick={() => closeDialog()}
            >
              Cancel
            </SecondaryButton>
          )}

          {this.props.isArchived ? (
            <PrimaryButton
              data-testid="returnButton"
              onClick={() => closeDialog()}
            >
              Return
            </PrimaryButton>
          ) : (
            <PrimaryButton
              data-testid="removeCaseTag"
              onClick={() => {
                dispatch(removeCaseTag(caseId, caseTagId));
                closeDialog();
              }}
              disabled={submitting}
            >
              Remove
            </PrimaryButton>
          )}
        </DialogActions>
      </Dialog>
    );
  }
}

const RemoveCaseTagDialogForm = reduxForm({
  form: REMOVE_CASE_TAG_FORM_NAME
})(RemoveCaseTagDialog);

const mapStateToProps = state => ({
  isArchived: state.currentCase.details.isArchived
});

export default connect(mapStateToProps)(RemoveCaseTagDialogForm);
