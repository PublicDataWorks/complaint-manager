const createCase = require("./handlers/cases/createCase");
const getCases = require("./handlers/cases/getCases");
const getCase = require("./handlers/cases/getCase");
const updateCaseNarrative = require("./handlers/cases/updateCaseNarrative");
const editCivilian = require("./handlers/civilians/editCivilian");
const createCivilian = require("./handlers/civilians/createCivilian");
const createUser = require("./handlers/users/createUser");
const getUsers = require("./handlers/users/getUsers");
const logout = require("./handlers/users/logout");
const jwtCheck = require("./handlers/jtwCheck")
const getUserProfile = require("./handlers/getUserProfile")
const authErrorHandler = require("./handlers/authErrorHandler")
const exportAuditLog = require("./handlers/audit_logs/export")
const attachmentRouter = require("./attachmentRouter")

const express = require('express')
const router = express.Router()

router.use(jwtCheck)
router.use(getUserProfile.unless({path: ['/callback']}))
router.use(authErrorHandler)

//Any routes defined below this point will require authentication
router.post('/cases', createCase);
router.get('/cases', getCases);
router.get('/cases/:id', getCase)
router.put('/cases/:id/narrative', updateCaseNarrative)

router.use('/cases/:id/attachments', attachmentRouter)

router.post('/civilian', createCivilian);
router.put('/civilian/:id', editCivilian);

router.post('/logout', logout);
router.post('/users', createUser);
router.get('/users', getUsers);
router.get('/export-audit-log', exportAuditLog);

module.exports = router