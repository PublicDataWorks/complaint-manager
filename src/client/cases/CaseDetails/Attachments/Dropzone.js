import React, { Component } from 'react'
import DropzoneComponent from 'react-dropzone-component'
import '../../../../../node_modules/react-dropzone-component/styles/filepicker.css'
import '../../../../../node_modules/dropzone/dist/min/dropzone.min.css'
import config from '../../../config/config'
import getAccessToken from "../../../auth/getAccessToken";
import { uploadAttachmentFailed, uploadAttachmentSuccess } from "../../../actionCreators/casesActionCreators";
import {connect} from "react-redux";
import {
    dropDuplicateFile, dropInvalidFileType,
    removeDropzoneFile
} from "../../../actionCreators/attachmentsActionCreators";
import {FILE_TYPE_INVALID, DUPLICATE_FILE_NAME, UPLOAD_CANCELED} from "../../../../sharedUtilities/constants";
import {FormHelperText} from "material-ui";

class Dropzone extends Component {
    componentWillMount() {
        this.props.dispatch(removeDropzoneFile())
    }

    dropZoneComponentConfig = {
        postUrl: `${config[process.env.NODE_ENV].hostname}/cases/${this.props.caseId}/attachments`,
    }

    eventHandlers = {
        init: (dropzone) => { this.dropzone = dropzone },
        success: (file, response) => {
            this.props.dispatch(uploadAttachmentSuccess(response))
            this.dropzone.removeFile(file)
        },
        error: (file, errorMessage, xhr) => {
            switch (errorMessage) {
                case FILE_TYPE_INVALID:
                    this.props.dispatch(dropInvalidFileType())
                    break
                case DUPLICATE_FILE_NAME:
                    this.props.dispatch(dropDuplicateFile())
                    break
                case UPLOAD_CANCELED:
                    break
                default:
                    this.props.dispatch(uploadAttachmentFailed())
            }
        },
        removedfile: (file) => this.props.dispatch(removeDropzoneFile())
    }

    djsconfig = {
        addRemoveLinks: true,
        maxFiles: 1,
        headers: {
            Authorization: `Bearer ${getAccessToken()}`
        },
        acceptedFiles: 'application/pdf,audio/mp3,video/mp4,application/msword,application/vnd.openxmlformats-officedocument.wordprocessingml.document,image/jpeg',
        dictInvalidFileType: FILE_TYPE_INVALID,
        dictUploadCanceled: UPLOAD_CANCELED
    }

    render() {
        return (
            <div>
                <DropzoneComponent
                    config={this.dropZoneComponentConfig}
                    djsConfig={this.djsconfig}
                    eventHandlers={this.eventHandlers}
                />
                {(this.props.errorMessage !== '') && this.invalidFileMarkup(this.props.errorMessage)}
            </div>
        )
    }

    invalidFileMarkup(errorMessage) {
        return (
            <FormHelperText
                data-test='invalidFileTypeErrorMessage'
                error={true}
            >
                {errorMessage}
            </FormHelperText>
        )
    }
}

const mapStateToProps = (state) => ({
    errorMessage: state.ui.attachments.errorMessage
})

export default connect(mapStateToProps)(Dropzone)