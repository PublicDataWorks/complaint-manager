import React from 'react'
import BaseCaseDetailsCard from "../BaseCaseDetailsCard";
import {CardContent, TextField, Typography} from "material-ui";
import styles from '../../../globalStyling/styles'

const Attachments = () => {
    // const config = {
    //     postUrl: 'http://localhost:3000/cases/1/attachments'
    // }
    //
    // const eventHandlers = {
    //     canceled: () => console.log('file upload canceled'),
    //     success: (file, response) => console.log(response),
    //     complete: () => console.log('completed'),
    //     error: (file, errorMessage) => console.log('error message: ', errorMessage)
    // }
    //
    // const djsconfig = {
    //     addRemoveLinks: true,
    //     dictRemoveFileConfirmation: null
    // }

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