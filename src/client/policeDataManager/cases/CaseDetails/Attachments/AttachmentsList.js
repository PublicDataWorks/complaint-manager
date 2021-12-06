import React, { Component, lazy, Suspense } from "react";
import { Typography } from "@material-ui/core";
import AttachmentsRow from "./AttachmentsRow";
import _ from "lodash";
import { connect } from "react-redux";
import {
  closeRemoveAttachmentConfirmationDialog,
  exitedRemoveAttachmentConfirmationDialog,
  openRemoveAttachmentConfirmationDialog
} from "../../../actionCreators/casesActionCreators";
import removeAttachment from "../../thunks/removeAttachment";
const RemoveAttachmentConfirmationDialog = lazy(() =>
  import("./RemoveAttachmentConfirmationDialog")
);

class AttachmentsList extends Component {
  onRemoveAttachment = (attachmentId, attachmentFileName) => {
    this.props.openRemoveAttachmentConfirmationDialog(attachmentFileName);
  };

  handleClose = () => {
    this.props.closeRemoveAttachmentConfirmationDialog();
  };

  handleDialogExit = () => {
    this.props.exitedRemoveAttachmentConfirmationDialog();
  };

  render() {
    const { attachments } = this.props;

    return (
      <div data-testid="attachmentsField">
        {attachments && attachments.length > 0 ? (
          _.sortBy(attachments, obj => obj.fileName.toUpperCase()).map(
            attachment => (
              <AttachmentsRow
                onRemoveAttachment={this.onRemoveAttachment}
                attachment={attachment}
                key={attachment.id}
              />
            )
          )
        ) : (
          <div>
            <Typography variant="body2" data-testid="noAttachmentsText">
              No files are attached
            </Typography>
          </div>
        )}
        <Suspense
          fallback={() => <CircularProgress data-testid="spinner" size={30} />}
        >
          <RemoveAttachmentConfirmationDialog
            dialogOpen={this.props.open}
            handleDialogExit={this.handleDialogExit}
            handleClose={this.handleClose}
            removeAttachment={() => {
              this.props.removeAttachment(
                this.props.caseId,
                this.props.attachmentFileName,
                this.handleClose
              );
            }}
            attachmentFileName={this.props.attachmentFileName}
          />
        </Suspense>
      </div>
    );
  }
}

const mapStateToProps = state => ({
  caseId: state.currentCase.details.id,
  attachments: state.currentCase.details.attachments,
  open: state.ui.removeAttachmentConfirmationDialog.dialogOpen,
  attachmentFileName:
    state.ui.removeAttachmentConfirmationDialog.attachmentFileName
});

const mapDispatchToProps = {
  removeAttachment,
  openRemoveAttachmentConfirmationDialog,
  closeRemoveAttachmentConfirmationDialog,
  exitedRemoveAttachmentConfirmationDialog
};

export default connect(mapStateToProps, mapDispatchToProps)(AttachmentsList);
