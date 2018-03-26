const express = require('express');
const path = require('path');
const bodyParser = require('body-parser');

const healthCheck = require("./handlers/healthCheck");
const errorHandler = require("./handlers/errorHandler");
const apiRouter = require("./apiRouter")

const app = express();
const buildDirectory = path.join(__dirname, '../../build');

app.use(bodyParser.json());
app.use(express.static(buildDirectory));

app.get('/health-check', healthCheck);

app.use('/api', apiRouter)

app.get('*', function (req, res) {
    res.sendFile(path.join(buildDirectory, 'index.html'));
});

app.use(errorHandler)

module.exports = app;