const { USER_PERMISSIONS } = require("../sharedUtilities/constants");
const jwtCheck = require("../server/handlers/jtwCheck");
const jwtAuthz = require("express-jwt-authz");
const verifyUserInfo = require("../server/handlers/verifyUserNickname");
const authErrorHandler = require("../server/handlers/authErrorHandler");

const exportAuditLog = require("./handlers/auditLogs/export");
const exportCases = require("./handlers/cases/export/exportCases");

const express = require("express");
const router = express.Router();

router.use(jwtCheck);
router.use(verifyUserInfo);
router.use(authErrorHandler);

//Any routes defined below this point will require authentication

router.get("/cases/export", exportCases);

router.get(
  "/export-audit-log",
  jwtAuthz([USER_PERMISSIONS.EXPORT_AUDIT_LOG]),
  exportAuditLog
);

module.exports = router;
