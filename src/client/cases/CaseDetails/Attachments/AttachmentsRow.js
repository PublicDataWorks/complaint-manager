import React from 'react'
import {Divider, Typography} from "material-ui";
import styles from "../../../globalStyling/styles";
import LinkButton from "../../../sharedComponents/LinkButton";
import downloader from "../../../utilities/downloader"

const AttachmentsRow = ({attachment, onRemoveAttachment}) => {
    return (
        <div>
            <div
                key={attachment.id}
                style={{display: 'flex', width: '100%', marginBottom: '8px', wordBreak: 'break-word'}}
                data-test="attachmentRow"
            >
                <div style={{flex: 1, textAlign: 'left', marginRight: '32px'}}>
                    <Typography
                        data-test="attachmentName"
                        style={{
                            ...styles.link,
                            cursor: "pointer"
                        }}
                        onClick={() => downloader(`/api/cases/${attachment.caseId}/attachments/${attachment.fileName}`, attachment.fileName)}
                    >
                        {
                            attachment.fileName
                        }
                    </Typography>
                </div>
                <div style={{flex: 1, textAlign: 'left', marginRight: '16px'}}>
                    <Typography
                        type='body1'
                        data-test="attachmentDescription"
                    >
                        {
                            attachment.description
                        }
                    </Typography>
                </div>
                <div>
                    <LinkButton
                        data-test={"removeAttachmentButton"}
                        onClick={()=>{onRemoveAttachment(attachment.id, attachment.fileName)}}
                    >
                        Remove
                    </LinkButton>
                </div>
            </div>
            <Divider style={{marginBottom: '8px'}}/>
        </div>
    )
}

export default AttachmentsRow