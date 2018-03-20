import React from 'react'
import { Typography } from "material-ui";
import styles from "../../../globalStyling/styles";
import FileSaver from "file-saver";
import getAccessToken from "../../../auth/getAccessToken";

const AttachmentsRow = ({ attachment }) => {
    const downloadAttachment = async () => {
        try {
            const response = await fetch(`/cases/${attachment.caseId}/attachments/${attachment.fileName}`, {
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
        <div
            key={attachment.id}
            style={{ display: 'flex', width: '100%' }}
            data-test="attachmentRow"
        >
            <div style={{ flex: 1, textAlign: 'left', marginRight: '10px', marginBottom: '8px' }}>
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
            <div style={{ flex: 1, textAlign: 'left' }}>
                <Typography
                    type='body1'
                    data-test="attachmentDescription"
                >
                    {
                        attachment.description
                    }
                </Typography>
            </div>
            <div style={{ flex: 1 }}/>
        </div>)
}

export default AttachmentsRow