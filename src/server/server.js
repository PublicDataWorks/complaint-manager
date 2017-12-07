const express = require('express');
const path = require('path');

const app = express();
const buildDirectory = path.join(__dirname, '../../build');

app.use(express.static(buildDirectory));

app.get('/', function (req, res) {
    res.sendFile(path.join(buildDirectory, 'index.html'));
});

module.exports = app;