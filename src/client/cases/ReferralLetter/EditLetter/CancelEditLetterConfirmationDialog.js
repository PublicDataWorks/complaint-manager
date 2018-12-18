import {
  Dialog,
  DialogActions,
  Typography,
  DialogTitle,
  DialogContent
} from "@material-ui/core";
import React from "react";
import {
  PrimaryButton,
  SecondaryButton
} from "../../../shared/components/StyledButtons";
import { closeCancelEditLetterConfirmationDialog } from "../../../actionCreators/letterActionCreators";
import { push } from "connected-react-router";
import { connect } from "react-redux";

const CancelEditLetterConfirmationDialog = ({ open, dispatch, caseId }) => {
  return (
    <Dialog open={open} fullWidth={true}>
      <DialogTitle data-test="cancel-edit-letter-dialog">
        Cancel Editing Letter
      </DialogTitle>
      <DialogContent>
        <Typography data-test="warningText">
          This action will discard any edits made to the letter.
        </Typography>
      </DialogContent>
      <DialogActions>
        <SecondaryButton
          onClick={() => {
            dispatch(closeCancelEditLetterConfirmationDialog());
          }}
          data-test="continueEditingButton"
        >
          Continue Editing
        </SecondaryButton>
        <PrimaryButton
          data-test="discardEditsButton"
          onClick={() => {
            dispatch(push(`/cases/${caseId}/letter/letter-preview`));
            dispatch(closeCancelEditLetterConfirmationDialog());
          }}
        >
          Discard Edits
        </PrimaryButton>
      </DialogActions>
    </Dialog>
  );
};

const mapStateToProps = state => ({
  open: state.ui.cancelEditLetterConfirmationDialog.open
});

export default connect(mapStateToProps)(CancelEditLetterConfirmationDialog);
