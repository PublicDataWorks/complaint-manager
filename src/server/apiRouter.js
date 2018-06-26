const { USER_PERMISSIONS } = require("../sharedUtilities/constants");
const createCase = require("./handlers/cases/createCase");
const changeStatus = require("./handlers/cases/changeStatus/changeStatus");
const editCase = require("./handlers/cases/editCase");
const getCases = require("./handlers/cases/getCases");
const getCase = require("./handlers/cases/getCase/getCase");
const getRecentActivity = require("./handlers/cases/getRecentActivity");
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
const searchOfficers = require("./handlers/officers/searchOfficers");
const addCaseOfficer = require("./handlers/officers/addCaseOfficer/addCaseOfficer");
const getCaseOfficer = require("./handlers/officers/getCaseOfficer/getCaseOfficer");
const removeCaseOfficer = require("./handlers/officers/removeCaseOfficer/removeCaseOfficer");
const editCaseOfficer = require("./handlers/officers/editCaseOfficer/editCaseOfficer");
const editCaseNote = require("./handlers/cases/editCaseNote/editCaseNote");
const removeCaseNote = require("./handlers/cases/removeCaseNote/removeCaseNote");
const createCaseNote = require("./handlers/cases/createCaseNote");
const searchAllegations = require("./handlers/allegations/searchAllegations");
const getAllegations = require("./handlers/allegations/getAllegations");
const attachmentRouter = require("./attachmentRouter");
const createOfficerAllegation = require("./handlers/officerAllegations/createOfficerAllegation/createOfficerAllegation");

const express = require("express");
const router = express.Router();

router.use(jwtCheck);
router.use(verifyUserInfo);
router.use(authErrorHandler);

//Any routes defined below this point will require authentication
router.post("/cases", createCase);
router.get("/cases", getCases);
router.get("/cases/:id", getCase);
router.get("/cases/:id/recent-activity", getRecentActivity);
router.post("/cases/:id/recent-activity", createCaseNote);
router.put("/cases/:caseId/recent-activity/:caseNoteId", editCaseNote);
router.delete("/cases/:caseId/recent-activity/:caseNoteId", removeCaseNote);
router.get("/cases/:id/case-history", getCaseHistory);
router.put("/cases/:id", editCase);
router.put("/cases/:id/status", changeStatus);
router.put("/cases/:id/narrative", updateCaseNarrative);

router.get("/cases/:caseId/cases-officers/:caseOfficerId", getCaseOfficer);
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

router.delete("/cases/:caseId/civilians/:civilianId", removeCivilian);

router.use("/cases/:id/attachments", attachmentRouter);

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

module.exports = router;
