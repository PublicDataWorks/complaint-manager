const express = require('express');
const path = require('path');
const bodyParser = require('body-parser');

const healthCheck = require("./handlers/healthCheck");
const createCase = require("./handlers/cases/createCase");
const getCases = require("./handlers/cases/getCases");
const updateCaseNarrative = require("./handlers/cases/updateCaseNarrative");
const createUser = require("./handlers/users/createUser");
const getUsers = require("./handlers/users/getUsers");
const errorHandler = require("./handlers/errorHandler");

const app = express();
const buildDirectory = path.join(__dirname, '../../build');

app.use(bodyParser.json());
app.use(express.static(buildDirectory));

app.get('/health-check', healthCheck);
app.post('/cases', createCase);
app.get('/cases', getCases);
app.put('/case/:id/narrative', updateCaseNarrative);
app.post('/users', createUser);
app.get('/users', getUsers);

app.get('*', function (req, res) {
    res.sendFile(path.join(buildDirectory, 'index.html'));
});

app.use(errorHandler)

module.exports = app;