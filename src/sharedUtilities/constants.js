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
const CIVILIAN_CREATION_SUCCEEDED = 'CIVILIAN_CREATION_SUCCEEDED'
const CIVILIAN_CREATION_FAILED = 'CIVILIAN_CREATION_FAILED'

const DOWNLOAD_FAILED = "DOWNLOAD_FAILED"

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
//          Attachment Removal
// ----------------------------------------

const SNACKBAR_ERROR = 'SNACKBAR_ERROR';

// ----------------------------------------
//          Redux Forms
// ----------------------------------------

const CIVILIAN_FORM_NAME = 'Civilian form'

// ----------------------------------------
//          Auth0 Scopes / Permissions
// ----------------------------------------


const EXPORT_AUDIT_LOG = "export:audit_log"
const OPENID = "openid"
const PROFILE = "profile"


// ----------------------------------------
//          Other
// ----------------------------------------

const TIMEZONE = 'America/Chicago'

module.exports = {
    INVALID_FILE_TYPE_DROPPED,
    DUPLICATE_FILE_DROPPED,
    DROPZONE_FILE_REMOVED,
    CASE_CREATED_SUCCESS,
    CIVILIAN_DIALOG_OPENED,
    CIVILIAN_CREATION_SUCCEEDED,
    CIVILIAN_CREATION_FAILED,
    DOWNLOAD_FAILED,
    ATTACHMENT_UPLOAD_SUCCEEDED,
    ATTACHMENT_UPLOAD_FAILED,
    FILE_TYPE_INVALID,
    DUPLICATE_FILE_NAME,
    UPLOAD_CANCELED,
    REMOVE_ATTACHMENT_FAILED,
    REMOVE_ATTACHMENT_SUCCESS,
    SNACKBAR_ERROR,
    CIVILIAN_FORM_NAME,
    EXPORT_AUDIT_LOG,
    OPENID,
    PROFILE,
    TIMEZONE
}