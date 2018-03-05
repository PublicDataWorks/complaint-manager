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
                <div>
                    <Typography style={styles.section}>
                        UPLOAD A FILE
                    </Typography>
                </div>
                <div style={{display: 'flex', width: '100%'}}>
                    <div style={{flex: 1}}>
                        <Dropzone caseId={props.caseDetail.id}/>
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