const express = require('express');
const path = require('path');
const bodyParser = require('body-parser');

const healthCheck = require("./handlers/healthCheck");
const createCase = require("./handlers/cases/createCase");
const getCases = require("./handlers/cases/getCases");
const getCase = require("./handlers/cases/getCase");
const updateCaseNarrative = require("./handlers/cases/updateCaseNarrative");
const editCivilian = require("./handlers/cases/editCivilian");
const createUser = require("./handlers/users/createUser");
const getUsers = require("./handlers/users/getUsers");
const errorHandler = require("./handlers/errorHandler");
const jwtCheck = require("./handlers/jtwCheck")
const getUserProfile = require("./handlers/getUserProfile")
const authErrorHandler = require("./handlers/authErrorHandler")
const attachmentRouter = require("./attachmentRouter")

const app = express();
const buildDirectory = path.join(__dirname, '../../build');

app.use(bodyParser.json());
app.use(express.static(buildDirectory));

// Unprotected Routes must be defined before jwtCheck middleware is applied
app.get('/health-check', healthCheck);

app.use(jwtCheck)
app.use(getUserProfile.unless({path: ['/callback']}))
app.use(authErrorHandler)

//Any routes defined below this point will require authentication
app.post('/cases', createCase);
app.get('/cases', getCases);
app.get('/cases/:id', getCase)
app.put('/cases/:id/narrative', updateCaseNarrative)

app.use('/cases/:id/attachments', attachmentRouter)

app.put('/civilian/:id', editCivilian);
app.post('/users', createUser);
app.get('/users', getUsers);

app.get('*', function (req, res) {
    res.sendFile(path.join(buildDirectory, 'index.html'));
});

app.use(errorHandler)

module.exports = app;