import React from 'react'
import {Typography} from "material-ui";
import styles from "../../../globalStyling/styles";

const AttachmentsRow = ({attachment}) => {
    const downloadAttachment = () => {
        //fetch to download endpoint
        //response to blob
        //blob to file
        //use FileSaver.save() to initiate download
        //test this in... nightwatch?
        console.log(`${attachment.key} was clicked... now let's download it`)
    }

    const formattedName = attachment.key.replace(`${attachment.caseId}/`, "")

    return (
        <div
            key={attachment.id}
            style={{display: 'flex', width: '100%'}}
            data-test="attachmentRow"
        >
            <div style={{flex: 1, textAlign: 'left', marginRight: '10px'}}>
                <Typography style={styles.link} onClick={ downloadAttachment }>
                    {
                        formattedName
                    }
                </Typography>
            </div>
            <div style={{flex: 1, textAlign: 'left'}}>
                <Typography type='body1'>
                </Typography>
            </div>
            <div style={{flex: 1}}/>
        </div>)
}

export default AttachmentsRow