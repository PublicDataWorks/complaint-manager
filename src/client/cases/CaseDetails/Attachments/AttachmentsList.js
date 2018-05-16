import React, { Component } from "react";
import { Typography } from "material-ui";
import AttachmentsRow from "./AttachmentsRow";
import _ from "lodash";
import RemoveAttachmentConfirmationDialog from "./RemoveAttachmentConfirmationDialog";

class AttachmentsList extends Component {
  constructor(props) {
    super(props);
    this.state = {
      dialogOpen: false,
      attachmentFileName: ""
    };
  }

  onRemoveAttachment = (attachmentId, attachmentFileName) => {
    this.setState({ dialogOpen: true, attachmentFileName });
  };

  handleClose = () => {
    this.setState({ dialogOpen: false });
  };

  handleDialogExit = () => {
    this.setState({ attachmentFileName: "" });
  };

  render() {
    const { attachments } = this.props;

    return (
      <div data-test="attachmentsField" style={{ marginBottom: "48px" }}>
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
          dialogOpen={this.state.dialogOpen}
          handleDialogExit={this.handleDialogExit}
          handleClose={this.handleClose}
          removeAttachment={() => {
            this.props.removeAttachment(
              this.props.caseId,
              this.state.attachmentFileName,
              this.handleClose
            );
          }}
          attachmentFileName={this.state.attachmentFileName}
        />
      </div>
    );
  }
}

export default AttachmentsList;
