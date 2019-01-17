export const BAD_REQUEST_ERRORS = {
  ACTION_NOT_ALLOWED: `This action is not allowed`,
  CASE_DOES_NOT_EXIST: `This case does not exist.`,
  PERMISSIONS_MISSING_TO_UPDATE_STATUS:
    "Missing permissions to update case status.",
  PERMISSIONS_MISSING_TO_APPROVE_LETTER:
    "Missing permissions to approve letter",
  VALIDATION_ERROR_HEADER: "Validation error",
  SEQUELIZE_VALIDATION_ERROR: "SequelizeValidationError",
  INVALID_CASE_STATUS: "Case status is invalid for this action.",
  INVALID_CASE_STATUS_FOR_UPDATE:
    "Case status could not be updated due to invalid status",
  INVALID_CIVILIAN_NAME: "Civilian name is invalid.",
  INVALID_FIRST_CONTACT_DATE: "Valid first contact date is required",
  REMOVE_CASE_OFFICER_ERROR:
    "Case Officer requested for removal does not exist.",
  REFERRAL_LETTER_DOES_NOT_EXIST:
    "The referral letter for this case does not exist.",
  INVALID_LETTER_OFFICER: "The letter officer does not exist.",
  INVALID_IAPRO_CORRECTION: "The IAPro correction does not exist.",
  INVALID_CASE_OFFICER: "The case officer does not exist.",
  INVALID_LETTER_OFFICER_CASE_OFFICER_COMBINATION:
    "The letter officer does not match with the expected case officer.",
  INVALID_OFFICER_HISTORY_NOTE: "The officer's history note does not exist.",
  INVALID_JOB: "Could not find specified job.",
  OPERATION_NOT_PERMITTED: "Operation not permitted.",
  OFFICER_ALLEGATION_NOT_FOUND: "Officer Allegation does not exist."
};

export const BAD_DATA_ERRORS = {
  CANNOT_OVERRIDE_CASE_REFERENCE: "Cannot override case reference information.",
  UNEXPECTED_SEX_VALUE: "Unexpected value for gender.",
  UNEXPECTED_RACE_VALUE: "Unexpected value for race.",
  MISSING_REQUIRED_HEADER_FIELDS: "Missing required header fields."
};

export const NOT_FOUND_ERRORS = {
  PAGE_NOT_FOUND: "Page was not found."
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

export const ROUTES = {
  "/export/job/:jobId": {},
  "/export/schedule/:operation": {},
  "/cases/:caseId": {
    get:
      "Something went wrong and the case details were not loaded. Please try again.",
    put:
      "Something went wrong and the case details were not updated. Please try again.",
    delete:
      "Something went wrong and the case was not archived. Please try again."
  },
  "/cases/:caseId/minimum-case-details": {
    get:
      "Something went wrong and the case details could not be loaded. Please try again."
  },
  "/cases": {
    post: "Something went wrong and the case was not created. Please try again."
  },
  "/cases/:caseId/case-notes": {
    get:
      "Something went wrong and the case notes were not loaded. Please try again.",
    post:
      "Something went wrong and the case note was not created. Please try again."
  },
  "/cases/:caseId/case-notes/:caseNoteId": {
    put:
      "Something went wrong and the case note was not updated. Please try again.",
    delete:
      "Something went wrong and the case note was not removed. Please try again."
  },
  "/cases/:caseId/case-history": {
    get:
      "Something went wrong and the case history was not loaded. Please try again."
  },
  "/cases/:caseId/status": {
    put:
      "Something went wrong and the case status was not updated. Please try again."
  },
  "/cases/:caseId/narrative": {
    put:
      "Something went wrong and the case narrative was not updated. Please try again."
  },
  "/cases/:caseId/cases-officers": {
    post:
      "Something went wrong and the officer was not added. Please try again."
  },
  "/cases/:caseId/cases-officers/:caseOfficerId": {
    put:
      "Something went wrong and the officer was not updated. Please try again.",
    delete:
      "Something went wrong and the officer was not removed. Please try again."
  },
  "/cases/:caseId/cases-officers/:caseOfficerId/officers-allegations": {
    post:
      "Something went wrong and the allegation was not added. Please try again."
  },
  "/officers-allegations/:officerAllegationId": {
    put:
      "Something went wrong and the allegation was not updated. Please try again.",
    delete:
      "Something went wrong and the allegation was not removed. Please try again."
  },
  "/cases/:caseId/referral-letter": {
    get:
      "Something went wrong and the referral letter details were not loaded. Please try again."
  },
  "/cases/:caseId/referral-letter/preview": {
    get:
      "Something went wrong and the letter preview was not loaded. Please try again."
  },
  "/cases/:caseId/referral-letter/letter-type": {
    get:
      "Something went wrong and the referral letter details were not loaded. Please try again."
  },
  "/cases/:caseId/referral-letter/officer-history": {
    put:
      "Something went wrong and the officer history was not updated. Please try again."
  },
  "/cases/:caseId/referral-letter/iapro-corrections": {
    put:
      "Something went wrong and the IAPro corrections were not updated. Please try again."
  },
  "/cases/:caseId/referral-letter/recommended-actions": {
    put:
      "Something went wrong and we could not update the recommended actions information"
  },
  "/cases/:caseId/referral-letter/addresses": {
    put:
      "Something went wrong and the letter was not updated. Please try again."
  },
  "/cases/:caseId/referral-letter/content": {
    put:
      "Something went wrong and the letter was not updated. Please try again."
  },
  "/cases/:caseId/attachments/": {
    post:
      "Something went wrong and the attachment was not uploaded. Please try again."
  },
  "/cases/:caseId/attachments/:fileName": {
    delete:
      "Something went wrong and the attachment was not removed. Please try again."
  },
  "/cases/:caseId/attachmentUrls/:fileName": {
    get:
      "Something went wrong and the attachment URL could not be found. Please try again."
  },

  "/civilian": {
    post:
      "Something went wrong and the civilian was not created. Please try again."
  },
  "/civilian/:civilianId": {
    put:
      "Something went wrong and the civilian was not updated. Please try again."
  },
  "/cases/:caseId/civilians/:civilianId": {
    delete:
      "Something went wrong and the civilian was not removed from the case. Please try again."
  },
  "/audit": {
    post:
      "Something went wrong and the login was not audited. Please try again."
  },
  "/officers/search": {
    get:
      "Something went wrong and the search was not completed. Please try again."
  },
  "/allegations/search": {
    get:
      "Something went wrong and the search was not completed. Please try again."
  },
  "/allegations": {
    get:
      "Something went wrong and the allegation values could not be found. Please try again."
  },
  "/classifications": {
    get:
      "Something went wrong and the classification values could not be found. Please try again."
  },
  "/intake-sources": {
    get:
      "Something went wrong and the intake source values could not be found. Please try again."
  },
  "/race-ethnicities": {
    get:
      "Something went wrong and the race/ethnicity values could not be found. Please try again."
  },
  "/recommended-actions": {
    get:
      "Something went wrong and the recommended action values could not be found. Please try again."
  },
  "/cases/:caseId/referral-letter/final-pdf-url": {
    get: "Something went wrong and the pdf URL was not found. Please try again."
  },
  "/cases/:caseId/referral-letter/get-pdf": {
    get: "Something went wrong and the pdf was not loaded. Please try again."
  },
  "/cases/:caseId/referral-letter/approve-letter": {
    put:
      "Something went wrong and the case status was not updated. Please try again."
  }
};
