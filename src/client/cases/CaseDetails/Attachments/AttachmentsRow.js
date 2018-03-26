import React from 'react'
import {Divider, Typography} from "material-ui";
import styles from "../../../globalStyling/styles";
import FileSaver from "file-saver";
import getAccessToken from "../../../auth/getAccessToken";
import LinkButton from "../../../sharedComponents/LinkButton";

const AttachmentsRow = ({attachment, onRemoveAttachment}) => {
    const downloadAttachment = async () => {
        try {
            const response = await fetch(`/api/cases/${attachment.caseId}/attachments/${attachment.fileName}`, {
                headers: {
                    'Authorization': `Bearer ${getAccessToken()}`
                }
            })

            if (response.status === 200) {
                const blob = await response.blob()
                const fileToDownload = new File([blob], attachment.fileName)
                FileSaver.saveAs(fileToDownload, attachment.fileName)
            }
            else {
                console.log(response.status)
            }
        }
        catch (e) {
            console.log(e)
        }
    }

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
                        onClick={downloadAttachment}
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