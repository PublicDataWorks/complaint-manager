import React from "react";
import {
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Typography
} from "@material-ui/core";
import { connect } from "react-redux";
import { push } from "react-router-redux";
import {
  SecondaryButton,
  PrimaryButton
} from "../../../shared/components/StyledButtons";
import { closeEditLetterConfirmationDialog } from "../../../actionCreators/letterActionCreators";

const EditLetterConfirmationDialog = ({ open, dispatch, caseId }) => {
  return (
    <Dialog open={open}>
      <DialogTitle>Edit Letter</DialogTitle>
      <DialogContent>
        <Typography data-test="warningText">
          This action will allow you to make edits to the system generated
          letter. Your custom edited letter will replace your current version.{" "}
          <strong>You cannot undo this action.</strong>
          <br />
          <br />
          Would you like to continue?
        </Typography>
      </DialogContent>
      <DialogActions>
        <SecondaryButton
          onClick={() => {
            dispatch(closeEditLetterConfirmationDialog());
          }}
          data-test="cancelButton"
        >
          Cancel
        </SecondaryButton>
        <PrimaryButton
          data-test="editLetterButton"
          onClick={() => {
            dispatch(push(`/cases/${caseId}/letter/edit-letter`));
          }}
        >
          Edit Letter
        </PrimaryButton>
      </DialogActions>
    </Dialog>
  );
};

const mapStateToProps = state => ({
  open: state.ui.editLetterConfirmationDialog.open
});

export default connect(mapStateToProps)(EditLetterConfirmationDialog);
