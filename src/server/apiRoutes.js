import getCase from "./handlers/cases/getCase/getCase";
import getWorkingCases from "./handlers/cases/getCases/getWorkingCases";
import createCase from "./handlers/cases/createCase";
import editCase from "./handlers/cases/editCase";
import editLetterContent from "./handlers/cases/letters/editLetterContent";
import archiveCase from "./handlers/cases/archiveCase/archiveCase";
import restoreArchivedCase from "./handlers/cases/restoreArchivedCase/restoreArchivedCase";
import getMinimumCaseDetails from "./handlers/cases/getMinimumCaseDetails/getMinimumCaseDetails";
import retrieveCaseNotes from "./handlers/cases/caseNotes/retrieveCaseNotes";
import createCaseNote from "./handlers/cases/caseNotes/createCaseNote";
import updateCaseNote from "./handlers/cases/caseNotes/updateCaseNote";
import deleteCaseNote from "./handlers/cases/caseNotes/deleteCaseNote";
import changeStatus from "./handlers/cases/changeStatus/changeStatus";
import updateCaseNarrative from "./handlers/cases/updateCaseNarrative";
import getCaseHistory from "./handlers/cases/getCaseHistory/getCaseHistory";
import addCaseOfficer from "./handlers/officers/addCaseOfficer/addCaseOfficer";
import addCaseInmate from "./handlers/inmates/addCaseInmate";
import editCaseInmate from "./handlers/inmates/editCaseInmate";
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
import editRecommendedActions from "./handlers/cases/referralLetters/editRecommendedActions/editRecommendedActions";
import editReferralLetterAddresses from "./handlers/cases/referralLetters/editReferralLetter/editReferralLetterAddresses";
import editReferralLetterContent from "./handlers/cases/referralLetters/editReferralLetter/editReferralLetterContent";
import createCivilian from "./handlers/civilians/createCivilian";
import getReferralLetterEditStatus from "./handlers/cases/referralLetters/getReferralLetterEditStatus/getReferralLetterEditStatus";
import editCivilian from "./handlers/civilians/editCivilian";
import removeCivilian from "./handlers/civilians/removeCivilian";
import audit from "./handlers/audits/auditAuthentication";
import searchOfficers from "./handlers/officers/searchOfficers/searchOfficers";
import searchInmates from "./handlers/inmates/searchInmates";
import searchAllegations from "./handlers/allegations/searchAllegations";
import searchCases from "./handlers/cases/casesSearch/searchCases";
import retrieveAllegations from "./handlers/allegations/retrieveAllegations";
import getClassifications from "./handlers/classifications/getClassifications";
import getIntakeSources from "./handlers/intake_sources/getIntakeSources";
import getRaceEthnicities from "./handlers/race_ethnicities/getRaceEthnicities";
import getCivilianTitles from "./handlers/civilianTitles/getCivilianTitles";
import getDistricts from "./handlers/districts/getDistricts";
import getRecommendedActions from "./handlers/cases/referralLetters/getRecommendedActions/getRecommendedActions";
import getFinalPdfDownloadUrl from "./handlers/cases/referralLetters/getFinalPdfDownloadUrl/getFinalPdfDownloadUrl";
import getReferralLetterPdf from "./handlers/cases/referralLetters/getReferralLetterPdf/getReferralLetterPdf";
import approveLetter from "./handlers/cases/referralLetters/approveLetter/approveLetter";
import retrieveAttachmentDownloadUrl from "./handlers/cases/attachments/retrieveAttachmentDownloadUrl";
import uploadAttachment from "./handlers/cases/attachments/uploadAttachment";
import deleteAttachment from "./handlers/cases/attachments/deleteAttachment";
import getArchivedCases from "./handlers/cases/getCases/getArchivedCases";
import getOfficerHistoryOptions from "./handlers/cases/referralLetters/getOfficerHistoryOptions/getOfficerHistoryOptions";
import getHowDidYouHearAboutUsSources from "./handlers/howDidYouHearAboutUsSources/getHowDidYouHearAboutUsSources";
import getGenderIdentities from "./handlers/genderIdentities/getGenderIdentities";
import retrieveCaseNoteActions from "./handlers/caseNoteActions/retrieveCaseNoteActions";
import createCaseTag from "./handlers/cases/caseTags/createCaseTag";
import retrieveCaseTags from "./handlers/cases/caseTags/retrieveCaseTags";
import getTags from "./handlers/tags/getTags";
import editTag from "./handlers/tags/editTag";
import removeTag from "./handlers/tags/removeTag";
import mergeTag from "./handlers/tags/mergeTag";
import deleteCaseTag from "./handlers/cases/caseTags/deleteCaseTag";
import getUsers from "./handlers/users/getUsers";
import { extractNotifications } from "./handlers/cases/getNotifications";
import getNotificationStatus from "./handlers/cases/getNotificationStatus";
import getPublicData from "./handlers/data/getPublicData";
import getData from "./handlers/data/getData";
import editClassifications from "./handlers/cases/referralLetters/editRecommendedActions/editClassifications";
import { getMessageStream } from "./handlers/cases/getMessageStream";
import markNotificationAsRead from "./handlers/cases/markNotificationAsRead";
import getConfigs from "./handlers/configs/getConfigs";
import logHandler from "./handlers/logHandler";
import { USER_PERMISSIONS } from "../sharedUtilities/constants";
import Boom from "boom";
import retrieveSigners from "./handlers/signers/retrieveSigners";
import getSignature from "./handlers/signers/getSignature";
import addSigner from "./handlers/signers/addSigner";
import editSigner from "./handlers/signers/editSigner";
import deleteSigner from "./handlers/signers/deleteSigner";
import uploadSignature from "./handlers/signers/uploadSignature";
import getCaseStatuses from "./handlers/caseStatuses/getCaseStatuses";
import getVisualizationConfigs from "./handlers/visualizationConfigs/getVisualizationConfigs";
import getLetterTypes from "./handlers/letterTypes/getLetterTypes";
import editLetterType from "./handlers/letterTypes/editLetterType";
import deleteLetterType from "./handlers/letterTypes/deleteLetterType";
import getComplaintTypes from "./handlers/complaintTypes/getComplaintTypes";
import addLetterType from "./handlers/letterTypes/addLetterType";
import generateExampleLetterPreview from "./handlers/letterTypes/generateExampleLetterPreview";
import generateLetterAndUploadToS3 from "./handlers/cases/letters/generateLetterAndUploadToS3";
import generateLetterForPreview from "./handlers/cases/letters/generateLetterForPreview";
import editLetterAddresses from "./handlers/cases/letters/editLetterAddresses";
import retrieveFacilities from "./handlers/inmates/retrieveFacilities";
import removeCaseInmate from "./handlers/inmates/removeCaseInmate";
import getLetterPdf from "./handlers/cases/letters/getLetterPdf";
import updateLetterAndUploadToS3 from "./handlers/cases/letters/updateLetterAndUploadToS3";
import retrievePersonTypes from "./handlers/personTypes/retrievePersonTypes";
import updateSearchIndex from "./handlers/cases/casesSearch/updateSearchIndex";
import getRuleChapters from "./handlers/ruleChapters/getRuleChapters";
import getDirectives from "./handlers/directives/getDirectives";
import getPriorityLevels from "./handlers/priority_levels/getPriorityLevels";
import getPriorityReasons from "./handlers/priority_reasons/getPriorityReasons";
import getHousingUnits from "./handlers/housingUnits/getHousingUnits";
import processPersonMassUpload from "./handlers/processPersonMassUpload";
import getCsvFileFromS3 from "./handlers/getCsvFileFromS3";

export const ROUTES_ALLOWED_TO_HANDLE_ARCHIVED_CASE = [
  "/cases/:caseId/case-notes",
  "/cases/:caseId/case-notes/:caseNoteId",
  "/cases/:caseId/restore",
  "/cases/:caseId/attachments"
];

export const PUBLIC_ROUTES = {
  "/configs": {
    get: {
      handler: getConfigs,
      errorMessage:
        "Something went wrong while getting configs.  Please try again."
    }
  },
  "/person-types": {
    get: {
      handler: retrievePersonTypes,
      errorMessage:
        "Something went wrong while getting personTypes.  Please try again."
    }
  },
  "/public-data": {
    get: {
      handler: getPublicData,
      errorMessage:
        "Dashboard is not updating at this time, please check back later."
    }
  },
  "/visualizations": {
    get: {
      handler: getVisualizationConfigs,
      errorMessage:
        "Something went wrong getting the visualization configurations"
    }
  }
};

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
    post: {
      handler: createCase,
      requiredPermission: USER_PERMISSIONS.CREATE_CASE,
      errorMessage:
        "Something went wrong and the case was not created. Please try again."
    },
    get: {
      handler: getWorkingCases,
      errorMessage:
        "Something went wrong and the cases were not loaded. Please try again."
    }
  },
  "/cases/archived-cases": {
    get: {
      handler: getArchivedCases,
      errorMessage:
        "Something went wrong and the archived cases were not loaded. Please try again."
    }
  },
  "/cases/search": {
    get: {
      handler: searchCases,
      errorMessage:
        "Something went wrong and the search was not completed. Please try again."
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
      requiredPermission: USER_PERMISSIONS.EDIT_CASE,
      errorMessage:
        "Something went wrong and the case details were not updated. Please try again."
    },
    delete: {
      handler: archiveCase,
      requiredPermission: USER_PERMISSIONS.ARCHIVE_CASE,
      errorMessage:
        "Something went wrong and the case was not archived. Please try again."
    }
  },
  "/cases/:caseId/restore": {
    put: {
      handler: restoreArchivedCase,
      requiredPermission: USER_PERMISSIONS.ARCHIVE_CASE,
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
      requiredPermission: USER_PERMISSIONS.SETUP_LETTER,
      errorMessage:
        "Something went wrong and the case status was not updated. Please try again."
    }
  },
  "/cases/:caseId/case-history": {
    get: {
      handler: getCaseHistory,
      requiredPermission: USER_PERMISSIONS.VIEW_CASE_HISTORY,
      errorMessage:
        "Something went wrong and the case history was not loaded. Please try again."
    }
  },
  "/cases/:caseId/narrative": {
    put: {
      handler: updateCaseNarrative,
      requiredPermission: USER_PERMISSIONS.EDIT_CASE,
      errorMessage:
        "Something went wrong and the case narrative was not updated. Please try again."
    }
  },
  "/cases/:caseId/case-notes": {
    get: {
      handler: retrieveCaseNotes,
      errorMessage:
        "Something went wrong and the case notes were not loaded. Please try again."
    },
    post: {
      handler: createCaseNote,
      requiredPermission: USER_PERMISSIONS.CREATE_CASE_NOTE,
      errorMessage:
        "Something went wrong and the case note was not created. Please try again."
    }
  },
  "/cases/:caseId/case-notes/:caseNoteId": {
    put: {
      handler: updateCaseNote,
      errorMessage:
        "Something went wrong and the case note was not updated. Please try again."
    },
    delete: {
      handler: deleteCaseNote,
      errorMessage:
        "Something went wrong and the case note was not removed. Please try again."
    }
  },
  "/cases/:caseId/case-tags": {
    post: {
      handler: createCaseTag,
      requiredPermission: USER_PERMISSIONS.ADD_TAG_TO_CASE,
      errorMessage:
        "Something went wrong and the case tag was not created. Please try again."
    },
    get: {
      handler: retrieveCaseTags,
      errorMessage:
        "Something went wrong and the case tags were not loaded. Please try again."
    }
  },
  "/cases/:caseId/case-tags/:caseTagId": {
    delete: {
      handler: deleteCaseTag,
      requiredPermission: USER_PERMISSIONS.ADD_TAG_TO_CASE,
      errorMessage:
        "Something went wrong and the case tag was not removed. Please try again."
    }
  },
  "/cases/:caseId/inmates/:caseInmateId": {
    delete: {
      handler: removeCaseInmate,
      requiredPermission: USER_PERMISSIONS.EDIT_CASE,
      errorMessage:
        "Something went wrong and the person in custody was not removed from the case. Please try again."
    },
    put: {
      handler: editCaseInmate,
      requiredPermission: USER_PERMISSIONS.EDIT_CASE,
      errorMessage:
        "Something went wrong and the person in custody was not updated. Please try again."
    }
  },
  "/cases/:caseId/inmates": {
    post: {
      handler: addCaseInmate,
      requiredPermission: USER_PERMISSIONS.EDIT_CASE,
      errorMessage:
        "Something went wrong and the person in custody was not added. Please try again."
    }
  },
  "/cases/:caseId/cases-officers": {
    post: {
      handler: addCaseOfficer,
      requiredPermission: USER_PERMISSIONS.EDIT_CASE,
      errorMessage:
        "Something went wrong and the officer was not added. Please try again."
    }
  },
  "/cases/:caseId/cases-officers/:caseOfficerId": {
    put: {
      handler: editCaseOfficer,
      requiredPermission: USER_PERMISSIONS.EDIT_CASE,
      errorMessage:
        "Something went wrong and the officer was not updated. Please try again."
    },
    delete: {
      handler: removeCaseOfficer,
      requiredPermission: USER_PERMISSIONS.EDIT_CASE,
      errorMessage:
        "Something went wrong and the officer was not removed. Please try again."
    }
  },
  "/cases/:caseId/cases-officers/:caseOfficerId/officers-allegations": {
    post: {
      handler: createOfficerAllegation,
      requiredPermission: USER_PERMISSIONS.EDIT_CASE,
      errorMessage:
        "Something went wrong and the allegation was not added. Please try again."
    }
  },
  "/cases/:caseId/officers-allegations/:officerAllegationId": {
    put: {
      handler: editOfficerAllegation,
      requiredPermission: USER_PERMISSIONS.EDIT_CASE,
      errorMessage:
        "Something went wrong and the allegation was not updated. Please try again."
    },
    delete: {
      handler: removeOfficerAllegation,
      requiredPermission: USER_PERMISSIONS.EDIT_CASE,
      errorMessage:
        "Something went wrong and the allegation was not removed. Please try again."
    }
  },
  "/cases/:caseId/attachments": {
    post: {
      handler: uploadAttachment,
      requiredPermission: USER_PERMISSIONS.EDIT_CASE,
      errorMessage:
        "Something went wrong and the attachment was not uploaded. Please try again."
    },
    delete: {
      handler: deleteAttachment,
      requiredPermission: USER_PERMISSIONS.EDIT_CASE,
      errorMessage:
        "Something went wrong and the attachment was not removed. Please try again."
    }
  },
  "/cases/:caseId/attachmentUrls": {
    get: {
      handler: retrieveAttachmentDownloadUrl,
      errorMessage:
        "Something went wrong and the attachment URL was not found. Please try again."
    }
  },
  "/cases/:caseId/letters": {
    post: {
      handler: generateLetterAndUploadToS3,
      requiredPermission: USER_PERMISSIONS.UPDATE_ALL_CASE_STATUSES,
      errorMessage:
        "Something went wrong and the PDF was not loaded. Please try again."
    }
  },
  "/cases/:caseId/letters/:letterId": {
    put: {
      handler: updateLetterAndUploadToS3,
      errorMessage:
        "Something went wrong and the letter was not updated. Please try again."
    }
  },
  "/cases/:caseId/letters/:letterId/addresses": {
    put: {
      handler: editLetterAddresses,
      errorMessage:
        "Something went wrong and the letter was not updated. Please try again."
    }
  },
  "/cases/:caseId/letters/:letterId/content": {
    put: {
      handler: editLetterContent,
      errorMessage:
        "Something went wrong and the letter was not updated. Please try again."
    }
  },
  "/cases/:caseId/letters/:letterId/pdf": {
    get: {
      handler: getLetterPdf,
      errorMessage:
        "Something went wrong and the letter was not updated. Please try again."
    }
  },
  "/cases/:caseId/letters/:letterId/preview": {
    get: {
      handler: generateLetterForPreview,
      errorMessage:
        "Something went wrong and the letter preview was not loaded. Please try again."
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
      requiredPermission: USER_PERMISSIONS.SETUP_LETTER,
      errorMessage:
        "Something went wrong and the officer history was not updated. Please try again."
    }
  },
  "/cases/:caseId/referral-letter/recommended-actions": {
    put: {
      handler: editRecommendedActions,
      requiredPermission: USER_PERMISSIONS.SETUP_LETTER,
      errorMessage:
        "Something went wrong and the recommended actions were not updated. Please try again."
    }
  },
  "/cases/:caseId/referral-letter/classifications": {
    put: {
      handler: editClassifications,
      errorMessage:
        "Something went wrong and the classifications were not updated. Please try again."
    }
  },
  "/cases/:caseId/referral-letter/addresses": {
    put: {
      handler: editReferralLetterAddresses,
      requiredPermission: USER_PERMISSIONS.SETUP_LETTER,
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
      requiredPermission: USER_PERMISSIONS.SETUP_LETTER,
      errorMessage:
        "Something went wrong and the case status was not updated. Please try again."
    }
  },
  "/cases/:caseId/civilians": {
    post: {
      handler: createCivilian,
      requiredPermission: USER_PERMISSIONS.EDIT_CASE,
      errorMessage:
        "Something went wrong and the civilian was not created. Please try again."
    }
  },
  "/cases/:caseId/civilians/:civilianId": {
    put: {
      handler: editCivilian,
      requiredPermission: USER_PERMISSIONS.EDIT_CASE,
      errorMessage:
        "Something went wrong and the civilian was not updated. Please try again."
    },
    delete: {
      handler: removeCivilian,
      requiredPermission: USER_PERMISSIONS.EDIT_CASE,
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
  "/inmates/search": {
    get: {
      handler: searchInmates,
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
      handler: retrieveAllegations,
      errorMessage:
        "Something went wrong and the allegation values were not found. Please try again."
    }
  },
  "/case-note-actions": {
    get: {
      handler: retrieveCaseNoteActions,
      errorMessage:
        "Something went wrong and the case note action values were not found. Please try again."
    }
  },
  "/classifications": {
    get: {
      handler: getClassifications,
      errorMessage:
        "Something went wrong and the classification values were not found. Please try again."
    }
  },
  "/tags": {
    get: {
      handler: getTags,
      errorMessage:
        "Something went wrong and the tag values were not found. Please try again."
    }
  },
  "/tags/:id": {
    put: {
      handler: editTag,
      requiredPermission: USER_PERMISSIONS.MANAGE_TAGS,
      errorMessage:
        "Something went wrong and the tag could not be updated. Please try again."
    },
    delete: {
      handler: removeTag,
      requiredPermission: USER_PERMISSIONS.MANAGE_TAGS,
      errorMessage:
        "Something went wrong and the tag could not be deleted. Please try again."
    },
    patch: {
      handler: mergeTag,
      requiredPermission: USER_PERMISSIONS.MANAGE_TAGS,
      errorMessage:
        "Something went wrong and the tag could not be merged. Please try again."
    }
  },
  "/intake-sources": {
    get: {
      handler: getIntakeSources,
      errorMessage:
        "Something went wrong and the intake source values were not found. Please try again."
    }
  },
  "/gender-identities": {
    get: {
      handler: getGenderIdentities,
      errorMessage:
        "Something went wrong and the gender identity values were not found. Please try again."
    }
  },
  "/how-did-you-hear-about-us-sources": {
    get: {
      handler: getHowDidYouHearAboutUsSources,
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
  "/civilian-titles": {
    get: {
      handler: getCivilianTitles,
      errorMessage:
        "Something went wrong and the civilian title values were not found. Please try again."
    }
  },
  "/data": {
    get: {
      handler: getData,
      errorMessage:
        "Dashboard is not updating at this time, please check back later."
    }
  },
  "/districts": {
    get: {
      handler: getDistricts,
      errorMessage:
        "Something went wrong and the district values were not found. Please try again."
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
  },
  "/users": {
    get: {
      handler: getUsers,
      errorMessage:
        "Something went wrong and the users could not be found. Please try again."
    }
  },
  "/messageStream": {
    get: {
      handler: getMessageStream,
      errorMessage:
        "Something went wrong and message stream could not be created. Please try again."
    }
  },
  "/notifications/:user": {
    get: {
      handler: extractNotifications,
      errorMessage:
        "Something went wrong and notifications could not be retrieved. Please try again."
    }
  },
  "/notifications/mark-as-read/:notificationId": {
    put: {
      handler: markNotificationAsRead,
      errorMessage:
        "Something went wrong, and there was a problem updating your notifications."
    }
  },
  "/notifications/:caseNoteId/:notificationId": {
    get: {
      handler: getNotificationStatus,
      errorMessage:
        "Something went wrong and notifications could not be verified. Please try again."
    }
  },
  "/facilities": {
    get: {
      handler: retrieveFacilities,
      errorMessage:
        "Something went wrong while getting facilities.  Please try again."
    }
  },
  "/facilities/:facilityId/housing-units": {
    get: {
      handler: getHousingUnits,
      errorMessage: "Something went wrong while getting housing units"
    }
  },
  "/letter-types": {
    get: {
      handler: getLetterTypes,
      errorMessage: "Something went wrong while retrieving letter types"
    },
    post: {
      handler: addLetterType,
      requiredPermission: USER_PERMISSIONS.ADMIN_ACCESS,
      errorMessage: "Something went wrong while adding letter type"
    }
  },
  "/letter-types/:typeId": {
    put: {
      handler: editLetterType,
      requiredPermission: USER_PERMISSIONS.ADMIN_ACCESS,
      errorMessage: "Something went wrong while editing letter type"
    },
    delete: {
      handler: deleteLetterType,
      requiredPermission: USER_PERMISSIONS.ADMIN_ACCESS,
      errorMessage: "Something went wrong while deleting letter type"
    }
  },
  "/signers": {
    get: {
      handler: retrieveSigners,
      requiredPermission: USER_PERMISSIONS.ADMIN_ACCESS,
      errorMessage: "Something went wrong while retrieving signers"
    },
    post: {
      handler: addSigner,
      requiredPermission: USER_PERMISSIONS.ADMIN_ACCESS,
      errorMessage: "Something went wrong while adding signers"
    }
  },
  "/signers/:id": {
    put: {
      handler: editSigner,
      requiredPermission: USER_PERMISSIONS.ADMIN_ACCESS,
      errorMessage: "Something went wrong while updating signer"
    },
    delete: {
      handler: deleteSigner,
      requiredPermission: USER_PERMISSIONS.ADMIN_ACCESS,
      errorMessage: "Something went wrong while removing signer"
    }
  },
  "/signers/:id/signature": {
    get: {
      handler: getSignature,
      requiredPermission: USER_PERMISSIONS.ADMIN_ACCESS,
      errorMessage: "Something went wrong while retrieving the signature image"
    }
  },
  "/signatures": {
    post: {
      handler: uploadSignature,
      requiredPermission: USER_PERMISSIONS.ADMIN_ACCESS,
      errorMessage: "Something went wrong while uploading a signature"
    }
  },
  "/logs": {
    post: {
      handler: logHandler,
      errorMessage: "Something went wrong while logging. Please try again."
    }
  },
  "/case-statuses": {
    get: {
      handler: getCaseStatuses,
      errorMessage:
        "Something went wrong while loading the case statuses. Please try again."
    }
  },
  "/complaint-types": {
    get: {
      handler: getComplaintTypes,
      errorMessage: "Something went wrong while loading the complaint types"
    }
  },
  "/example-letter-preview": {
    post: {
      handler: generateExampleLetterPreview,
      errorMessage: "Something went wrong while generating the example letter"
    }
  },
  "/search-index": {
    post: {
      handler: updateSearchIndex,
      requiredPermission: USER_PERMISSIONS.EDIT_CASE,
      errorMessage: "Something went wrong while updating the search index"
    }
  },
  "/rule-chapters": {
    get: {
      handler: getRuleChapters,
      errorMessage: "Something went wrong while getting rule chapters"
    }
  },
  "/directives": {
    get: {
      handler: getDirectives,
      errorMessage: "Something went wrong while getting directives"
    }
  },
  "/priority-levels": {
    get: {
      handler: getPriorityLevels,
      errorMessage: "Something went wrong while getting priority levels"
    }
  },
  "/priority-reasons": {
    get: {
      handler: getPriorityReasons,
      errorMessage: "Something went wrong while getting priority reasons"
    }
  },
  "/person-mass-upload": {
    post: {
      handler: processPersonMassUpload,
      errorMessage: "Something went wrong while processing mass upload"
    }
  },
  "/csv-template": {
    get: {
      handler: getCsvFileFromS3,
      errorMessage: "Something went wrong while getting CSV template"
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
    addToRouter(
      router,
      method,
      path,
      routes[path][method].handler,
      routes[path][method].requiredPermission
    );
  });
};

const addToRouter = (router, method, path, handler, requiredPermission) => {
  if (handler) {
    if (requiredPermission) {
      router[method](path, async (request, response, next) => {
        if (request?.permissions?.includes(requiredPermission)) {
          await handler(request, response, next);
        } else {
          next(Boom.forbidden("You are not authorized to perform this action"));
        }
      });
    } else {
      router[method](path, handler);
    }
  }
};

export default API_ROUTES;
