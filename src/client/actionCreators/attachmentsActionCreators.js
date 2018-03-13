import {
    DROPZONE_FILE_REMOVED, DUPLICATE_FILE_DROPPED,
    INVALID_FILE_TYPE_DROPPED
} from "../../sharedUtilities/constants";

export const dropInvalidFileType = () => ({
    type: INVALID_FILE_TYPE_DROPPED
})

export const dropDuplicateFile = () => ({
    type: DUPLICATE_FILE_DROPPED
})

export const removeDropzoneFile = () => ({
    type: DROPZONE_FILE_REMOVED
})