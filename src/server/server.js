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
const jwtCheck = require("./handlers/jtwCheck")

const app = express();
const buildDirectory = path.join(__dirname, '../../build');

app.use(bodyParser.json());
app.use(express.static(buildDirectory));

// Unprotected Routes must be defined before jwtCheck middleware is applied
app.get('/health-check', healthCheck);

app.use(jwtCheck);

app.use(function (err, req, res, next) {
    if (err.name === 'UnauthorizedError') {
        res.send(401, 'invalid token...');
    }
});

//Any routes defined below this point will require authentication
app.post('/cases', createCase);
app.get('/cases', getCases);
app.put('/cases/:id/narrative', updateCaseNarrative);
app.post('/users', createUser);
app.get('/users', getUsers);

app.get('*', function (req, res) {
    res.sendFile(path.join(buildDirectory, 'index.html'));
});

app.use(errorHandler)

module.exports = app;