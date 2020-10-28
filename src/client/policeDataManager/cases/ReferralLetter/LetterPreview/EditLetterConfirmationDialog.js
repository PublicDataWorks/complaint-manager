import React from "react";
import {
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Typography
} from "@material-ui/core";
import { connect } from "react-redux";
import {
  PrimaryButton,
  SecondaryButton
} from "../../../shared/components/StyledButtons";
import { closeEditLetterConfirmationDialog } from "../../../actionCreators/letterActionCreators";

const EditLetterConfirmationDialog = ({
  open,
  dispatch,
  saveAndGoToEditLetterCallback
}) => {
  return (
    <Dialog open={open}>
      <DialogTitle>Edit Letter</DialogTitle>
      <DialogContent>
        <Typography data-testid="warningText">
          This action will allow you to make edits to the system generated
          letter. Once saved, your custom edited letter will replace the current
          version. <strong>You cannot undo this action.</strong>
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
          data-testid="cancelButton"
        >
          Cancel
        </SecondaryButton>
        <PrimaryButton
          data-testid="edit-letter-button"
          onClick={() => {
            saveAndGoToEditLetterCallback();
            dispatch(closeEditLetterConfirmationDialog());
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
