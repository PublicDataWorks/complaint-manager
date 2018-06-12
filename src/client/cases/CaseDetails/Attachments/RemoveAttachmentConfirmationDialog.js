import React from "react";
import {
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Typography
} from "@material-ui/core";
import {
  SecondaryButton,
  PrimaryButton
} from "../../../shared/components/StyledButtons";

class RemoveAttachmentConfirmationDialog extends React.Component {
  render() {
    return (
      <Dialog
        maxWidth="sm"
        fullWidth={true}
        open={this.props.dialogOpen}
        onExited={this.props.handleDialogExit}
      >
        <DialogTitle>Remove Attachment</DialogTitle>
        <DialogContent>
          <Typography
            data-test={"removeAttachmentText"}
            variant={"body1"}
            style={{ wordBreak: "break-word" }}
          >
            Are you sure you wish to remove{" "}
            <strong>{this.props.attachmentFileName}</strong> from this case?
          </Typography>
        </DialogContent>
        <DialogActions>
          <SecondaryButton onClick={this.props.handleClose}>
            Cancel
          </SecondaryButton>
          <PrimaryButton
            data-test="confirmRemoveAttachmentButton"
            onClick={this.props.removeAttachment}
          >
            Remove
          </PrimaryButton>
        </DialogActions>
      </Dialog>
    );
  }
}

export default RemoveAttachmentConfirmationDialog;
