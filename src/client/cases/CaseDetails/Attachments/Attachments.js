import React from 'react'
import BaseCaseDetailsCard from "../BaseCaseDetailsCard";
import {CardContent, TextField, Typography} from "material-ui";
import styles from '../../../globalStyling/styles'
import Dropzone from "./Dropzone";

const Attachments = (props) => {
    return (
        <BaseCaseDetailsCard title='Attachments'>
            <CardContent>
                <div style={{display: 'flex', width: '100%'}}>
                    <div style={{flex: 1, textAlign: 'left'}}>
                        <Typography type='subheading'>
                            File
                        </Typography>
                    </div>
                    <div style={{flex: 1, textAlign: 'left'}}>
                        <Typography type='subheading'>
                            Description
                        </Typography>
                    </div>
                    <div style={{flex: 1}}/>
                </div>
                <div data-test="attachmentsField">
                    {
                        props.caseDetail.attachments && props.caseDetail.attachments.length > 0 ? props.caseDetail.attachments.map(attachment => (
                            <div
                                key={attachment.id}
                                style={{display: 'flex', width: '100%'}}
                                data-test="attachmentRow"
                            >
                                <div style={{flex: 1, textAlign: 'left'}}>
                                    <Typography type='body1'>
                                        {
                                            attachment.key.replace(`${attachment.caseId}/`, "")
                                        }
                                    </Typography>
                                </div>
                                <div style={{flex: 1, textAlign: 'left'}}>
                                    <Typography type='body1'>
                                    </Typography>
                                </div>
                                <div style={{flex: 1}}/>
                            </div>
                        )) : <div>
                            <Typography type='body1'>
                                No Attachments
                            </Typography>
                        </div>

                    }
                </div>
                <div>
                    <Typography style={styles.section}>
                        UPLOAD A FILE
                    </Typography>
                </div>
                <div style={{display: 'flex', width: '100%'}}>
                    <div style={{flex: 1}}>
                        <Dropzone caseId={props.caseDetail.id} dispatch={props.dispatch}/>
                    </div>
                    <div style={{flex: 1}}>
                        <TextField>

                        </TextField>
                    </div>
                    <div style={{flex: 1}}>
                    </div>
                </div>
            </CardContent>
        </BaseCaseDetailsCard>
    )
}

export default Attachments