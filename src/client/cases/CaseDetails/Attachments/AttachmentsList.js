import React, {Component} from 'react'
import {Dialog, DialogActions, DialogContent, DialogContentText, DialogTitle, Typography} from "material-ui";
import AttachmentsRow from "./AttachmentsRow";
import _ from "lodash"
import {CancelButton, SubmitButton} from "../../../sharedComponents/StyledButtons";

class AttachmentsList extends Component {

    constructor(props) {
        super(props)
        this.state = {
            dialogOpen: false,
            attachmentId: null,
            attachmentFileName: ''
        }
    }

    onRemoveAttachment = (attachmentId, attachmentFileName) => {
        this.setState({dialogOpen: true, attachmentId, attachmentFileName})
    }

    handleClose = () => {
        this.setState({dialogOpen: false})
    }

    handleDialogExit = () => {
        this.setState({attachmentId: null, attachmentFileName: ''})
    }

    render() {
        const {attachments} = this.props

        return (
            <div data-test="attachmentsField" style={{marginBottom: '48px'}}>
                {
                    attachments && attachments.length > 0
                        ? _.sortBy(attachments, obj => obj.fileName.toUpperCase()).map(attachment => (
                            <AttachmentsRow onRemoveAttachment={this.onRemoveAttachment} attachment={attachment}
                                            key={attachment.id}/>
                        ))
                        : (
                            <div>
                                <Typography type='body1'>
                                    No files are attached
                                </Typography>
                            </div>
                        )
                }
                <Dialog
                    maxWidth='sm'
                    fullWidth={true}
                    open={this.state.dialogOpen}
                    onExited={this.handleDialogExit}
                >
                    <DialogTitle>Remove Attachment</DialogTitle>
                    <DialogContent>
                        <Typography
                            data-test={'removeAttachmentText'}
                            type={'body1'}
                            style={{wordBreak: 'break-word'}}
                        >
                            Are you sure you wish to remove <strong>{this.state.attachmentFileName}</strong> from this case?
                        </Typography>
                    </DialogContent>
                    <DialogActions>
                        <CancelButton
                            onClick={this.handleClose}>
                            Cancel
                        </CancelButton>
                        <SubmitButton>
                            Remove
                        </SubmitButton>
                    </DialogActions>
                </Dialog>
            </div>
        )
    }
}

export default AttachmentsList