// ----------------------------------------
//          Action Types
// ----------------------------------------
const INVALID_FILE_TYPE_DROPPED = 'INVALID_FILE_TYPE_DROPPED'
const DUPLICATE_FILE_DROPPED = 'DUPLICATE_FILE_DROPPED'
const DROPZONE_FILE_REMOVED = 'DROPZONE_FILE_REMOVED'

const CASE_CREATED_SUCCESS = 'CASE_CREATED_SUCCESS'
const ATTACHMENT_UPLOAD_SUCCEEDED = 'ATTACHMENT_UPLOAD_SUCCEEDED'
const ATTACHMENT_UPLOAD_FAILED = 'ATTACHMENT_UPLOAD_FAILED'

const CIVILIAN_DIALOG_OPENED = 'CIVILIAN_DIALOG_OPENED'

// ----------------------------------------
//          Attachment Errors
// ----------------------------------------
const FILE_TYPE_INVALID = 'File type invalid'
const DUPLICATE_FILE_NAME = 'Duplicate file name'
const UPLOAD_CANCELED = "Upload canceled."

// ----------------------------------------
//          Attachment Removal
// ----------------------------------------

const REMOVE_ATTACHMENT_SUCCESS = 'REMOVE_ATTACHMENT_SUCCESS'
const REMOVE_ATTACHMENT_FAILED = 'REMOVE_ATTACHMENT_FAILED'

// ----------------------------------------
//          Redux Forms
// ----------------------------------------

const CIVILIAN_FORM_NAME = 'Civilian form'

module.exports = {
    INVALID_FILE_TYPE_DROPPED,
    DUPLICATE_FILE_DROPPED,
    DROPZONE_FILE_REMOVED,
    CASE_CREATED_SUCCESS,
    CIVILIAN_DIALOG_OPENED,
    ATTACHMENT_UPLOAD_SUCCEEDED,
    ATTACHMENT_UPLOAD_FAILED,
    FILE_TYPE_INVALID,
    DUPLICATE_FILE_NAME,
    UPLOAD_CANCELED,
    REMOVE_ATTACHMENT_FAILED,
    REMOVE_ATTACHMENT_SUCCESS,
    CIVILIAN_FORM_NAME
}