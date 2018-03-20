import React, { Component } from 'react'
import DropzoneComponent from 'react-dropzone-component'
import '../../../../../node_modules/react-dropzone-component/styles/filepicker.css'
import '../../../../../node_modules/dropzone/dist/min/dropzone.min.css'
import config from '../../../config/config'
import getAccessToken from "../../../auth/getAccessToken";
import { DUPLICATE_FILE_NAME, FILE_TYPE_INVALID, UPLOAD_CANCELED } from "../../../../sharedUtilities/constants";
import { FormHelperText } from "material-ui";
import { SubmitButton } from "../../../sharedComponents/StyledButtons";
import TextField from 'material-ui/TextField'

class Dropzone extends Component {
    componentWillMount() {
        this.props.removeDropzoneFile()
    }

    state = {
        attachmentValid: false,
        attachmentDescription: ''
    }

    dropZoneComponentConfig = {
        postUrl: `${config[process.env.NODE_ENV].hostname}/cases/${this.props.caseId}/attachments`,
    }

    eventHandlers = {
        init: (dropzone) => {
            this.dropzone = dropzone
        },
        addedfile: () => {
            this.setState({ attachmentValid: true })
        },
        success: (file, response) => {
            this.props.uploadAttachmentSuccess(response)
            this.dropzone.removeFile(file)
            this.setState({ attachmentDescription: '' })
        },
        error: (file, errorMessage, xhr) => {
            this.setState({ attachmentValid: false })

            switch (errorMessage) {
                case FILE_TYPE_INVALID:
                    this.props.dropInvalidFileType()
                    break
                case DUPLICATE_FILE_NAME:
                    this.props.dropDuplicateFile()
                    break
                case UPLOAD_CANCELED:
                    break
                default:
                    this.props.uploadAttachmentFailed()
            }
        },
        removedfile: (file) => {
            this.props.removeDropzoneFile()
            this.setState({ attachmentValid: false })
        },
        sending: (file, xhr, formData) => {
            formData.append('description', this.state.attachmentDescription);
        }
    }

    djsconfig = {
        addRemoveLinks: true,
        autoProcessQueue: false,
        maxFiles: 1,
        headers: {
            Authorization: `Bearer ${getAccessToken()}`
        },
        acceptedFiles: 'application/pdf,audio/mpeg,audio/mp3,video/mp4,application/msword,application/vnd.openxmlformats-officedocument.wordprocessingml.document,image/jpeg',
        dictInvalidFileType: FILE_TYPE_INVALID,
        dictUploadCanceled: UPLOAD_CANCELED,
        dictDefaultMessage: "Drag and drop or click",
        maxFilesize: 5000,
        timeout: Infinity,
    }

    uploadAttachment = () => {
        this.setState({ attachmentValid: true })
        this.dropzone.processQueue()
    }

    updateDescription = (event) => {
        this.setState({ attachmentDescription: event.target.value })
    }

    render() {
        return (
            <div style={{display: 'flex', width: '100%'}}>
                <div style={{flex: 1, marginRight: '10px'}}>
                    <DropzoneComponent
                        config={this.dropZoneComponentConfig}
                        djsConfig={this.djsconfig}
                        eventHandlers={this.eventHandlers}
                    />
                    {(this.props.errorMessage !== '') && this.invalidFileMarkup(this.props.errorMessage)}
                </div>
                <div style={{flex: 1}}>
                    <TextField
                        value={this.state.attachmentDescription}
                        data-test='attachmentDescriptionField'
                        inputProps={{
                            'data-test':"attachmentDescriptionInput"
                        }}
                        onChange={this.updateDescription}
                    />
                </div>
                <div style={{alignSelf: 'flex-end'}}>
                    <SubmitButton
                        style={{flex: 1}}
                        onClick={this.uploadAttachment}
                        data-test="attachmentUploadButton"
                        disabled={
                            !this.state.attachmentValid || !Boolean(this.state.attachmentDescription)
                        }
                    >
                        Upload
                    </SubmitButton>
                </div>
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

export default Dropzone