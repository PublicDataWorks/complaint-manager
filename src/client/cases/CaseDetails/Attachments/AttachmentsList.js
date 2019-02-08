import React, { Component } from "react";
import { Typography } from "@material-ui/core";
import AttachmentsRow from "./AttachmentsRow";
import _ from "lodash";
import RemoveAttachmentConfirmationDialog from "./RemoveAttachmentConfirmationDialog";
import { connect } from "react-redux";
import {
  closeRemoveAttachmentConfirmationDialog,
  exitedRemoveAttachmentConfirmationDialog,
  openRemoveAttachmentConfirmationDialog
} from "../../../actionCreators/casesActionCreators";
import removeAttachment from "../../thunks/removeAttachment";

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
      <div data-test="attachmentsField">
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
            <Typography variant="body1" data-test="noAttachmentsText">
              No files are attached
            </Typography>
          </div>
        )}
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

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(AttachmentsList);
