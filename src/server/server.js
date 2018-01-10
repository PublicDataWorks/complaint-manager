const express = require('express');
const path = require('path');
const bodyParser = require('body-parser');

const healthCheck = require("./handlers/healthCheck");
const createCase = require("./handlers/createCase");
const getCases = require("./handlers/getCases");
const createUser = require("./handlers/createUser");
const getUsers = require("./handlers/getUsers");
const errorHandler = require("./handlers/errorHandler");

const app = express();
const buildDirectory = path.join(__dirname, '../../build');

app.use(bodyParser.json());
app.use(express.static(buildDirectory));

app.get('/health-check', healthCheck);
app.post('/cases', createCase);
app.get('/cases', getCases);
app.post('/users', createUser);
app.get('/users', getUsers);

app.get('*', function (req, res) {
    res.sendFile(path.join(buildDirectory, 'index.html'));
});

app.use(errorHandler)

module.exports = app;