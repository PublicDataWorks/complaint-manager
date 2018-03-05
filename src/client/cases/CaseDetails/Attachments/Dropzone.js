import React from 'react'
import DropzoneComponent from 'react-dropzone-component'
import '../../../../../node_modules/react-dropzone-component/styles/filepicker.css'
import '../../../../../node_modules/dropzone/dist/min/dropzone.min.css'
import config from '../../../config/config'
import getAccessToken from "../../../auth/getAccessToken";

const Dropzone = (props) => {
    let dropzone

    const dropZoneComponentConfig = {
        postUrl: `${config[process.env.NODE_ENV].hostname}/cases/${props.caseId}/attachments`,
    }

    const eventHandlers = {
    }

    const djsconfig = {
        addRemoveLinks: true,
        maxFiles: 1,
        headers: {
            Authorization: `Bearer ${getAccessToken()}`
        },
        acceptedFiles: 'application/pdf,audio/mp3,video/mp4,application/msword,application/vnd.openxmlformats-officedocument.wordprocessingml.document,image/jpeg'
    }

    return (
        <DropzoneComponent
            config={dropZoneComponentConfig}
            djsConfig={djsconfig}
            eventHandlers={eventHandlers}
        />
    )
}

export default Dropzone