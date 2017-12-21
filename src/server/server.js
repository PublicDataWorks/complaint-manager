const express = require('express');
const path = require('path');
const models = require('./models');

const app = express();
const buildDirectory = path.join(__dirname, '../../build');

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

app.get('*', function (req, res) {
    res.sendFile(path.join(buildDirectory, 'index.html'));
});

module.exports = app;