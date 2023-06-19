import {
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Typography
} from "@material-ui/core";
import React from "react";
import {
  PrimaryButton,
  SecondaryButton
} from "../../../shared/components/StyledButtons";
import { push } from "connected-react-router";
import { connect } from "react-redux";

const CancelEditLetterConfirmationDialog = ({
  open,
  dispatch,
  shouldBlockRoutingRedirects,
  redirectUrl,
  closeDialog
}) => {
  return (
    <Dialog open={open} fullWidth={true}>
      <DialogTitle data-testid="cancel-edit-letter-dialog">
        Cancel Editing Letter
      </DialogTitle>
      <DialogContent>
        <Typography data-testid="warningText">
          This action will discard any edits made to the letter.
        </Typography>
      </DialogContent>
      <DialogActions>
        <SecondaryButton
          onClick={() => {
            closeDialog();
          }}
          data-testid="continueEditingButton"
        >
          Continue Editing
        </SecondaryButton>
        <PrimaryButton
          data-testid="discardEditsButton"
          onClick={() => {
            console.log("Discard edits redirect url", redirectUrl);
            shouldBlockRoutingRedirects(false);
            dispatch(push(redirectUrl));
            closeDialog();
          }}
        >
          Discard Edits
        </PrimaryButton>
      </DialogActions>
    </Dialog>
  );
};

export default connect()(CancelEditLetterConfirmationDialog);
