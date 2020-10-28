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
import { closeCancelEditLetterConfirmationDialog } from "../../../actionCreators/letterActionCreators";
import { push } from "connected-react-router";
import { connect } from "react-redux";

const CancelEditLetterConfirmationDialog = ({
  open,
  dispatch,
  shouldBlockRoutingRedirects,
  redirectUrl
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
            dispatch(closeCancelEditLetterConfirmationDialog());
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
