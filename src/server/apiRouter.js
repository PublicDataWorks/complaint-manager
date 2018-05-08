const {EXPORT_AUDIT_LOG} = require("../sharedUtilities/constants");
const createCase = require("./handlers/cases/createCase");
const editCase = require("./handlers/cases/editCase");
const getCases = require("./handlers/cases/getCases");
const getCase = require("./handlers/cases/getCase");
const getRecentActivity = require("./handlers/cases/getRecentActivity");
const updateCaseNarrative = require("./handlers/cases/updateCaseNarrative");
const editCivilian = require("./handlers/civilians/editCivilian");
const createCivilian = require("./handlers/civilians/createCivilian");
const removeCivilian = require("./handlers/civilians/removeCivilian");
const createUser = require("./handlers/users/createUser");
const getUsers = require("./handlers/users/getUsers");
const audit = require("./handlers/audit_logs/audit");
const jwtCheck = require("./handlers/jtwCheck")
const jwtAuthz = require('express-jwt-authz')
const verifyUserInfo = require("./handlers/verifyUserNickname")
const authErrorHandler = require("./handlers/authErrorHandler")
const exportAuditLog = require("./handlers/audit_logs/export")
const searchOfficers = require("./handlers/officers/searchOfficers")
const addCaseOfficer = require("./handlers/officers/addCaseOfficer")
const createUserAction = require('./handlers/cases/createUserAction')
const attachmentRouter = require("./attachmentRouter")

const express = require('express')
const router = express.Router()

router.use(jwtCheck)
router.use(verifyUserInfo)
router.use(authErrorHandler)

//Any routes defined below this point will require authentication
router.post('/cases', createCase);
router.get('/cases', getCases);
router.get('/cases/:id', getCase)
router.get('/cases/:id/recent-activity', getRecentActivity)
router.post('/cases/:id/recent-activity', createUserAction)
router.put('/cases/:id', editCase)
router.put('/cases/:id/narrative', updateCaseNarrative)
router.get('/cases/:id/officers/search', searchOfficers);
router.post('/cases/:caseId/cases-officers', addCaseOfficer);
router.delete('/cases/:caseId/civilians/:civilianId', removeCivilian);

router.use('/cases/:id/attachments', attachmentRouter)

router.post('/civilian', createCivilian);
router.put('/civilian/:id', editCivilian);

router.post('/audit', audit);
router.post('/users', createUser);
router.get('/users', getUsers);
router.get('/export-audit-log', jwtAuthz([EXPORT_AUDIT_LOG]), exportAuditLog);

module.exports = router