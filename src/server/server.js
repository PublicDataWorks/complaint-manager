const express = require('express');
const path = require('path');
const bodyParser = require('body-parser');
const helmet = require("helmet");

const healthCheck = require("./handlers/healthCheck");
const errorHandler = require("./handlers/errorHandler");
const apiRouter = require("./apiRouter")

const app = express();
const twoYearsInSeconds = 63113852;
app.use(helmet.hsts({
    maxAge: twoYearsInSeconds
}))

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