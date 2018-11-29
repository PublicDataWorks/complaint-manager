import editOfficerHistory from "./handlers/cases/referralLetters/editOfficerHistory/editOfficerHistory";
import editIAProCorrections from "./handlers/cases/referralLetters/editIAProCorrections/editIAProCorrections";
import editRecommendedActions from "./handlers/cases/referralLetters/editRecommendedActions/editRecommendedActions";
import getLetterPreview from "./handlers/cases/referralLetters/getLetterPreview/getLetterPreview";
import editReferralLetterAddresses from "./handlers/cases/referralLetters/editReferralLetter/editReferralLetterAddresses";
import editReferralLetterContent from "./handlers/cases/referralLetters/editReferralLetter/editReferralLetterContent";
import getPdf from "./handlers/cases/referralLetters/getPdf/getPdf";
import approveLetter from "./handlers/cases/referralLetters/approveLetter/approveLetter";
import getFinalPdfUrl from "./handlers/cases/referralLetters/getFinalPdfUrl/getFinalPdfUrl";
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

//Any routes defined below this point will require authentication
router.get("/export/job/:id", exportJob);
router.get("/export/schedule/:operation", scheduleExport);
router.post("/cases", createCase);
router.get("/cases", getCases);
router.get("/cases/:id", getCase);
router.get("/cases/:id/case-notes", getCaseNotes);
router.post("/cases/:id/case-notes", createCaseNote);
router.put("/cases/:caseId/case-notes/:caseNoteId", editCaseNote);
router.delete("/cases/:caseId/case-notes/:caseNoteId", removeCaseNote);
router.get("/cases/:id/case-history", getCaseHistory);
router.put("/cases/:id", editCase);
router.put("/cases/:id/status", changeStatus);
router.put("/cases/:id/narrative", updateCaseNarrative);

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
router.put("/officers-allegations/:officerAllegationId", editOfficerAllegation);
router.delete(
  "/officers-allegations/:officerAllegationId",
  removeOfficerAllegation
);

router.delete("/cases/:caseId/civilians/:civilianId", removeCivilian);
router.get("/cases/:caseId/referral-letter", getReferralLetterData);
router.get("/cases/:caseId/referral-letter/preview", getLetterPreview);
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

router.use("/cases/:id/attachments", attachmentRouter);
router.use(
  "/cases/:id/attachmentUrls/:fileName",
  generateAttachmentDownloadUrl
);

router.post("/civilian", createCivilian);
router.put("/civilian/:id", editCivilian);

router.post("/audit", audit);

router.get("/officers/search", searchOfficers);
router.get("/allegations/search", searchAllegations);
router.get("/allegations", getAllegations);
router.get("/classifications", getClassifications);
router.get("/recommended-actions", getRecommendedActions);

router.get("/cases/:caseId/referral-letter/generate-pdf", getPdf);
router.get("/cases/:caseId/referral-letter/final-pdf-url", getFinalPdfUrl);

router.put("/cases/:caseId/referral-letter/approve-letter", approveLetter);

module.exports = router;
