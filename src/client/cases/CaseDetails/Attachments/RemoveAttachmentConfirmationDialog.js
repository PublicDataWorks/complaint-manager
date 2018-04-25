import React from 'react';
import {Dialog, DialogActions, DialogContent, DialogTitle, Typography} from "material-ui";
import {CancelButton, SubmitButton} from "../../../sharedComponents/StyledButtons";

class RemoveAttachmentConfirmationDialog extends React.Component {

    render() {
        return (
            <Dialog
                maxWidth='sm'
                fullWidth={true}
                open={this.props.dialogOpen}
                onExited={this.props.handleDialogExit}
            >
                <DialogTitle>Remove Attachment</DialogTitle>
                <DialogContent>
                    <Typography
                        data-test={'removeAttachmentText'}
                        variant={'body1'}
                        style={{wordBreak: 'break-word'}}
                    >
                        Are you sure you wish to remove <strong>{this.props.attachmentFileName}</strong> from this case?
                    </Typography>
                </DialogContent>
                <DialogActions>
                    <CancelButton
                        onClick={this.props.handleClose}>
                        Cancel
                    </CancelButton>
                    <SubmitButton
                        data-test='confirmRemoveAttachmentButton'
                        onClick={this.props.removeAttachment}
                    >
                        Remove
                    </SubmitButton>
                </DialogActions>
            </Dialog>

        )
    }
}

export default RemoveAttachmentConfirmationDialog