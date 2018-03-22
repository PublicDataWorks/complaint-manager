import React from 'react'
import BaseCaseDetailsCard from "../BaseCaseDetailsCard";
import {CardContent, Typography} from "material-ui";
import styles from '../../../globalStyling/styles'
import DropzoneContainer from "./DropzoneContainer";
import AttachmentsListContainer from "./AttachmentsListContainer";

const Attachments = (props) => {
    return (
        <BaseCaseDetailsCard title='Attachments'>
            <CardContent style={{paddingBottom: '16px'}}>
                <div style={{display: 'flex', width: '100%'}}>
                    <div style={{flex: 1, textAlign: 'left', marginRight: '32px', marginBottom: '8px'}}>
                        <Typography style={styles.section}>
                            File Name
                        </Typography>
                    </div>
                    <div style={{flex: 1, textAlign: 'left', marginRight: '112px'}}>
                        <Typography style={styles.section}>
                            Description
                        </Typography>
                    </div>
                </div>
                <AttachmentsListContainer/>
                <div>
                    <Typography style={styles.section}>
                        UPLOAD A FILE
                    </Typography>
                    <Typography type="caption" style={{marginBottom: "16px"}}>
                        Accepted file types: .pdf, .mp3, .mp4, .doc, .docx, .jpeg, .jpg
                    </Typography>
                </div>
                <DropzoneContainer/>
            </CardContent>
        </BaseCaseDetailsCard>
    )
}

export default Attachments