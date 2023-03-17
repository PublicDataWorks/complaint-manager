export const PAGE_NOT_AVAILABLE = "Sorry, that page is not available";

export const BAD_REQUEST_ERRORS = {
  ACTION_NOT_ALLOWED: `This action is not allowed`,
  CANNOT_UPDATE_ARCHIVED_CASE:
    "Case could not be updated due to archived status",
  CASE_DOES_NOT_EXIST: `This case does not exist`,
  DATA_QUERY_TYPE_NOT_SUPPORTED: `This query type is not supported`,
  INVALID_CASE_STATUS_FOR_UPDATE:
    "Case status could not be updated due to invalid status",
  INVALID_CIVILIAN_NAME: "Civilian name is invalid",
  INVALID_CASE_OFFICER: "The case officer does not exist",
  INVALID_CASE_STATUS: "Case status is invalid for this action",
  INVALID_COMPLAINT_TYPE: "Complaint Type is invalid",
  INVALID_DATE_RANGE_TYPE: "Date Range Type is invalid",
  INVALID_FIRST_CONTACT_DATE: "Valid first contact date is required",
  INVALID_LETTER_OFFICER: "The letter officer does not exist",
  INVALID_LETTER_OFFICER_CASE_OFFICER_COMBINATION:
    "The letter officer does not match with the expected case officer",
  INVALID_OFFICER_HISTORY_NOTE: "The officer's history note does not exist",
  INVALID_PERSON_IN_CUSTODY: "The requested person in custody does not exist",
  INVALID_JOB: "Could not find specified job",
  INVALID_SENDER: "The requested sender could not be found",
  INVALID_TYPE: "The requested type is invalid or is already in use",
  MERGE_TAG_DOES_NOT_EXIST:
    "The tag you are attempting to merge into does not exist",
  NOTIFICATION_CREATION_ERROR: "There was an error creating the notification.",
  NOTIFICATION_EDIT_ERROR: "There was an error notifying mentioned users.",
  NOTIFICATION_DELETION_ERROR: "There was an error removing the notification.",
  OFFICER_ALLEGATION_NOT_FOUND: "Officer allegation does not exist",
  OPERATION_NOT_PERMITTED: "Operation not permitted",
  PERMISSIONS_MISSING_TO_APPROVE_LETTER:
    "Missing permissions to approve letter",
  PERMISSIONS_MISSING_TO_UPDATE_STATUS:
    "Missing permissions to update case status",
  PIB_CONTROL_NUMBER_ALREADY_EXISTS: "Bureau Control # is already in use",
  REFERRAL_LETTER_DOES_NOT_EXIST:
    "The referral letter for this case does not exist",
  REMOVE_CASE_OFFICER_ERROR:
    "Case officer requested for removal does not exist",
  REMOVE_CASE_INMATE_ERROR:
    "Person in custody requested for removal does not exist",
  SEQUELIZE_VALIDATION_ERROR: "SequelizeValidationError",
  TAG_WITH_NAME_EXISTS: "A tag with that name already exists",
  VALIDATION_ERROR_HEADER: "Validation error"
};

export const BAD_DATA_ERRORS = {
  CANNOT_OVERRIDE_CASE_REFERENCE: "Cannot override case reference information",
  UNEXPECTED_SEX_VALUE: "Unexpected value for gender",
  UNEXPECTED_RACE_VALUE: "Unexpected value for race",
  CANNOT_CREATE_DUPLICATE_TAG: "Cannot create duplicate tag",
  TAG_ALREADY_EXISTS_ON_CASE: "Tag already exists on case",
  MISSING_REQUIRED_HEADER_FIELDS: "Missing required header fields",
  DATE_RANGE_IN_INCORRECT_ORDER:
    "Start date in date range must before end date",
  MISSING_DATE_RANGE_END_DATE: "Missing date range end date",
  MISSING_DATE_RANGE_START_DATE: "Missing date range start date",
  MISSING_DATE_RANGE_TYPE: "Missing date range type",
  MISSING_DATE_RANGE_PARAMETERS: "Missing date range parameters",
  MISSING_TAG_PARAMETERS: "Missing tag parameters",
  INVALID_COMPLAINANT_TYPE: "Invalid Complainant Type"
};

export const NOT_FOUND_ERRORS = {
  PAGE_NOT_FOUND: "Page was not found",
  RESOURCE_NOT_FOUND: "The requested resource was not found"
};

export const UNAUTHORIZED_ERRORS = {
  UNAUTHORIZED_ERROR: "UnauthorizedError",
  INVALID_TOKEN: "Invalid token",
  USER_NICKNAME_MISSING: "User nickname missing",
  USER_SCOPE_MISSING: "User scope missing",
  USER_INFO_MISSING: "User info missing"
};

export const INTERNAL_ERRORS = {
  CASE_REFERENCE_GENERATION_FAILURE: `Could not obtain unique case reference number after multiple tries`,
  USER_MANAGEMENT_API_TOKEN_FAILURE:
    "Could not retrieve user management api token",
  USER_MANAGEMENT_API_GET_USERS_FAILURE:
    "Could not retrieve user data from authentication server",
  NOTIFICATIONS_RETRIEVAL_FAILURE:
    "Something went wrong while refreshing your notifications."
};

export const AWS_ERRORS = {
  DECRYPTION_FAILURE_EXCEPTION:
    "Secrets Manager can't decrypt the protected secret text using the provided KMS key.",
  INTERNAL_SERVICE_ERROR_EXCEPTION: "An error occurred on the server side.",
  INVALID_PARAMETER_EXCEPTION: "You provided an invalid value for a parameter.",
  INVALID_REQUEST_EXCEPTION:
    "You provided a parameter value that is not valid for the current state of the resource.",
  RESOURCE_NOT_FOUND_EXCEPTION: "We can't find the resource that you asked for."
};
