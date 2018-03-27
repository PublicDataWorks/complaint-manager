import {
    DROPZONE_FILE_REMOVED,
    DUPLICATE_FILE_DROPPED,
    REMOVE_ATTACHMENT_FAILED,
    REMOVE_ATTACHMENT_SUCCESS
} from "../../sharedUtilities/constants";

export const dropDuplicateFile = () => ({
    type: DUPLICATE_FILE_DROPPED
})

export const removeDropzoneFile = () => ({
    type: DROPZONE_FILE_REMOVED
})

export const removeAttachmentSuccess = (caseDetails) => ({
    type: REMOVE_ATTACHMENT_SUCCESS,
    caseDetails
})

export const removeAttachmentFailed = () => ({
    type: REMOVE_ATTACHMENT_FAILED
})