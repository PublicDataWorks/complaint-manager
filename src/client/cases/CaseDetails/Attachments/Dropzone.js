import React from 'react'
import DropzoneComponent from 'react-dropzone-component'
import '../../../../../node_modules/react-dropzone-component/styles/filepicker.css'
import '../../../../../node_modules/dropzone/dist/min/dropzone.min.css'
import config from '../../../config/config'
import getAccessToken from "../../../auth/getAccessToken";
import { uploadAttachmentSuccess } from "../../../actionCreators/casesActionCreators";
import { FormHelperText } from "material-ui/Form";
import { connect } from "react-redux";
import { fileTypeInvalid, invalidFileTypeRemoved } from "../../../actionCreators/attachmentsActionCreators";

const Dropzone = (props) => {
    const dropZoneComponentConfig = {
        postUrl: `${config[process.env.NODE_ENV].hostname}/cases/${props.caseId}/attachments`,
    }

    const eventHandlers = {
        success: (file, response) => props.dispatch(uploadAttachmentSuccess(response)),
        error: (file, errorMessage) => errorMessage === 'File type invalid' && props.dispatch(fileTypeInvalid()),
        removedfile: (file) => props.dispatch(invalidFileTypeRemoved())
    }

    const djsconfig = {
        addRemoveLinks: true,
        maxFiles: 1,
        headers: {
            Authorization: `Bearer ${getAccessToken()}`
        },
        acceptedFiles: 'application/pdf,audio/mp3,video/mp4,application/msword,application/vnd.openxmlformats-officedocument.wordprocessingml.document,image/jpeg',
        dictInvalidFileType: 'File type invalid'
    }

    return (
        <div>
            <DropzoneComponent
                config={dropZoneComponentConfig}
                djsConfig={djsconfig}
                eventHandlers={eventHandlers}
            />
            { props.invalidFileMessageVisible && invalidFileMarkup }
        </div>
    )
}

const invalidFileMarkup = (
    <FormHelperText
        data-test='invalidFileTypeErrorMessage'
        error={true}
    >
        File type not supported.
    </FormHelperText>
)


const mapStateToProps = (state) => ({
    invalidFileMessageVisible: state.ui.attachments.invalidFileMessageVisible
})

export default connect(mapStateToProps)(Dropzone)