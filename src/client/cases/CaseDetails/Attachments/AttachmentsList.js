import React from 'react'
import {Typography} from "material-ui";
import AttachmentsRow from "./AttachmentsRow";

const AttachmentsList = ({ attachments }) => (
    <div data-test="attachmentsField" style={{marginBottom: '8px'}}>
        {
            attachments && attachments.length > 0 ? attachments.map(attachment => (
                <AttachmentsRow attachment={attachment} key={attachment.id}/>
            )) : <div>
                <Typography type='body1'>
                    No Attachments
                </Typography>
            </div>

        }
    </div>
)

export default AttachmentsList