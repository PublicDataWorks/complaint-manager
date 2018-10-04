const { USER_PERMISSIONS } = require("../sharedUtilities/constants");
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
const createUser = require("./handlers/users/createUser");
const getUsers = require("./handlers/users/getUsers");
const audit = require("./handlers/auditLogs/audit");
const jwtCheck = require("./handlers/jtwCheck");
const jwtAuthz = require("express-jwt-authz");
const verifyUserInfo = require("./handlers/verifyUserNickname");
const authErrorHandler = require("./handlers/authErrorHandler");
const exportAuditLog = require("./handlers/auditLogs/export");
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
const getReferralLetter = require("./handlers/cases/referralLetters/getReferralLetter");
const { exportCases } = require("./handlers/cases/export/exportCases");
const exportJobs = require("./handlers/cases/export/exportJobs");
const exportJob = require("./handlers/cases/export/exportJob");

const express = require("express");
const router = express.Router();

router.use(jwtCheck);
router.use(verifyUserInfo);
router.use(authErrorHandler);

//Any routes defined below this point will require authentication
router.get("/export/jobs", exportJobs);
router.get("/export/job/:id", exportJob);

router.get("/cases/export", exportCases);
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
router.get("/cases/:caseId/referral-letter", getReferralLetter);

router.use("/cases/:id/attachments", attachmentRouter);
router.use(
  "/cases/:id/attachmentUrls/:fileName",
  generateAttachmentDownloadUrl
);

router.post("/civilian", createCivilian);
router.put("/civilian/:id", editCivilian);

router.post("/audit", audit);
router.post("/users", createUser);
router.get("/users", getUsers);
router.get(
  "/export-audit-log",
  jwtAuthz([USER_PERMISSIONS.EXPORT_AUDIT_LOG]),
  exportAuditLog
);

router.get("/officers/search", searchOfficers);
router.get("/allegations/search", searchAllegations);
router.get("/allegations", getAllegations);
router.get("/classifications", getClassifications);

module.exports = router;
