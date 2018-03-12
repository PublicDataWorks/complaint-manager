import React from 'react'
import {Typography} from "material-ui";
import styles from "../../../globalStyling/styles";

const AttachmentsRow = ({attachment}) => {
    return (
        <div
            key={attachment.id}
            style={{display: 'flex', width: '100%'}}
            data-test="attachmentRow"
        >
            <div style={{flex: 1, textAlign: 'left', marginRight: '10px'}}>
                <Typography style={styles.link}>
                    {
                        attachment.fileName
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