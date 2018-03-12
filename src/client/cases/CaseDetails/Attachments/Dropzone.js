import React from 'react'
import DropzoneComponent from 'react-dropzone-component'
import '../../../../../node_modules/react-dropzone-component/styles/filepicker.css'
import '../../../../../node_modules/dropzone/dist/min/dropzone.min.css'
import config from '../../../config/config'
import getAccessToken from "../../../auth/getAccessToken";
import {uploadAttachmentSuccess} from "../../../actionCreators/casesActionCreators";
import {connect} from "react-redux";
import {
    dropDuplicateFile, dropInvalidFileType,
    removeDropzoneFile
} from "../../../actionCreators/attachmentsActionCreators";
import {FILE_TYPE_INVALID, DUPLICATE_FILE_NAME} from "../../../../sharedUtilities/constants";
import {FormHelperText} from "material-ui";

const Dropzone = (props) => {
    const dropZoneComponentConfig = {
        postUrl: `${config[process.env.NODE_ENV].hostname}/cases/${props.caseId}/attachments`,
    }

    const eventHandlers = {
        success: function (file, response) {
            props.dispatch(uploadAttachmentSuccess(response))
            this.removeFile(file)
        },
        error: (file, errorMessage, xhr) => {
            switch (errorMessage) {
                case FILE_TYPE_INVALID:
                    props.dispatch(dropInvalidFileType())
                    break
                case DUPLICATE_FILE_NAME:
                    props.dispatch(dropDuplicateFile())
                    break
                default:
                    break
            }
        },
        removedfile: (file) => props.dispatch(removeDropzoneFile())
    }

    const djsconfig = {
        addRemoveLinks: true,
        maxFiles: 1,
        headers: {
            Authorization: `Bearer ${getAccessToken()}`
        },
        acceptedFiles: 'application/pdf,audio/mp3,video/mp4,application/msword,application/vnd.openxmlformats-officedocument.wordprocessingml.document,image/jpeg',
        dictInvalidFileType: FILE_TYPE_INVALID
    }

    return (
        <div>
            <DropzoneComponent
                config={dropZoneComponentConfig}
                djsConfig={djsconfig}
                eventHandlers={eventHandlers}
            />
            {(props.errorMessage !== '') && invalidFileMarkup(props.errorMessage)}
        </div>
    )
}

const invalidFileMarkup = (errorMessage) => (
    <FormHelperText
        data-test='invalidFileTypeErrorMessage'
        error={true}
    >
        {errorMessage}
    </FormHelperText>
)


const mapStateToProps = (state) => ({
    errorMessage: state.ui.attachments.errorMessage
})

export default connect(mapStateToProps)(Dropzone)