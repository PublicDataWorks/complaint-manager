const express = require('express');
const path = require('path');
const models = require('./models');
const bodyParser = require('body-parser');

const createCase = require("./handlers/createCase");
const getCases = require("./handlers/getCases");

const app = express();
const buildDirectory = path.join(__dirname, '../../build');

app.use(bodyParser.json());
app.use(express.static(buildDirectory));

app.get('/health-check', (req, res) => {
    models.cases.sequelize
        .authenticate()
        .then(() => {
            res.status(200).send({message: "Success"});
        })
        .catch(err => {
            res.status(500).send({message: "Failed to connect"});
        });
});

app.post('/cases', createCase);
app.get('/cases', getCases);

app.get('*', function (req, res) {
    res.sendFile(path.join(buildDirectory, 'index.html'));
});

// app.use(errorHandler) ???
module.exports = app;