const { PD, ORGANIZATION, ORGANIZATION_TITLE, CITY, BUREAU_ACRONYM } = require(`${process.env.INSTANCE_FILES_DIR}/constants`)
export const LOCAL_DEV_PORT = 443;
export const PORT = 1234;
// ----------------------------------------
//          Action Types
// ----------------------------------------
export const INVALID_FILE_TYPE_DROPPED = "INVALID_FILE_TYPE_DROPPED";
export const DUPLICATE_FILE_DROPPED = "DUPLICATE_FILE_DROPPED";
export const DROPZONE_FILE_REMOVED = "DROPZONE_FILE_REMOVED";

export const GET_WORKING_CASES_SUCCESS = "GET_WORKING_CASES_SUCCESS";
export const RESET_WORKING_CASES_LOADED = "RESET_WORKING_CASES_LOADED";
export const GET_ARCHIVED_CASES_SUCCESS = "GET_ARCHIVED_CASES_SUCCESS";
export const RESET_ARCHIVED_CASES_LOADED = "RESET_ARCHIVED_CASES_LOADED";
export const UPDATE_CASES_TABLE_SORTING = "UPDATE_CASES_TABLE_SORTING";
export const CASE_CREATED_SUCCESS = "CASE_CREATED_SUCCESS";
export const GET_CASE_DETAILS_SUCCESS = "GET_CASE_DETAILS_SUCCESS";
export const GET_MINIMUM_CASE_DETAILS_SUCCESS =
  "GET_MINIMUM_CASE_DETAILS_SUCCESS";
export const ARCHIVE_CASE_SUCCESS = "ARCHIVE_CASE_SUCCESS";
export const ATTACHMENT_UPLOAD_SUCCEEDED = "ATTACHMENT_UPLOAD_SUCCEEDED";
export const ATTACHMENT_UPLOAD_FAILED = "ATTACHMENT_UPLOAD_FAILED";
export const INCIDENT_DETAILS_UPDATE_SUCCEEDED =
  "INCIDENT_DETAILS_UPDATE_SUCCEEDED";
export const ADDRESS_VALIDITY_UPDATED = "ADDRESS_VALIDITY_UPDATED";
export const ADDRESS_MESSAGE_VISIBILITY_UPDATED =
  "ADDRESS_MESSAGE_VISIBILITY_UPDATED";
export const ADDRESS_TO_CONFIRM_UPDATED = "ADDRESS_TO_CONFIRM_UPDATED";
export const ADDRESS_DISPLAY_VALUE_UPDATED = "ADDRESS_DISPLAY_VALUE_UPDATED";
export const ADDRESS_ERROR_MESSAGE_UPDATED = "ADDRESS_ERROR_MESSAGE_UPDATED";
export const GET_CASE_NOTES_SUCCEEDED = "GET_CASE_NOTES_SUCCEEDED";

export const EDIT_INCIDENT_DETAILS_DIALOG_OPENED =
  "EDIT_INCIDENT_DETAILS_DIALOG_OPENED";
export const EDIT_INCIDENT_DETAILS_DIALOG_CLOSED =
  "EDIT_INCIDENT_DETAILS_DIALOG_CLOSED";
export const ADD_CASE_NOTE_SUCCEEDED = "ADD_CASE_NOTE_SUCCEEDED";
export const EDIT_CASE_NOTE_SUCCEEDED = "EDIT_CASE_NOTE_SUCCEEDED";
export const REMOVE_CASE_NOTE_SUCCEEDED = "REMOVE_CASE_NOTE_SUCCEEDED";
export const CASE_NOTE_DIALOG_OPENED = "CASE_NOTE_DIALOG_OPENED";
export const CASE_NOTE_DIALOG_CLOSED = "CASE_NOTE_DIALOG_CLOSED";
export const REMOVE_CASE_NOTE_DIALOG_OPENED = "REMOVE_CASE_NOTE_DIALOG_OPENED";
export const REMOVE_CASE_NOTE_DIALOG_CLOSED = "REMOVE_CASE_NOTE_DIALOG_CLOSED";
export const REMOVE_CASE_TAG_DIALOG_OPENED = "REMOVE_CASE_TAG_DIALOG_OPENED";
export const REMOVE_CASE_TAG_DIALOG_CLOSED = "REMOVE_CASE_TAG_DIALOG_CLOSED";
export const CASE_TAG_DIALOG_OPENED = "CASE_TAG_DIALOG_OPENED";
export const CASE_TAG_DIALOG_CLOSED = "CASE_TAG_DIALOG_CLOSED";
export const CREATE_CASE_TAG_SUCCESS = "CREATE_CASE_TAG_SUCCESS";
export const GET_CASE_TAG_SUCCESS = "GET_CASE_TAG_SUCCESS";
export const FETCHING_CASE_TAGS = "FETCHING_CASE_TAGS";
export const FETCHING_CASE_NOTES = "FETCHING_CASE_NOTES";
export const REMOVE_CASE_TAG_SUCCESS = "REMOVE_CASE_TAG_SUCCESS";
export const CIVILIAN_DIALOG_OPENED = "CIVILIAN_DIALOG_OPENED";
export const EDIT_CIVILIAN_DIALOG_CLOSED = "EDIT_CIVILIAN_DIALOG_CLOSED";
export const CIVILIAN_CREATION_SUCCEEDED = "CIVILIAN_CREATION_SUCCEEDED";
export const UPDATE_ALLEGATION_DETAILS_SUCCEEDED =
  "UPDATE_ALLEGATION_DETAILS_SUCCEEDED";
export const EDIT_CIVILIAN_SUCCESS = "EDIT_CIVILIAN_SUCCESS";
export const NARRATIVE_UPDATE_SUCCEEDED = "NARRATIVE_UPDATE_SUCCEEDED";

export const RESTORE_ARCHIVED_CASE_DIALOG_OPENED =
  "RESTORE_ARCHIVED_CASE_DIALOG_OPENED";
export const RESTORE_ARCHIVED_CASE_DIALOG_CLOSED =
  "RESTORE_ARCHIVED_CASE_DIALOG_CLOSED";
export const CREATE_DIALOG_OPENED = "CREATE_DIALOG_OPENED";
export const CREATE_DIALOG_CLOSED = "CREATE_DIALOG_CLOSED";
export const CASE_STATUS_UPDATE_DIALOG_OPENED =
  "CASE_STATUS_UPDATE_DIALOG_OPENED";
export const CASE_STATUS_UPDATE_DIALOG_SUBMITTING =
  "CASE_STATUS_UPDATE_DIALOG_SUBMITTING";
export const CASE_STATUS_UPDATE_DIALOG_CLOSED =
  "CASE_STATUS_UPDATE_DIALOG_CLOSED";
export const REMOVE_PERSON_DIALOG_OPENED = "REMOVE_PERSON_DIALOG_OPENED";
export const REMOVE_PERSON_DIALOG_CLOSED = "REMOVE_PERSON_DIALOG_CLOSED";
export const REMOVE_PERSON_SUCCEEDED = "REMOVE_PERSON_SUCCEEDED";

export const DOWNLOAD_FAILED = "DOWNLOAD_FAILED";

export const GET_ALLEGATIONS_SUCCEEDED = "GET_ALLEGATIONS_SUCCEEDED";
export const ADD_OFFICER_ALLEGATION_SUCCEEDED =
  "ADD_OFFICER_ALLEGATION_SUCCEEDED";

export const GET_CLASSIFICATIONS_SUCCEEDED = "GET_CLASSIFICATIONS_SUCCEEDED";
export const GET_INTAKE_SOURCES_SUCCEEDED = "GET_INTAKE_SOURCES_SUCCEEDED";
export const GET_HOW_DID_YOU_HEAR_ABOUT_US_SOURCES_SUCCEEDED =
  "GET_HOW_DID_YOU_HEAR_ABOUT_US_SOURCES_SUCCEEDED";
export const GET_RACE_ETHNICITIES_SUCCEEDED = "GET_RACE_ETHNICITIES_SUCCEEDED";
export const GET_OFFICER_HISTORY_OPTIONS_SUCCEEDED =
  "GET_OFFICER_HISTORY_OPTIONS_SUCCEEDED";
export const GET_GENDER_IDENTITIES_SUCCEEDED =
  "GET_GENDER_IDENTITIES_SUCCEEDED";
export const GET_CIVILIAN_TITLES_SUCCEEDED = "GET_CIVILIAN_TITLES_SUCCEEDED";
export const GET_CASE_NOTE_ACTIONS_SUCCEEDED =
  "GET_CASE_NOTE_ACTIONS_SUCCEEDED";
export const GET_TAGS_CLEARED = "GET_TAGS_CLEARED";
export const GET_TAGS_SUCCEEDED = "GET_TAGS_SUCCEEDED";
export const GET_TAGS_FAILED = "GET_TAGS_FAILED";

export const GET_DISTRICTS_SUCCEEDED = "GET_DISTRICTS_SUCCEEDED";

export const GET_RECOMMENDED_ACTIONS_SUCCESS =
  "GET_RECOMMENDED_ACTIONS_SUCCESS";
export const GET_REFERRAL_LETTER_SUCCESS = "GET_REFERRAL_LETTER_SUCCESS";
export const GET_REFERRAL_LETTER_PREVIEW_SUCCESS =
  "GET_REFERRAL_LETTER_PREVIEW_SUCCESS";
export const GET_REFERRAL_LETTER_PDF_SUCCESS =
  "GET_REFERRAL_LETTER_PDF_SUCCESS";
export const GET_REFERRAL_LETTER_EDIT_STATUS_SUCCESS =
  "GET_REFERRAL_LETTER_EDIT_STATUS_SUCCESS";
export const OPEN_EDIT_LETTER_CONFIRMATION_DIALOG =
  "OPEN_EDIT_LETTER_CONFIRMATION_DIALOG";
export const CLOSE_EDIT_LETTER_CONFIRMATION_DIALOG =
  "CLOSE_EDIT_LETTER_CONFIRMATION_DIALOG";
export const OPEN_CANCEL_EDIT_LETTER_CONFIRMATION_DIALOG =
  "OPEN_CANCEL_EDIT_LETTER_CONFIRMATION_DIALOG";
export const CLOSE_CANCEL_EDIT_LETTER_CONFIRMATION_DIALOG =
  "CLOSE_CANCEL_EDIT_LETTER_CONFIRMATION_DIALOG";

export const GET_CLASSIFICATIONS_SUCCESS = "GET_CLASSIFICATIONS_SUCCESS";

export const OPEN_INCOMPLETE_CLASSIFICATION_DIALOG =
  "OPEN_INCOMPLETE_CLASSIFICATION_DIALOG";
export const CLOSE_INCOMPLETE_CLASSIFICATIONS_DIALOG =
  "CLOSE_INCOMPLETE_CLASSIFICATIONS_DIALOG";

export const OPEN_MISSING_COMPLAINANT_DIALOG =
  "OPEN_MISSING_COMPLAINANT_DIALOG";
export const CLOSE_MISSING_COMPLAINANT_DIALOG =
  "CLOSE_MISSING_COMPLAINANT_DIALOG";

export const START_LETTER_DOWNLOAD = "START_LETTER_DOWNLOAD";
export const STOP_LETTER_DOWNLOAD = "STOP_LETTER_DOWNLOAD";

export const START_LOADING_PDF_PREVIEW = "START_LOADING_PDF_PREVIEW";
export const FINISH_LOADING_PDF_PREVIEW = "FINISH_LOADING_PDF_PREVIEW";

export const REMOVE_OFFICER_HISTORY_NOTE_DIALOG_OPENED =
  "REMOVE_OFFICER_HISTORY_NOTE_DIALOG_OPENED";
export const REMOVE_OFFICER_HISTORY_NOTE_DIALOG_CLOSED =
  "REMOVE_OFFICER_HISTORY_NOTE_DIALOG_CLOSED";

export const REMOVE_ATTACHMENT_CONFIRMATION_DIALOG_EXITED =
  "REMOVE_ATTACHMENT_CONFIRMATION_DIALOG_EXITED";

export const REMOVE_ATTACHMENT_CONFIRMATION_DIALOG_OPENED =
  "REMOVE_ATTACHMENT_CONFIRMATION_DIALOG_OPENED";
export const REMOVE_ATTACHMENT_CONFIRMATION_DIALOG_CLOSED =
  "REMOVE_ATTACHMENT_CONFIRMATION_DIALOG_CLOSED";

export const EXPORT_AUDIT_LOG_CONFIRMATION_OPENED =
  "EXPORT_AUDIT_LOG_CONFIRMATION_OPENED";
export const EXPORT_CASES_CONFIRMATION_OPENED =
  "EXPORT_CASES_CONFIRMATION_OPENED";
export const EXPORT_CONFIRMATION_CLOSED = "EXPORT_CONFIRMATION_CLOSED";

export const ARCHIVE_CASE_DIALOG_OPENED = "ARCHIVE_CASE_DIALOG_OPENED";
export const ARCHIVE_CASE_DIALOG_CLOSED = "ARCHIVE_CASE_DIALOG_CLOSED";

export const GENERATE_EXPORT_SUCCESS = "GENERATE_EXPORT_SUCCESS";
export const EXPORT_JOB_COMPLETED = "EXPORT_JOB_COMPLETED";
export const EXPORT_JOB_STARTED = "EXPORT_JOB_STARTED";
export const CLEAR_CURRENT_EXPORT_JOB = "CLEAR_CURRENT_EXPORT_JOB";
export const EXPORT_JOB_REFRESH_INTERVAL_MS = 1000;
export const EXPORT_JOB_MAX_REFRESH_TIMES = 180;

export const GET_USERS_SUCCESS = "GET_USERS_SUCCESS";

export const GET_NOTIFICATIONS_SUCCESS = "GET_NOTIFICATIONS_SUCCESS";

export const HIGHLIGHT_CASE_NOTE = "HIGHLIGHT_CASE_NOTE";
export const CLEAR_HIGHLIGHTED_CASE_NOTE = "UNHIGHLIGHT_CASE_NOTE";

// ----------------------------------------
//          Attachment Errors
// ----------------------------------------
export const FILE_TYPE_INVALID = "File type invalid";
export const DUPLICATE_FILE_NAME = "Duplicate file name";
export const UPLOAD_CANCELED = "Upload canceled.";

// ----------------------------------------
//          Attachment Removal
// ----------------------------------------

export const REMOVE_ATTACHMENT_SUCCESS = "REMOVE_ATTACHMENT_SUCCESS";

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
export const CASE_TAG_FORM_NAME = "CaseTagForm";
export const REMOVE_CASE_TAG_FORM_NAME = "RemoveCaseTagForm";
export const REMOVE_CASE_NOTE_FORM_NAME = "RemoveCaseNoteForm";
export const ARCHIVE_CASE_FORM_NAME = "ArchiveCaseForm";
export const NARRATIVE_FORM = "NarrativeForm";
export const EDIT_LETTER_HTML_FORM = "EditLetterHtmlForm";
export const OFFICER_DETAILS_FORM_NAME = "OfficerDetails";
export const RESTORE_ARCHIVED_CASE_FORM = "RestoreArchivedCaseForm";
export const EXPORT_AUDIT_LOG_FORM_NAME = "ExportAuditLogForm";
export const EXPORT_CASES_FORM_NAME = "ExportCasesForm";
export const SEARCH_CASES_FORM_NAME = "SearchCasesForm";

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
//          Search
// ----------------------------------------

export const SEARCH_INITIATED = "SEARCH_INITIATED";
export const SEARCH_SUCCESS = "SEARCH_SUCCESS";
export const SEARCH_FAILED = "SEARCH_FAILED";
export const SEARCH_CLEARED = "SEARCH_CLEARED";
export const SEARCH_CASES_INITIATED = "SEARCH_CASES_INITIATED";
export const SEARCH_CASES_SUCCESS = "SEARCH_CASES_SUCCESS";
export const SEARCH_CASES_FAILED = "SEARCH_CASES_FAILED";
export const SEARCH_CASES_CLEARED = "SEARCH_CASES_CLEARED";

// ----------------------------------------
//          Officers
// ----------------------------------------

export const ADD_OFFICER_TO_CASE_SUCCEEDED = "ADD_OFFICER_TO_CASE_SUCCEEDED";
export const OFFICER_SELECTED = "OFFICER_SELECTED";
export const CASE_OFFICER_SELECTED = "CASE_OFFICER_SELECTED";
export const UNKNOWN_OFFICER_SELECTED = "UNKNOWN_OFFICER_SELECTED";
export const CLEAR_SELECTED_OFFICER = "CLEAR_SELECTED_OFFICER";
export const ADD_CASE_EMPLOYEE_TYPE = "ADD_CASE_EMPLOYEE_TYPE";
export const CLEAR_CASE_EMPLOYEE_TYPE = "CLEAR_CASE_EMPLOYEE_TYPE";
export const UNKNOWN_OFFICER_NAME = "Unknown Officer";

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

export const MANAGER_TYPE = {
  COMPLAINT: "complaint"
};

//TODO: when newAuditFeature toggle is removed, delete audit file type from audit_subject
export const AUDIT_SUBJECT = {
  AUDIT_LOG: "Audit Log",
  CASE_DETAILS: "Case Details",
  ALL_WORKING_CASES: "All Working Cases",
  ALL_ARCHIVED_CASES: "All Archived Cases",
  CASE_EXPORT: "Case Export",
  OFFICER_DATA: "Officer Data",
  CASE_HISTORY: "Case History",
  CASE_NOTES: "Case Notes",
  CASE_TAGS: "Case Tags",
  ALL_TAGS: "All Tags",
  ATTACHMENT: "Attachment",
  REFERRAL_LETTER_PREVIEW: "Referral Letter Preview",
  REFERRAL_LETTER_DATA: "Referral Letter Data", //this refers to letter data only (not case data)
  DRAFT_REFERRAL_LETTER_PDF: "Draft Referral Letter PDF",
  FINAL_REFERRAL_LETTER_PDF: "Final Referral Letter PDF",
  LETTER_TO_COMPLAINANT_PDF: "Letter to Complainant PDF",
  ALL_USER_DATA: "All User Data",
  ALL_AUTHOR_DATA_FOR_NOTIFICATIONS: "All Author Data for Notifications",
  ALL_AUTHOR_DATA_FOR_CASE_NOTES: "All Author Data for Case Notes",
  CASE_CLASSIFICATIONS: "Case Classifications",
  NOTIFICATIONS: "Notifications",
  VISUALIZATION_INTAKE_SOURCE:
    "All Complaint Data for Complaints by Intake Source",
  VISUALIZATION_COMPLAINANT_TYPE:
    "All Complaint Data for Complaints by Complainant Type YTD",
  VISUALIZATION_COMPLAINANT_TYPE_PAST_12_MONTHS:
    "All Complaint Data for Complaints by Complainant Type over Past 12 Months",
  VISUALIZATION_TOP_10_TAGS:
    "All Data for Top Ten Case Tags over Past 12 Months",
  COMPLAINT_TOTAL_YTD: "Complaint Count for Complaints Year to Date",
  COMPLAINT_TOTAL_PREVIOUS_YEAR:
    "Complaint Count for Complaints in the Previous Year"
};

export const AUDIT_FILE_TYPE = {
  DRAFT_REFERRAL_LETTER_PDF: "Draft Referral Letter PDF",
  FINAL_REFERRAL_LETTER_PDF: "Final Referral Letter PDF",
  LETTER_TO_COMPLAINANT_PDF: "Letter to Complainant PDF",
  ATTACHMENT: "Attachment"
};

export const AUDIT_ACTION = {
  DATA_UPDATED: "Updated",
  DATA_CREATED: "Created",
  DATA_DELETED: "Deleted",
  DATA_ARCHIVED: "Archived",
  DATA_RESTORED: "Restored",
  DATA_ACCESSED: "Accessed",
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
//          Sort Cases By Options
// ----------------------------------------

export const SORT_CASES_BY = {
  CASE_REFERENCE: "caseReference",
  STATUS: "status",
  PRIMARY_COMPLAINANT: "primaryComplainant",
  ACCUSED_OFFICERS: "primaryAccusedOfficer",
  FIRST_CONTACT_DATE: "firstContactDate",
  TAGS: "tagNames",
  ASSIGNED_TO: "assignedTo"
};

export const DESCENDING = "desc";
export const ASCENDING = "asc";

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
//          Edit Status Options
// ----------------------------------------
export const EDIT_STATUS = {
  GENERATED: "Generated",
  EDITED: "Edited"
};

// ----------------------------------------
//          Case Table Types
// ----------------------------------------
export const SEARCH = "search";
export const WORKING = "working";
export const ARCHIVE = "archived";

export const CASE_TYPE = {
  SEARCH,
  WORKING,
  ARCHIVE
};

// ----------------------------------------
//         Referral Letter Type Options
// ----------------------------------------
export const REFERRAL_LETTER_VERSION = {
  FINAL: "Final",
  DRAFT: "Draft"
};
export const REFERRAL_LETTER = "Referral Letter";

export const COMPLAINANT_LETTER = "Letter to Complainant";
export const OFFICER_COMPLAINANT_TITLE = "Officer";

// ----------------------------------------
//         Classifications Options
// ----------------------------------------
export const DECLINES_OPTION = "Declines to classify";

// ----------------------------------------
//          Data Dashboard Map
// ----------------------------------------

export const DATE_RANGE_TYPE = {
  YTD: "YTD",
  PAST_12_MONTHS: "PAST_12_MONTHS"
};

export const QUERY_TYPES = {
  COUNT_COMPLAINTS_BY_INTAKE_SOURCE: "countComplaintsByIntakeSource",
  COUNT_COMPLAINT_TOTALS: "countComplaintTotals",
  COUNT_COMPLAINTS_BY_COMPLAINANT_TYPE: "countComplaintsByComplainantType",
  COUNT_COMPLAINTS_BY_COMPLAINANT_TYPE_PAST_12_MONTHS:
    "countComplaintsByComplainantTypePast12Months",
  COUNT_TOP_10_TAGS: "countTop10Tags"
};

export const QUERY_TYPE_FILE_MAP = {
  COUNT_COMPLAINTS_BY_INTAKE_SOURCE: "countComplaintsByIntakeSource.js",
  COUNT_COMPLAINT_TOTALS: "countComplaintTotals.js",
  COUNT_COMPLAINTS_BY_COMPLAINANT_TYPE: "countComplaintsByComplainantType.js"
};

export const DDS_COMPLAINTS_OVER_TIME = "DDS_COMPLAINTS_OVER_TIME";
export const DDS_COMPLAINANTS_SUBMIT_COMPLAINTS =
  "DDS_COMPLAINANTS_SUBMIT_COMPLAINTS";
export const DDS_WHO_SUBMITS_COMPLAINTS = "DDS_WHO_SUBMITS_COMPLAINTS";
export const DDS_EMERGING_THEMES = "DDS_EMERGING_THEMES";

export const DATA_SECTIONS = {
  [DDS_COMPLAINTS_OVER_TIME]: {
    title: "Who is submitting complaints over time?",
    subtitle: "Complainant Type over Past 12 Months",
    dataTestId: "complainantTypePast12MonthsGraph",
    queryType: QUERY_TYPES.COUNT_COMPLAINTS_BY_COMPLAINANT_TYPE_PAST_12_MONTHS,
    collapsedText: `With this chart, the ${ORGANIZATION} seeks to capture if there are any patterns around complainants and complaint types during the year. This table tracks the type of complainant who filed a complaint referral with the ${ORGANIZATION} over the course of the last twelve months`,
    fullMessage: `With this chart, the ${ORGANIZATION} seeks to capture if there are any patterns around complainants and complaint types during the year. This table tracks the type of complainant who filed a complaint referral with the ${ORGANIZATION} over the course of the last twelve months.\n\nAs the year progresses, the table will show the last twelve (12) months from the current month (this is a rolling twelve months table).  With this chart, the ${ORGANIZATION} seeks to capture if there are any patterns around complainants and complaint types during the year.  For example, there was a peak of complaints from the community – Civilian Complaints – in June during the interactions that occurred around the protests of police misconduct and the protest on the Crescent City Connection bridge.  ${ORGANIZATION} tracks to see if there are other concentrations of complainants or complaint types during other points of the year including festival season, Mardi Gras, Essence, Voodoo Festival, hurricane season, sporting events, and the holidays.`
  },
  [DDS_COMPLAINANTS_SUBMIT_COMPLAINTS]: {
    title: "How do complainants submit complaints?",
    subtitle: "Complaints by Intake Source",
    dataTestId: "intakeSourceGraph",
    queryType: QUERY_TYPES.COUNT_COMPLAINTS_BY_INTAKE_SOURCE,
    queryOptions: { dateRangeType: DATE_RANGE_TYPE.PAST_12_MONTHS },
    collapsedText: `${ORGANIZATION} works to provide as many methods for communication and intake as possible. This shows the intake source for complaints submitted over the past twelve months.`,
    fullMessage: `${ORGANIZATION} works to provide as many methods for communication and intake as possible. This shows the intake source for complaints submitted over the past twelve months.\n\nThe ${ORGANIZATION_TITLE} tracks complaints and our internal operations to ensure that the ${ORGANIZATION} is providing as many opportunities as possible for the public to report alleged misconduct and to help hold officers accountable.  Intake source refers to the method of communication through which the complaint was communicated to the ${ORGANIZATION}.  Currently, complaints can be filed with the ${ORGANIZATION} through:\n\u2022 Website\n\u2022 Email\n\u2022 Phone\n\u2022 In-person\n\u2022 Outreach Events\n\u2022 Social Media\n\u2022 U.S. Mail\n\u2022 Video Call`
  },
  [DDS_WHO_SUBMITS_COMPLAINTS]: {
    title: "Who submits complaints?",
    subtitle: "Complaints by Complainant Type",
    dataTestId: "complainantTypeGraph",
    queryType: QUERY_TYPES.COUNT_COMPLAINTS_BY_COMPLAINANT_TYPE,
    queryOptions: { dateRangeType: DATE_RANGE_TYPE.PAST_12_MONTHS },
    collapsedText:
      `The ${ORGANIZATION} tracked the complainant type to determine if we are reaching the full population with our services. This shows the complaint types for each complaint, over the past twelve months.`,
    fullMessage:
      `The ${ORGANIZATION} tracked the complainant type to determine if we are reaching the full population with our services. This shows the complaint types for each complaint, over the past twelve months. The different complainant types include:\n\n\u2022 Anonymous Complainant (AC) – this means that the individual who filed the complaint either did not disclose his / her name or the complainant did disclose his / her name to ${ORGANIZATION} but has asked for his / her name to be removed in the complaint referral to ${BUREAU_ACRONYM}.  In both situations, ${ORGANIZATION} counts this complainant as “anonymous.”  This category does not differentiate between individuals who are members of the public or individuals that are employed by the ${PD}.\n\n\u2022 Civilian Complainant (CC) – this category applies to any member of the public who files a complaint.  This individual may or may not reside in ${CITY}.  In these referrals, the individual’s name does appear on the complaint referral to ${BUREAU_ACRONYM}.\n\n\u2022 Police Officer Complainant (PO) – Police Officer complainants applies to any sworn officer who files a complaint of misconduct to our office.  ${ORGANIZATION} reviews these referrals to identify and highlight any possibility of retaliation within the police department.  In these referrals, the officer’s name does appear on the complaint referral to ${BUREAU_ACRONYM}.\n\n\u2022 Civilian within ${PD} Complainant (CN) – this category applies to any civilian who is employed by the ${PD}. In these complaint referrals, ${ORGANIZATION} is concerned about the possibility of retaliation that may occur to a civilian by officers within the police department. In these referrals, the employee’s name does appear on the complaint referral to ${BUREAU_ACRONYM}.`
  },
  [DDS_EMERGING_THEMES]: {
    title: "What themes are emerging from the data?",
    subtitle: "Tags and Complaint Subject Matter Themes",
    dataTestId: "top10TagsGraph",
    queryType: QUERY_TYPES.COUNT_TOP_10_TAGS,
    collapsedText: `The ${ORGANIZATION_TITLE} labels and categorizes groups of complaints based on subject matter or theme through tags. Note: Not every ${ORGANIZATION} case has a tag or associated theme. Visit the #Tag Glossary linkTo /data/glossary# for more information`,
    fullMessage: `The ${ORGANIZATION_TITLE} labels and categorizes groups of complaints based on subject matter or theme through tags. Note: Not every ${ORGANIZATION} case has a tag or associated theme. Visit the #Tag Glossary linkTo /data/glossary# for more information.\n\nTags is a term created within the ${ORGANIZATION_TITLE} and it references a way of labeling and categorizing a group of complaints based on subject matter or a theme.  Some tags were created in response to patterns or situations that naturally arise, such as Covid19, Checkpoints or Protests.  Those three tags were created in the spring and summer to track complaints that came during the police’s response to the pandemic or during the public protests of police shootings.  Other tags capture complaints around basic policing tactics or strategies, such Arrest Warrant which is utilized when there are complaints around how arrest warrants were executed, or Failure to Investigate which is utilized when there are complaints concerning investigatory shortcomings.  Finally, some tags were created in response to partnerships with other community organizations to track a shared concern, such as complaints of misconduct that may result from landlord and tenant issues or misconduct resulting from housing insecurity.  In those situations, the ${ORGANIZATION} wants to ensure those complainants are also connected with advocacy groups that can assist with services.  As future patterns, concerns, or service opportunities arise, the ${ORGANIZATION} will continue to develop and implement new tags.  This chart captures tag use on a rolling twelve month basis.`
  }
};

export const TAG_LABEL_CHAR_LIMIT = 20;

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
  RECOMMENDED_ACTIONS: "Recommended Actions",
  PREVIEW: "Preview"
};

export const LETTER_PROGRESS_MAP = {
  [LETTER_PROGRESS.REVIEW_CASE_DETAILS]: 0,
  [LETTER_PROGRESS.OFFICER_COMPLAINT_HISTORIES]: 1,
  [LETTER_PROGRESS.RECOMMENDED_ACTIONS]: 2,
  [LETTER_PROGRESS.PREVIEW]: 3
};

// ----------------------------------------
//       Officers Allegations Options
// ----------------------------------------
export const ALLEGATION_OPTIONS = {
  NO_NOTEWORTHY_HISTORY: "No noteworthy officer history to include in letter",
  RECRUIT: "Officer is a recruit so there is no history",
  NOTEWORTHY_HISTORY: "Officer has significant/noteworthy history"
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
//               NODE_CACHE
// ----------------------------------------
export const AUTH0_USERS_CACHE_KEY = "AUTH0_USERS_CACHE_KEY";
export const TTL_SEC = 24 * 60 * 60;

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
export const REMOVE_OFFICER_ALLEGATION_SUCCEEDED =
  "REMOVE_OFFICER_ALLEGATION_SUCCEEDED";
export const OPEN_INCOMPLETE_OFFICER_HISTORY_DIALOG =
  "OPEN_INCOMPLETE_OFFICER_HISTORY_DIALOG";
export const CLOSE_INCOMPLETE_OFFICER_HISTORY_DIALOG =
  "CLOSE_INCOMPLETE_OFFICER_HISTORY_DIALOG";

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
    title: "Export Cases",
    filename: "Case_Export",
    auditSubject: AUDIT_SUBJECT.CASE_EXPORT
  }
};

export const CASE_EXPORT_TYPE = {
  FIRST_CONTACT_DATE: "firstContactDate",
  INCIDENT_DATE: "incidentDate"
};

export const QUEUE_NAME = "NOIPMQueue";
export const QUEUE_PREFIX = "noipm_q";
// ------------------------------------------
//           Front-end Labels
// ------------------------------------------
export const ALLEGATION_DETAILS_LABEL =
  "Enter narrative details pertaining to this allegation";
export const OFFICER_TITLE = "Officer";
export const DEFAULT_NOTIFICATION_TEXT = "You have no new notifications.";

// ------------------------------------------
//            Fake User Data
// ------------------------------------------

export const NICKNAME = "noipm.infrastructure@gmail.com";
export const USERNAME = "NOIPM Infra";
export const PERMISSIONS = [
  "openid",
  "profile",
  "export:audit-log",
  "update:case-status"
];

export const FAKE_USERS = [
  { email: "anna.banana@gmail.com", name: "Anna Banana" },
  { email: "bear@gmail.com", name: "Bear" },
  { email: "d.lizard@gmail.com", name: "D. Lizard" },
  { email: "dog.person@gmail.com", name: "Dog Person" },
  { email: "harold.finch@gmail.com", name: "Harold Finch" },
  { email: "john.reese@gmail.com", name: "John Reese" },
  { email: "kelly.clarkson@gmail.com", name: "Kelly Clarkson" },
  { email: NICKNAME, name: USERNAME },
  { email: "ree.c.pieces@gmail.com", name: "Ree C. Pieces" },
  { email: "sameen.shaw@gmail.com", name: "Sameen Shaw" },
  { email: "seanathon@gmail.com", name: "Seanathon" }
];
