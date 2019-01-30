import editOfficerHistory from "./handlers/cases/referralLetters/editOfficerHistory/editOfficerHistory";
import editIAProCorrections from "./handlers/cases/referralLetters/editIAProCorrections/editIAProCorrections";
import editRecommendedActions from "./handlers/cases/referralLetters/editRecommendedActions/editRecommendedActions";
import getLetterPreview from "./handlers/cases/referralLetters/getLetterPreview/getLetterPreview";
import editReferralLetterAddresses from "./handlers/cases/referralLetters/editReferralLetter/editReferralLetterAddresses";
import editReferralLetterContent from "./handlers/cases/referralLetters/editReferralLetter/editReferralLetterContent";
import getPdf from "./handlers/cases/referralLetters/getPdf/getPdf";
import approveLetter from "./handlers/cases/referralLetters/approveLetter/approveLetter";
import getFinalPdfUrl from "./handlers/cases/referralLetters/getFinalPdfUrl/getFinalPdfUrl";
import getMinimumCaseDetails from "./handlers/cases/getMinimumCaseDetails/getMinimumCaseDetails";
import getIntakeSources from "./handlers/intake_sources/getIntakeSources";
import getLetterType from "./handlers/cases/referralLetters/getLetterType/getLetterType";
import getRaceEthnicities from "./handlers/race_ethnicities/getRaceEthnicities";
import archiveCase from "./handlers/cases/archiveCase/archiveCase";
import { handleCaseIdParam } from "./handlers/paramHandler";
import restoreArchivedCase from "./handlers/cases/restoreArchivedCase/restoreArchivedCase";

const createCase = require("./handlers/cases/createCase");
const changeStatus = require("./handlers/cases/changeStatus/changeStatus");
const editCase = require("./handlers/cases/editCase");
const getCases = require("./handlers/cases/getCases");
const getCase = require("./handlers/cases/getCase/getCase");
const getCaseNotes = require("./handlers/cases/getCaseNotes");
const getCaseHistory = require("./handlers/cases/getCaseHistory/getCaseHistory");
const updateCaseNarrative = require("./handlers/cases/updateCaseNarrative");
const editCivilian = require("./handlers/civilians/editCivilian");
const createCivilian = require("./handlers/civilians/createCivilian");
const removeCivilian = require("./handlers/civilians/removeCivilian");
const audit = require("./handlers/auditLogs/audit");
const jwtCheck = require("./handlers/jtwCheck");
const verifyUserInfo = require("./handlers/verifyUserNickname");
const authErrorHandler = require("./handlers/authErrorHandler");
const searchOfficers = require("./handlers/officers/searchOfficers/searchOfficers");
const addCaseOfficer = require("./handlers/officers/addCaseOfficer/addCaseOfficer");
const removeCaseOfficer = require("./handlers/officers/removeCaseOfficer/removeCaseOfficer");
const editCaseOfficer = require("./handlers/officers/editCaseOfficer/editCaseOfficer");
const editCaseNote = require("./handlers/cases/editCaseNote/editCaseNote");
const removeCaseNote = require("./handlers/cases/removeCaseNote/removeCaseNote");
const createCaseNote = require("./handlers/cases/createCaseNote");
const searchAllegations = require("./handlers/allegations/searchAllegations");
const getAllegations = require("./handlers/allegations/getAllegations");
const getClassifications = require("./handlers/classifications/getClassifications");
const attachmentRouter = require("./attachmentRouter");
const generateAttachmentDownloadUrl = require("./handlers/cases/attachments/generateAttachmentDownloadUrl");
const createOfficerAllegation = require("./handlers/officerAllegations/createOfficerAllegation/createOfficerAllegation");
const editOfficerAllegation = require("./handlers/officerAllegations/editOfficerAllegation/editOfficerAllegation");
const removeOfficerAllegation = require("./handlers/officerAllegations/removeOfficerAllegation/removeOfficerAllegation");
const getReferralLetterData = require("./handlers/cases/referralLetters/getReferralLetterData/getReferralLetterData");
const scheduleExport = require("./handlers/cases/export/scheduleExport");
const exportJob = require("./handlers/cases/export/exportJob");
const getRecommendedActions = require("./handlers/cases/referralLetters/getRecommendedActions/getRecommendedActions");

const express = require("express");
const router = express.Router();

router.use(jwtCheck);
router.use(verifyUserInfo);
router.use(authErrorHandler);

router.param("caseId", handleCaseIdParam);

//Any routes defined below this point will require authentication
router.get("/export/job/:jobId", exportJob);
router.get("/export/schedule/:operation", scheduleExport);
router.post("/cases", createCase);
router.get("/cases", getCases);
router.get("/cases/:caseId/minimum-case-details", getMinimumCaseDetails);
router.get("/cases/:caseId", getCase);
router.delete("/cases/:caseId", archiveCase);
router.put("/cases/:caseId/restore", restoreArchivedCase);
router.get("/cases/:caseId/case-notes", getCaseNotes);
router.post("/cases/:caseId/case-notes", createCaseNote);
router.put("/cases/:caseId/case-notes/:caseNoteId", editCaseNote);
router.delete("/cases/:caseId/case-notes/:caseNoteId", removeCaseNote);
router.get("/cases/:caseId/case-history", getCaseHistory);
router.put("/cases/:caseId", editCase);
router.put("/cases/:caseId/status", changeStatus);
router.put("/cases/:caseId/narrative", updateCaseNarrative);

router.post("/cases/:caseId/cases-officers", addCaseOfficer);
router.put("/cases/:caseId/cases-officers/:caseOfficerId", editCaseOfficer);
router.delete(
  "/cases/:caseId/cases-officers/:caseOfficerId",
  removeCaseOfficer
);

router.post(
  "/cases/:caseId/cases-officers/:caseOfficerId/officers-allegations",
  createOfficerAllegation
);
router.put(
  "/cases/:caseId/officers-allegations/:officerAllegationId",
  editOfficerAllegation
);
router.delete(
  "/cases/:caseId/officers-allegations/:officerAllegationId",
  removeOfficerAllegation
);

router.get("/cases/:caseId/referral-letter", getReferralLetterData);
router.get("/cases/:caseId/referral-letter/preview", getLetterPreview);
router.get("/cases/:caseId/referral-letter/letter-type", getLetterType);
router.put(
  "/cases/:caseId/referral-letter/officer-history",
  editOfficerHistory
);
router.put(
  "/cases/:caseId/referral-letter/iapro-corrections",
  editIAProCorrections
);
router.put(
  "/cases/:caseId/referral-letter/recommended-actions",
  editRecommendedActions
);
router.put(
  "/cases/:caseId/referral-letter/addresses",
  editReferralLetterAddresses
);
router.put("/cases/:caseId/referral-letter/content", editReferralLetterContent);

router.use("/cases/:caseId/attachments", attachmentRouter);
router.use(
  "/cases/:caseId/attachmentUrls/:fileName",
  generateAttachmentDownloadUrl
);

router.post("/cases/:caseId/civilian", createCivilian);
router.put("/cases/:caseId/civilian/:civilianId", editCivilian);
router.delete("/cases/:caseId/civilians/:civilianId", removeCivilian);

router.post("/audit", audit);

router.get("/officers/search", searchOfficers);
router.get("/allegations/search", searchAllegations);
router.get("/allegations", getAllegations);
router.get("/classifications", getClassifications);
router.get("/intake-sources", getIntakeSources);
router.get("/race-ethnicities", getRaceEthnicities);
router.get("/recommended-actions", getRecommendedActions);

router.get("/cases/:caseId/referral-letter/final-pdf-url", getFinalPdfUrl);
router.get("/cases/:caseId/referral-letter/get-pdf", getPdf);

router.put("/cases/:caseId/referral-letter/approve-letter", approveLetter);

module.exports = router;
