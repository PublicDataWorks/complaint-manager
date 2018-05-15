const express = require('express');
const path = require('path');
const bodyParser = require('body-parser');
const helmet = require("helmet");
const config = require('./config/config')
const healthCheck = require("./handlers/healthCheck");
const errorHandler = require("./handlers/errorHandler");
const apiRouter = require("./apiRouter");
const httpContext = require('express-http-context');

const app = express();
const twoYearsInSeconds = 63113852;
app.use(helmet.hsts({
    maxAge: twoYearsInSeconds
}))

app.use(helmet.frameguard({ action: 'deny' }))
app.use(helmet.noSniff())

app.use(helmet.contentSecurityPolicy({
    directives: {
        formAction: [ "'none'" ],
        defaultSrc: [ "'none'" ],
        baseUri: [ "'none'" ],
        connectSrc: config[process.env.NODE_ENV].contentSecurityPolicy.connectSrc,
        fontSrc: ['https://fonts.googleapis.com' ,'https://fonts.gstatic.com'],
        objectSrc: ["'none'"],
        imgSrc: ["'self'", "data:"],
        scriptSrc: ["'self'", 'https://maps.googleapis.com'],
        styleSrc: ["'self'", 'https://fonts.googleapis.com', "'unsafe-inline'"]
    }
}))

const buildDirectory = path.join(__dirname, '../../build');
app.use(httpContext.middleware);

app.use(bodyParser.json());
app.use(express.static(buildDirectory));

app.get('/health-check', healthCheck);

app.use('/api', apiRouter)

app.get('*', function (req, res) {
    res.sendFile(path.join(buildDirectory, 'index.html'));
});

app.use(errorHandler)

module.exports = app;