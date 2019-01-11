export const LOCAL_DEV_PORT = 3000;
export const PORT = 1234;
// ----------------------------------------
//          Action Types
// ----------------------------------------
export const INVALID_FILE_TYPE_DROPPED = "INVALID_FILE_TYPE_DROPPED";
export const DUPLICATE_FILE_DROPPED = "DUPLICATE_FILE_DROPPED";
export const DROPZONE_FILE_REMOVED = "DROPZONE_FILE_REMOVED";

export const CASE_CREATED_SUCCESS = "CASE_CREATED_SUCCESS";
export const GET_CASE_DETAILS_SUCCESS = "GET_CASE_DETAILS_SUCCESS";
export const GET_MINIMUM_CASE_DETAILS_SUCCESS =
  "GET_MINIMUM_CASE_DETAILS_SUCCESS";
export const ATTACHMENT_UPLOAD_SUCCEEDED = "ATTACHMENT_UPLOAD_SUCCEEDED";
export const ATTACHMENT_UPLOAD_FAILED = "ATTACHMENT_UPLOAD_FAILED";
export const INCIDENT_DETAILS_UPDATE_SUCCEEDED =
  "INCIDENT_DETAILS_UPDATE_SUCCEEDED";
export const INCIDENT_DETAILS_UPDATE_FAILED = "INCIDENT_DETAILS_UPDATE_FAILED";
export const ADDRESS_VALIDITY_UPDATED = "ADDRESS_VALIDITY_UPDATED";
export const ADDRESS_MESSAGE_VISIBILITY_UPDATED =
  "ADDRESS_MESSAGE_VISIBILITY_UPDATED";
export const ADDRESS_TO_CONFIRM_UPDATED = "ADDRESS_TO_CONFIRM_UPDATED";
export const ADDRESS_DISPLAY_VALUE_UPDATED = "ADDRESS_DISPLAY_VALUE_UPDATED";
export const ADDRESS_ERROR_MESSAGE_UPDATED = "ADDRESS_ERROR_MESSAGE_UPDATED";
export const GET_CASE_NOTES_SUCCEEDED = "GET_CASE_NOTES_SUCCEEDED";

export const ADD_CASE_NOTE_FAILED = "ADD_CASE_NOTE_FAILED";
export const ADD_CASE_NOTE_SUCCEEDED = "ADD_CASE_NOTE_SUCCEEDED";
export const EDIT_CASE_NOTE_FAILED = "EDIT_CASE_NOTE_FAILED";
export const EDIT_CASE_NOTE_SUCCEEDED = "EDIT_CASE_NOTE_SUCCEEDED";
export const REMOVE_CASE_NOTE_SUCCEEDED = "REMOVE_CASE_NOTE_SUCCEEDED";
export const REMOVE_CASE_NOTE_FAILED = "REMOVE_CASE_NOTE_FAILED";
export const CASE_NOTE_DIALOG_OPENED = "CASE_NOTE_DIALOG_OPENED";
export const CASE_NOTE_DIALOG_CLOSED = "CASE_NOTE_DIALOG_CLOSED";
export const REMOVE_CASE_NOTE_DIALOG_OPENED = "REMOVE_CASE_NOTE_DIALOG_OPENED";
export const REMOVE_CASE_NOTE_DIALOG_CLOSED = "REMOVE_CASE_NOTE_DIALOG_CLOSED";
export const CIVILIAN_DIALOG_OPENED = "CIVILIAN_DIALOG_OPENED";
export const CIVILIAN_CREATION_SUCCEEDED = "CIVILIAN_CREATION_SUCCEEDED";
export const CIVILIAN_CREATION_FAILED = "CIVILIAN_CREATION_FAILED";
export const UPDATE_ALLEGATION_DETAILS_SUCCEEDED =
  "UPDATE_ALLEGATION_DETAILS_SUCCEEDED";
export const EDIT_CIVILIAN_SUCCESS = "EDIT_CIVILIAN_SUCCESS";
export const NARRATIVE_UPDATE_SUCCEEDED = "NARRATIVE_UPDATE_SUCCEEDED";

export const CREATE_CASE_DIALOG_OPENED = "CREATE_CASE_DIALOG_OPENED";
export const CREATE_CASE_DIALOG_CLOSED = "CREATE_CASE_DIALOG_CLOSED";
export const CASE_STATUS_UPDATE_DIALOG_OPENED =
  "CASE_STATUS_UPDATE_DIALOG_OPENED";
export const CASE_STATUS_UPDATE_DIALOG_CLOSED =
  "CASE_STATUS_UPDATE_DIALOG_CLOSED";
export const REMOVE_PERSON_DIALOG_OPENED = "REMOVE_PERSON_DIALOG_OPENED";
export const REMOVE_PERSON_DIALOG_CLOSED = "REMOVE_PERSON_DIALOG_CLOSED";
export const REMOVE_PERSON_FAILED = "REMOVE_PERSON_FAILED";
export const REMOVE_PERSON_SUCCEEDED = "REMOVE_PERSON_SUCCEEDED";

export const DOWNLOAD_FAILED = "DOWNLOAD_FAILED";

export const GET_ALLEGATIONS_SUCCEEDED = "GET_ALLEGATIONS_SUCCEEDED";
export const GET_ALLEGATIONS_FAILED = "GET_ALLEGATIONS_FAILED";
export const ADD_OFFICER_ALLEGATION_SUCCEEDED =
  "ADD_OFFICER_ALLEGATION_SUCCEEDED";

export const GET_CLASSIFICATIONS_SUCCEEDED = "GET_CLASSIFICATIONS_SUCCEEDED";
export const GET_INTAKE_SOURCES_SUCCEEDED = "GET_INTAKE_SOURCES_SUCCEEDED";
export const GET_RACE_ETHNICITIES_SUCCEEDED = "GET_RACE_ETHNICITIES_SUCCEEDED";

export const GET_RECOMMENDED_ACTIONS_SUCCESS =
  "GET_RECOMMENDED_ACTIONS_SUCCESS";
export const GET_REFERRAL_LETTER_SUCCESS = "GET_REFERRAL_LETTER_SUCCESS";
export const GET_LETTER_PREVIEW_SUCCESS = "GET_LETTER_PREVIEW_SUCCESS";
export const GET_LETTER_PDF_SUCCESS = "GET_LETTER_PDF_SUCCESS";
export const GET_LETTER_TYPE_SUCCESS = "GET_LETTER_TYPE_SUCCESS";
export const OPEN_EDIT_LETTER_CONFIRMATION_DIALOG =
  "OPEN_EDIT_LETTER_CONFIRMATION_DIALOG";
export const CLOSE_EDIT_LETTER_CONFIRMATION_DIALOG =
  "CLOSE_EDIT_LETTER_CONFIRMATION_DIALOG";
export const OPEN_CANCEL_EDIT_LETTER_CONFIRMATION_DIALOG =
  "OPEN_CANCEL_EDIT_LETTER_CONFIRMATION_DIALOG";
export const CLOSE_CANCEL_EDIT_LETTER_CONFIRMATION_DIALOG =
  "CLOSE_CANCEL_EDIT_LETTER_CONFIRMATION_DIALOG";

export const START_LETTER_DOWNLOAD = "START_LETTER_DOWNLOAD";
export const STOP_LETTER_DOWNLOAD = "STOP_LETTER_DOWNLOAD";

export const START_LOADING_PDF_PREVIEW = "START_LOADING_PDF_PREVIEW";
export const FINISH_LOADING_PDF_PREVIEW = "FINISH_LOADING_PDF_PREVIEW";

export const REMOVE_OFFICER_HISTORY_NOTE_DIALOG_OPENED =
  "REMOVE_OFFICER_HISTORY_NOTE_DIALOG_OPENED";
export const REMOVE_OFFICER_HISTORY_NOTE_DIALOG_CLOSED =
  "REMOVE_OFFICER_HISTORY_NOTE_DIALOG_CLOSED";

export const REMOVE_IAPRO_CORRECTION_DIALOG_OPENED =
  "REMOVE_IAPRO_CORRECTION_DIALOG_OPENED";
export const REMOVE_IAPRO_CORRECTION_DIALOG_CLOSED =
  "REMOVE_IAPRO_CORRECTION_DIALOG_CLOSED";

export const EXPORT_AUDIT_LOG_CONFIRMATION_OPENED =
  "EXPORT_AUDIT_LOG_CONFIRMATION_OPENED";
export const EXPORT_ALL_CASES_CONFIRMATION_OPENED =
  "EXPORT_ALL_CASES_CONFIRMATION_OPENED";
export const EXPORT_CONFIRMATION_CLOSED = "EXPORT_CONFIRMATION_CLOSED";

export const CASE_VALIDATION_DIALOG_OPENED = "CASE_VALIDATION_DIALOG_OPENED";
export const CASE_VALIDATION_DIALOG_CLOSED = "CASE_VALIDATION_DIALOG_CLOSED";

export const ARCHIVE_CASE_DIALOG_OPENED = "ARCHIVE_CASE_DIALOG_OPENED";
export const ARCHIVE_CASE_DIALOG_CLOSED = "ARCHIVE_CASE_DIALOG_CLOSED";

export const GENERATE_EXPORT_SUCCESS = "GENERATE_EXPORT_SUCCESS";
export const EXPORT_JOB_COMPLETED = "EXPORT_JOB_COMPLETED";
export const EXPORT_JOB_STARTED = "EXPORT_JOB_STARTED";
export const CLEAR_CURRENT_EXPORT_JOB = "CLEAR_CURRENT_EXPORT_JOB";
export const EXPORT_JOB_REFRESH_INTERVAL_MS = 1000;
export const EXPORT_JOB_MAX_REFRESH_TIMES = 180;

// ----------------------------------------
//          Attachment Errors
// ----------------------------------------
export const FILE_TYPE_INVALID = "File type invalid";
export const DUPLICATE_FILE_NAME = "Duplicate file name";
export const UPLOAD_CANCELED = "Upload canceled.";

// ----------------------------------------
//          Response Errors
// ----------------------------------------
export const VALIDATION_ERROR_HEADER = "Validation error";
export const SEQUELIZE_VALIDATION_ERROR = "SequelizeValidationError";

// ----------------------------------------
//          Attachment Removal
// ----------------------------------------

export const REMOVE_ATTACHMENT_SUCCESS = "REMOVE_ATTACHMENT_SUCCESS";
export const REMOVE_ATTACHMENT_FAILED = "REMOVE_ATTACHMENT_FAILED";

// ----------------------------------------
//          Snackbar Actions
// ----------------------------------------

export const SNACKBAR_ERROR = "SNACKBAR_ERROR";
export const SNACKBAR_SUCCESS = "SNACKBAR_SUCCESS";

// ----------------------------------------
//          Redux Forms
// ----------------------------------------

export const CIVILIAN_FORM_NAME = "Civilian form";
export const CREATE_CASE_FORM_NAME = "CreateCase";
export const INCIDENT_DETAILS_FORM_NAME = "IncidentDetails";
export const REMOVE_PERSON_FORM_NAME = "Civilian form";
export const ALLEGATION_SEARCH_FORM_NAME = "AllegationSearchForm";
export const OFFICER_SEARCH_FORM_NAME = "OfficerSearchForm";
export const CASE_NOTE_FORM_NAME = "CaseNotes";

// ----------------------------------------
//          Auth0 Scopes / Permissions
// ----------------------------------------

export const USER_PERMISSIONS = {
  EXPORT_AUDIT_LOG: "export:audit-log",
  UPDATE_ALL_CASE_STATUSES: "update:case-status"
};
export const OPENID = "openid";
export const PROFILE = "profile";

// ----------------------------------------
//          Shared Search
// ----------------------------------------

export const SEARCH_INITIATED = "SEARCH_INITIATED";
export const SEARCH_SUCCESS = "SEARCH_SUCCESS";
export const SEARCH_FAILED = "SEARCH_FAILED";
export const SEARCH_CLEARED = "SEARCH_CLEARED";

// ----------------------------------------
//          Officers
// ----------------------------------------

export const ADD_OFFICER_TO_CASE_SUCCEEDED = "ADD_OFFICER_TO_CASE_SUCCEEDED";
export const ADD_OFFICER_TO_CASE_FAILED = "ADD_OFFICER_TO_CASE_FAILED";
export const OFFICER_SELECTED = "OFFICER_SELECTED";
export const CASE_OFFICER_SELECTED = "CASE_OFFICER_SELECTED";
export const UNKNOWN_OFFICER_SELECTED = "UNKNOWN_OFFICER_SELECTED";
export const CLEAR_SELECTED_OFFICER = "CLEAR_SELECTED_OFFICER";
export const EDIT_CASE_OFFICER_SUCCEEDED = "EDIT_CASE_OFFICER_SUCCEEDED";
export const EDIT_CASE_OFFICER_FAILED = "EDIT_CASE_OFFICER_FAILED";

// ----------------------------------------
//          Case History Actions
// ----------------------------------------

export const GET_CASE_HISTORY_SUCCESS = "GET_CASE_HISTORY_SUCCESS";

// ----------------------------------------
//          Case Status Actions
// ----------------------------------------

export const UPDATE_CASE_STATUS_SUCCESS = "UPDATE_CASE_STATUS_SUCCESS";

// ----------------------------------------
//          Other
// ----------------------------------------

export const TIMEZONE = "America/Chicago";
export const UTF8_BYTE_ORDER_MARK = "\ufeff";
export const DEFAULT_INTAKE_SOURCE = "Other";

// ----------------------------------------
//          Audit
// ----------------------------------------
export const AUDIT_TYPE = {
  DATA_CHANGE: "Data Change",
  EXPORT: "Export",
  AUTHENTICATION: "Log in/out",
  DATA_ACCESS: "Data Access",
  UPLOAD: "Upload"
};

export const AUDIT_SUBJECT = {
  AUDIT_LOG: "Audit Log",
  CASE_DETAILS: "Case Details",
  ALL_CASES: "All Cases",
  ALL_CASE_INFORMATION: "All Case Information",
  OFFICER_DATA: "Officer Data",
  CASE_HISTORY: "Case History",
  CASE_NOTES: "Case Notes",
  ATTACHMENTS: "Attachments",
  REFERRAL_LETTER_DATA: "Referral Letter Data", //this refers to letter data only (not case data)
  REFERRAL_LETTER: "Referral Letter", //this refers to the full compiled letter including all case data,
  REFERRAL_LETTER_PDF: "Referral Letter PDF",
  MINIMUM_CASE_DETAILS: "Minimum Case Details",
  LETTER_TYPE: "Letter Type"
};

export const AUDIT_ACTION = {
  DATA_UPDATED: "Updated",
  DATA_ACCESSED: "Accessed",
  DATA_CREATED: "Created",
  DATA_DELETED: "Deleted",
  DATA_ARCHIVED: "Archived",
  LOGGED_IN: "Logged in",
  LOGGED_OUT: "Logged out",
  EXPORTED: "Exported",
  DOWNLOADED: "Downloaded",
  UPLOADED: "Uploaded"
};

export const AUDIT_UPLOAD_DETAILS = {
  REFERRAL_LETTER_PDF: "Referral letter finalized and PDF uploaded to S3"
};

export const AUDIT_FIELDS_TO_EXCLUDE =
  "(.*Id$|^id$|^addressableType$|^lat$|^lng$)";
export const AUDIT_SNAPSHOT_FIELDS_TO_EXCLUDE =
  "(createdAt|updatedAt|deletedAt|addressableType)";

// ----------------------------------------
//          Role on Case Options
// ----------------------------------------
export const ACCUSED = "Accused";
export const WITNESS = "Witness";
export const COMPLAINANT = "Complainant";

// ----------------------------------------
//          Complaint Type Options
// ----------------------------------------
export const CIVILIAN_INITIATED = "Civilian Initiated";
export const RANK_INITIATED = "Rank Initiated";

// ----------------------------------------
//          Complaint Type Options
// ----------------------------------------
export const LETTER_TYPE = {
  GENERATED: "Generated",
  EDITED: "Edited"
};

// ----------------------------------------
//         Referral Letter Type Options
// ----------------------------------------
export const REFERRAL_LETTER_VERSION = {
  FINAL: "Final",
  DRAFT: "Draft"
};

// ----------------------------------------
//          Case Status Map
// ----------------------------------------
export const CASE_STATUS = {
  INITIAL: "Initial",
  ACTIVE: "Active",
  LETTER_IN_PROGRESS: "Letter in Progress",
  READY_FOR_REVIEW: "Ready for Review",
  FORWARDED_TO_AGENCY: "Forwarded to Agency",
  CLOSED: "Closed"
};

export const CASE_STATUSES_ALLOWED_TO_EDIT_LETTER = [
  CASE_STATUS.LETTER_IN_PROGRESS,
  CASE_STATUS.READY_FOR_REVIEW,
  CASE_STATUS.FORWARDED_TO_AGENCY,
  CASE_STATUS.CLOSED
];

export const CASE_STATUSES_WITH_ACTIVE_LETTER = [
  CASE_STATUS.LETTER_IN_PROGRESS,
  CASE_STATUS.READY_FOR_REVIEW
];

export const CASE_STATUSES_AFTER_LETTER_APPROVAL = [
  CASE_STATUS.FORWARDED_TO_AGENCY,
  CASE_STATUS.CLOSED
];

export const CASE_STATUS_MAP = {
  [CASE_STATUS.INITIAL]: 0,
  [CASE_STATUS.ACTIVE]: 1,
  [CASE_STATUS.LETTER_IN_PROGRESS]: 2,
  [CASE_STATUS.READY_FOR_REVIEW]: 3,
  [CASE_STATUS.FORWARDED_TO_AGENCY]: 4,
  [CASE_STATUS.CLOSED]: 5
};

export const ADDRESSABLE_TYPE = {
  CASES: "cases",
  CIVILIAN: "civilian"
};

// ----------------------------------------
//          Letter Progress Map
// ----------------------------------------
export const LETTER_PROGRESS = {
  REVIEW_CASE_DETAILS: "Review Case Details",
  OFFICER_COMPLAINT_HISTORIES: "Officer Complaint Histories",
  IAPRO_CORRECTIONS: "IAPro Corrections",
  RECOMMENDED_ACTIONS: "Recommended Actions",
  PREVIEW: "Preview"
};

export const LETTER_PROGRESS_MAP = {
  [LETTER_PROGRESS.REVIEW_CASE_DETAILS]: 0,
  [LETTER_PROGRESS.OFFICER_COMPLAINT_HISTORIES]: 1,
  [LETTER_PROGRESS.IAPRO_CORRECTIONS]: 2,
  [LETTER_PROGRESS.RECOMMENDED_ACTIONS]: 3,
  [LETTER_PROGRESS.PREVIEW]: 4
};

// ----------------------------------------
//       Officers Allegations Severity
// ----------------------------------------
export const ALLEGATION_SEVERITY = {
  LOW: "Low",
  MEDIUM: "Medium",
  HIGH: "High",
  ALL: ["Low", "Medium", "High"]
};

// ----------------------------------------
//               Image URLs
// ----------------------------------------

export const SIGNATURE_URLS = {
  STELLA:
    "file:/app/src/server/handlers/cases/referralLetters/getPdf/assets/signatures/signature.png"
};

// ----------------------------------------
//          Pagination
// ----------------------------------------
export const DEFAULT_PAGINATION_LIMIT = 20;

// ------------------------------------------
//           UI
export const OFFICER_PANEL_DATA_CLEARED = "OFFICER_PANEL_DATA_CLEARED";
export const ACCUSED_OFFICER_PANEL_COLLAPSED =
  "ACCUSED_OFFICER_PANEL_COLLAPSED";
export const ACCUSED_OFFICER_PANEL_EXPANDED = "ACCUSED_OFFICER_PANEL_EXPANDED";
export const EDIT_ALLEGATION_FORM_OPENED = "EDIT_ALLEGATION_FORM_OPENED";
export const EDIT_ALLEGATION_FORM_CLOSED = "EDIT_ALLEGATION_FORM_CLOSED";
export const EDIT_ALLEGATION_FORM_DATA_CLEARED =
  "EDIT_ALLEGATION_FORM_DATA_CLEARED";
export const REMOVE_ALLEGATION_DIALOG_OPENED =
  "REMOVE_ALLEGATION_DIALOG_OPENED";
export const REMOVE_ALLEGATION_DIALOG_CLOSED =
  "REMOVE_ALLEGATION_DIALOG_CLOSED";
export const REMOVE_OFFICER_ALLEGATION_FAILED =
  "REMOVE_OFFICER_ALLEGATION_FAILED";
export const REMOVE_OFFICER_ALLEGATION_SUCCEEDED =
  "REMOVE_OFFICER_ALLEGATION_SUCCEEDED";

// ------------------------------------------
//           Feature Toggles
// ------------------------------------------
export const GET_FEATURES_SUCCEEDED = "GET_FEATURES_SUCCEEDED";

// ------------------------------------------
//           S3 operations
// ------------------------------------------
export const S3_GET_OBJECT = "getObject";
export const S3_URL_EXPIRATION = 60;

// ------------------------------------------
//           Background Job Operations
// ------------------------------------------
export const JOB_OPERATION = {
  AUDIT_LOG_EXPORT: {
    name: "AUDIT_LOG_EXPORT",
    key: "audit_log_export",
    title: "Export Audit Log",
    filename: "Audit_Log",
    auditSubject: AUDIT_SUBJECT.AUDIT_LOG
  },
  CASE_EXPORT: {
    name: "CASE_EXPORT",
    key: "case_export",
    title: "Export All Case Information",
    filename: "All_Case_Information",
    auditSubject: AUDIT_SUBJECT.ALL_CASE_INFORMATION
  }
};

export const QUEUE_PREFIX = "noimp_q";

export const BG_JOB_FAILED = "background job failed.";
