export const PAGE_NOT_AVAILABLE = "Sorry, that page is not available";

export const BAD_REQUEST_ERRORS = {
  ACTION_NOT_ALLOWED: `This action is not allowed`,
  CASE_DOES_NOT_EXIST: `This case does not exist`,
  PERMISSIONS_MISSING_TO_UPDATE_STATUS:
    "Missing permissions to update case status",
  PERMISSIONS_MISSING_TO_APPROVE_LETTER:
    "Missing permissions to approve letter",
  VALIDATION_ERROR_HEADER: "Validation error",
  SEQUELIZE_VALIDATION_ERROR: "SequelizeValidationError",
  INVALID_CASE_STATUS: "Case status is invalid for this action",
  CANNOT_UPDATE_ARCHIVED_CASE:
    "Case could not be updated due to archived status",
  INVALID_CASE_STATUS_FOR_UPDATE:
    "Case status could not be updated due to invalid status",
  INVALID_CIVILIAN_NAME: "Civilian name is invalid",
  INVALID_FIRST_CONTACT_DATE: "Valid first contact date is required",
  REMOVE_CASE_OFFICER_ERROR:
    "Case officer requested for removal does not exist",
  REFERRAL_LETTER_DOES_NOT_EXIST:
    "The referral letter for this case does not exist",
  INVALID_LETTER_OFFICER: "The letter officer does not exist",
  INVALID_IAPRO_CORRECTION: "The IAPro correction does not exist",
  INVALID_CASE_OFFICER: "The case officer does not exist",
  INVALID_LETTER_OFFICER_CASE_OFFICER_COMBINATION:
    "The letter officer does not match with the expected case officer",
  INVALID_OFFICER_HISTORY_NOTE: "The officer's history note does not exist",
  INVALID_JOB: "Could not find specified job",
  OPERATION_NOT_PERMITTED: "Operation not permitted",
  OFFICER_ALLEGATION_NOT_FOUND: "Officer allegation does not exist"
};

export const BAD_DATA_ERRORS = {
  CANNOT_OVERRIDE_CASE_REFERENCE: "Cannot override case reference information",
  UNEXPECTED_SEX_VALUE: "Unexpected value for gender",
  UNEXPECTED_RACE_VALUE: "Unexpected value for race",
  MISSING_REQUIRED_HEADER_FIELDS: "Missing required header fields",
  DATE_RANGE_IN_INCORRECT_ORDER:
    "Start date in date range must before end date",
  MISSING_DATE_RANGE_END_DATE: "Missing date range end date",
  MISSING_DATE_RANGE_START_DATE: "Missing date range start date",
  MISSING_DATE_RANGE_TYPE: "Missing date range type",
  MISSING_DATE_RANGE_PARAMETERS: "Missing date range parameters"
};

export const NOT_FOUND_ERRORS = {
  PAGE_NOT_FOUND: "Page was not found"
};

export const UNAUTHORIZED_ERRORS = {
  UNAUTHORIZED_ERROR: "UnauthorizedError",
  INVALID_TOKEN: "Invalid token",
  USER_NICKNAME_MISSING: "User nickname missing",
  USER_SCOPE_MISSING: "User scope missing"
};

export const INTERNAL_ERRORS = {
  CASE_REFERENCE_GENERATION_FAILURE: `Could not obtain unique case reference number after multiple tries`
};
