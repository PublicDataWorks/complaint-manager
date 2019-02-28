import getCase from "./handlers/cases/getCase/getCase";
import getWorkingCases from "./handlers/cases/getCases/getWorkingCases";
import createCase from "./handlers/cases/createCase";
import editCase from "./handlers/cases/editCase";
import archiveCase from "./handlers/cases/archiveCase/archiveCase";
import restoreArchivedCase from "./handlers/cases/restoreArchivedCase/restoreArchivedCase";
import getMinimumCaseDetails from "./handlers/cases/getMinimumCaseDetails/getMinimumCaseDetails";
import getCaseNotes from "./handlers/cases/getCaseNotes";
import createCaseNote from "./handlers/cases/createCaseNote";
import editCaseNote from "./handlers/cases/editCaseNote/editCaseNote";
import removeCaseNote from "./handlers/cases/removeCaseNote/removeCaseNote";
import changeStatus from "./handlers/cases/changeStatus/changeStatus";
import updateCaseNarrative from "./handlers/cases/updateCaseNarrative";
import getCaseHistory from "./handlers/cases/getCaseHistory/getCaseHistory";
import addCaseOfficer from "./handlers/officers/addCaseOfficer/addCaseOfficer";
import editCaseOfficer from "./handlers/officers/editCaseOfficer/editCaseOfficer";
import removeCaseOfficer from "./handlers/officers/removeCaseOfficer/removeCaseOfficer";
import exportJob from "./handlers/cases/export/exportJob";
import scheduleExport from "./handlers/cases/export/scheduleExport";
import createOfficerAllegation from "./handlers/officerAllegations/createOfficerAllegation/createOfficerAllegation";
import editOfficerAllegation from "./handlers/officerAllegations/editOfficerAllegation/editOfficerAllegation";
import removeOfficerAllegation from "./handlers/officerAllegations/removeOfficerAllegation/removeOfficerAllegation";
import getReferralLetterData from "./handlers/cases/referralLetters/getReferralLetterData/getReferralLetterData";
import getReferralLetterPreview from "./handlers/cases/referralLetters/getReferralLetterPreview/getReferralLetterPreview";
import editOfficerHistory from "./handlers/cases/referralLetters/editOfficerHistory/editOfficerHistory";
import editIAProCorrections from "./handlers/cases/referralLetters/editIAProCorrections/editIAProCorrections";
import editRecommendedActions from "./handlers/cases/referralLetters/editRecommendedActions/editRecommendedActions";
import editReferralLetterAddresses from "./handlers/cases/referralLetters/editReferralLetter/editReferralLetterAddresses";
import editReferralLetterContent from "./handlers/cases/referralLetters/editReferralLetter/editReferralLetterContent";
import createCivilian from "./handlers/civilians/createCivilian";
import getReferralLetterEditStatus from "./handlers/cases/referralLetters/getReferralLetterEditStatus/getReferralLetterEditStatus";
import editCivilian from "./handlers/civilians/editCivilian";
import removeCivilian from "./handlers/civilians/removeCivilian";
import audit from "./handlers/auditLogs/audit";
import searchOfficers from "./handlers/officers/searchOfficers/searchOfficers";
import searchAllegations from "./handlers/allegations/searchAllegations";
import getAllegations from "./handlers/allegations/getAllegations";
import getClassifications from "./handlers/classifications/getClassifications";
import getIntakeSources from "./handlers/intake_sources/getIntakeSources";
import getRaceEthnicities from "./handlers/race_ethnicities/getRaceEthnicities";
import getRecommendedActions from "./handlers/cases/referralLetters/getRecommendedActions/getRecommendedActions";
import getFinalPdfDownloadUrl from "./handlers/cases/referralLetters/getFinalPdfDownloadUrl/getFinalPdfDownloadUrl";
import getReferralLetterPdf from "./handlers/cases/referralLetters/getReferralLetterPdf/getReferralLetterPdf";
import approveLetter from "./handlers/cases/referralLetters/approveLetter/approveLetter";
import getAttachmentDownloadUrl from "./handlers/cases/attachments/getAttachmentDownloadUrl";
import uploadAttachment from "./handlers/cases/attachments/uploadAttachment";
import deleteAttachment from "./handlers/cases/attachments/deleteAttachment";
import getArchivedCases from "./handlers/cases/getCases/getArchivedCases";
import getOfficerHistoryOptions from "./handlers/cases/referralLetters/getOfficerHistoryOptions/getOfficerHistoryOptions";
import getHeardAboutSources from "./handlers/heardAboutSources/getHeardAboutSources";

export const ROUTES_ALLOWED_TO_HANDLE_ARCHIVED_CASE = [
  "/cases/:caseId/case-notes",
  "/cases/:caseId/restore",
  "/cases/:caseId/attachments"
];

export const API_ROUTES = {
  "/export/job/:jobId": {
    get: {
      handler: exportJob,
      errorMessage:
        "Something went wrong and your export failed. Please try again."
    }
  },
  "/export/schedule/:operation": {
    get: {
      handler: scheduleExport,
      errorMessage:
        "Something went wrong and your export failed. Please try again."
    }
  },
  "/cases": {
    get: {
      handler: getWorkingCases,
      errorMessage:
        "Something went wrong and the cases were not loaded. Please try again."
    },
    post: {
      handler: createCase,
      errorMessage:
        "Something went wrong and the case was not created. Please try again."
    }
  },
  "/cases/archived-cases": {
    get: {
      handler: getArchivedCases,
      errorMessage:
        "Something went wrong and the archived cases were not loaded. Please try again."
    }
  },
  "/cases/:caseId": {
    get: {
      handler: getCase,
      errorMessage:
        "Something went wrong and the case details were not loaded. Please try again."
    },
    put: {
      handler: editCase,
      errorMessage:
        "Something went wrong and the case details were not updated. Please try again."
    },
    delete: {
      handler: archiveCase,
      errorMessage:
        "Something went wrong and the case was not archived. Please try again."
    }
  },
  "/cases/:caseId/restore": {
    put: {
      handler: restoreArchivedCase,
      errorMessage:
        "Something went wrong and the case was not restored. Please try again."
    }
  },
  "/cases/:caseId/minimum-case-details": {
    get: {
      handler: getMinimumCaseDetails,
      errorMessage:
        "Something went wrong and the case details were not loaded. Please try again."
    }
  },
  "/cases/:caseId/status": {
    put: {
      handler: changeStatus,
      errorMessage:
        "Something went wrong and the case status was not updated. Please try again."
    }
  },
  "/cases/:caseId/case-history": {
    get: {
      handler: getCaseHistory,
      errorMessage:
        "Something went wrong and the case history was not loaded. Please try again."
    }
  },
  "/cases/:caseId/narrative": {
    put: {
      handler: updateCaseNarrative,
      errorMessage:
        "Something went wrong and the case narrative was not updated. Please try again."
    }
  },
  "/cases/:caseId/case-notes": {
    get: {
      handler: getCaseNotes,
      errorMessage:
        "Something went wrong and the case notes were not loaded. Please try again."
    },
    post: {
      handler: createCaseNote,
      errorMessage:
        "Something went wrong and the case note was not created. Please try again."
    }
  },
  "/cases/:caseId/case-notes/:caseNoteId": {
    put: {
      handler: editCaseNote,
      errorMessage:
        "Something went wrong and the case note was not updated. Please try again."
    },
    delete: {
      handler: removeCaseNote,
      errorMessage:
        "Something went wrong and the case note was not removed. Please try again."
    }
  },
  "/cases/:caseId/cases-officers": {
    post: {
      handler: addCaseOfficer,
      errorMessage:
        "Something went wrong and the officer was not added. Please try again."
    }
  },
  "/cases/:caseId/cases-officers/:caseOfficerId": {
    put: {
      handler: editCaseOfficer,
      errorMessage:
        "Something went wrong and the officer was not updated. Please try again."
    },
    delete: {
      handler: removeCaseOfficer,
      errorMessage:
        "Something went wrong and the officer was not removed. Please try again."
    }
  },
  "/cases/:caseId/cases-officers/:caseOfficerId/officers-allegations": {
    post: {
      handler: createOfficerAllegation,
      errorMessage:
        "Something went wrong and the allegation was not added. Please try again."
    }
  },
  "/cases/:caseId/officers-allegations/:officerAllegationId": {
    put: {
      handler: editOfficerAllegation,
      errorMessage:
        "Something went wrong and the allegation was not updated. Please try again."
    },
    delete: {
      handler: removeOfficerAllegation,
      errorMessage:
        "Something went wrong and the allegation was not removed. Please try again."
    }
  },
  "/cases/:caseId/attachments": {
    post: {
      handler: uploadAttachment,
      errorMessage:
        "Something went wrong and the attachment was not uploaded. Please try again."
    }
  },
  "/cases/:caseId/attachments/:fileName": {
    delete: {
      handler: deleteAttachment,
      errorMessage:
        "Something went wrong and the attachment was not removed. Please try again."
    }
  },
  "/cases/:caseId/attachmentUrls/:fileName": {
    get: {
      handler: getAttachmentDownloadUrl,
      errorMessage:
        "Something went wrong and the attachment URL was not found. Please try again."
    }
  },
  "/cases/:caseId/referral-letter": {
    get: {
      handler: getReferralLetterData,
      errorMessage:
        "Something went wrong and the referral letter details were not loaded. Please try again."
    }
  },
  "/cases/:caseId/referral-letter/preview": {
    get: {
      handler: getReferralLetterPreview,
      errorMessage:
        "Something went wrong and the letter preview was not loaded. Please try again."
    }
  },
  "/cases/:caseId/referral-letter/edit-status": {
    get: {
      handler: getReferralLetterEditStatus,
      errorMessage:
        "Something went wrong and the referral letter details were not loaded. Please try again."
    }
  },
  "/cases/:caseId/referral-letter/officer-history": {
    put: {
      handler: editOfficerHistory,
      errorMessage:
        "Something went wrong and the officer history was not updated. Please try again."
    }
  },
  "/cases/:caseId/referral-letter/iapro-corrections": {
    put: {
      handler: editIAProCorrections,
      errorMessage:
        "Something went wrong and the IAPro corrections were not updated. Please try again."
    }
  },
  "/cases/:caseId/referral-letter/recommended-actions": {
    put: {
      handler: editRecommendedActions,
      errorMessage:
        "Something went wrong and the recommended actions were not updated. Please try again."
    }
  },
  "/cases/:caseId/referral-letter/addresses": {
    put: {
      handler: editReferralLetterAddresses,
      errorMessage:
        "Something went wrong and the letter was not updated. Please try again."
    }
  },
  "/cases/:caseId/referral-letter/content": {
    put: {
      handler: editReferralLetterContent,
      errorMessage:
        "Something went wrong and the letter was not updated. Please try again."
    }
  },
  "/cases/:caseId/referral-letter/final-pdf-download-url": {
    get: {
      handler: getFinalPdfDownloadUrl,
      errorMessage:
        "Something went wrong and the PDF URL was not found. Please try again."
    }
  },
  "/cases/:caseId/referral-letter/get-pdf": {
    get: {
      handler: getReferralLetterPdf,
      errorMessage:
        "Something went wrong and the PDF was not loaded. Please try again."
    }
  },
  "/cases/:caseId/referral-letter/approve-letter": {
    put: {
      handler: approveLetter,
      errorMessage:
        "Something went wrong and the case status was not updated. Please try again."
    }
  },
  "/cases/:caseId/civilians": {
    post: {
      handler: createCivilian,
      errorMessage:
        "Something went wrong and the civilian was not created. Please try again."
    }
  },
  "/cases/:caseId/civilians/:civilianId": {
    put: {
      handler: editCivilian,
      errorMessage:
        "Something went wrong and the civilian was not updated. Please try again."
    },
    delete: {
      handler: removeCivilian,
      errorMessage:
        "Something went wrong and the civilian was not removed from the case. Please try again."
    }
  },
  "/audit": {
    post: {
      handler: audit,
      errorMessage:
        "Something went wrong and the login was not audited. Please try again."
    }
  },
  "/officers/search": {
    get: {
      handler: searchOfficers,
      errorMessage:
        "Something went wrong and the search was not completed. Please try again."
    }
  },
  "/allegations/search": {
    get: {
      handler: searchAllegations,
      errorMessage:
        "Something went wrong and the search was not completed. Please try again."
    }
  },
  "/allegations": {
    get: {
      handler: getAllegations,
      errorMessage:
        "Something went wrong and the allegation values were not found. Please try again."
    }
  },
  "/classifications": {
    get: {
      handler: getClassifications,
      errorMessage:
        "Something went wrong and the classification values were not found. Please try again."
    }
  },
  "/intake-sources": {
    get: {
      handler: getIntakeSources,
      errorMessage:
        "Something went wrong and the intake source values were not found. Please try again."
    }
  },
  "/heard-about-sources": {
    get: {
      handler: getHeardAboutSources,
      errorMessage:
        "Something went wrong and the values for 'How did you hear about us?' were not found. Please try again."
    }
  },
  "/race-ethnicities": {
    get: {
      handler: getRaceEthnicities,
      errorMessage:
        "Something went wrong and the race/ethnicity values were not found. Please try again."
    }
  },
  "/recommended-actions": {
    get: {
      handler: getRecommendedActions,
      errorMessage:
        "Something went wrong and the recommended action values were not found. Please try again."
    }
  },
  "/officer-history-options": {
    get: {
      handler: getOfficerHistoryOptions,
      errorMessage:
        "Something went wrong and the officer history options could not be found. Please try again."
    }
  }
};

export const addRoutesToRouter = (router, routes) => {
  Object.keys(routes).map(path => {
    addMethodsForRoute(path, router, routes);
  });
};

const addMethodsForRoute = (path, router, routes) => {
  Object.keys(routes[path]).map(method => {
    addToRouter(router, method, path, routes[path][method].handler);
  });
};

const addToRouter = (router, method, path, handler) => {
  if (handler) {
    router[method](path, handler);
  }
};

export default API_ROUTES;
